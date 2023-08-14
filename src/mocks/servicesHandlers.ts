import {rest} from "msw";
import {getDueServicesResponse} from "./servicesEndpointResponses";
import {
  GetDueServicesResponse,
  GetServicesForContractResponse,
  ServiceQueryResponse,
  ServiceResponse,
  SubmitUpdateServiceRequest,
  SubmitUpdateServiceResponse,
  UpdatedServicesRequest
} from "../services/services.services";
import {DateTime} from "luxon";

const getDueServicesHandler = rest.get('*/v1/services', (req, res, context) => {

  const contractId = Number(req.url.searchParams.get('contractId'));
  if (contractId) {
    return filterResponseBasedOnContractId(contractId, res, context);
  }

  const dueDate = req.url.searchParams.get('dueDate');
  const page = req.url.searchParams.get('page') || 0;
  const itemsPerPage = req.url.searchParams.get('itemsPerPage') || 50;
  const sort = req.url.searchParams.get('sort') || 'due_date:asc';

  if (dueDate) {
    return filterResponseBasedOnDueDate(dueDate, page, itemsPerPage, sort, res, context);
  }

  return res(
    context.status(200),
    context.json(getDueServicesResponse)
  );

});

// @ts-ignore
const filterResponseBasedOnContractId = (contractId, res, context) => {
  const filterByContractId = (getDueServicesResponse: GetDueServicesResponse, contractId: number) =>
    getDueServicesResponse.services
      .filter(service => service.contract.id === contractId)

  const services = filterByContractId(getDueServicesResponse, contractId);
  const response: GetServicesForContractResponse = {
    currentPage: 0,
    totalItems: services.length,
    totalPages: services.length !== 0 ? 1 : 0,
    services: services
  }

  return res(
    context.status(200),
    context.json(response)
  )
}

// @ts-ignore
const filterResponseBasedOnDueDate = (dueDate, page, itemsPerPage, sort, res, context) => {

  const filterByDueDate = (getDueServicesResponse: GetDueServicesResponse, dueDate: string) =>
    getDueServicesResponse.services.filter(serviceResponse =>
      DateTime.fromISO(serviceResponse.dueDate).startOf('day') <= DateTime.fromISO(dueDate).startOf('day')
    );

  const services = filterByDueDate(getDueServicesResponse, dueDate);
  const paginatedServices = paginate(services, page, itemsPerPage);
  const sortedServices = sortServices(paginatedServices, sort);

  const response: GetDueServicesResponse = {
    currentPage: Number(page),
    totalItems: services.length,
    totalPages: Math.ceil(services.length / itemsPerPage),
    services: sortedServices
  }

  return res(
    context.status(200),
    context.json(response)
  );
};

const sortServices = (paginatedServices: ServiceQueryResponse[], sort: string) => {
  const parts = sort.split(":");
  const orderBy = parts[0] || "due_date";
  const direction = parts[1] || "desc";

  const sortCondition = {
    "client": sortByClientName,
    "status": sortByStatusName,
    "due_date": sortByDueDate
  }

  // @ts-ignore
  const comparator = sortCondition[orderBy](direction);
  return paginatedServices.sort(comparator);

}

const sortByClientName = (direction: string) => (a: ServiceQueryResponse, b: ServiceQueryResponse) => {
  const nameA = a.client.name.toLowerCase();
  const nameB = b.client.name.toLowerCase();
  const compareResult = nameA.localeCompare(nameB);
  return direction === "asc" ? compareResult : -compareResult;
};

const sortByStatusName = (direction: string) => (a: ServiceQueryResponse, b: ServiceQueryResponse) => {
  const statusA = a.currentStatus.toLowerCase();
  const statusB = b.currentStatus.toLowerCase();
  const compareResult = statusA.localeCompare(statusB);
  return direction === "asc" ? compareResult : -compareResult;
};

const sortByDueDate = (direction: string) => (a: ServiceQueryResponse, b: ServiceQueryResponse) => {
  const dateA = DateTime.fromISO(a.dueDate);
  const dateB = DateTime.fromISO(b.dueDate);
  const compareResult = dateA.toMillis() - dateB.toMillis();
  return direction === "asc" ? compareResult : -compareResult;
};

const paginate = (services: ServiceQueryResponse[], page: number, itemsPerPage: number) => {

  const startIndex = page * itemsPerPage;
  const endIndex = startIndex + Number(itemsPerPage);

  return services.slice(startIndex, endIndex);
};

const submitUpdatedServicesHandler = rest.put('*/v1/services', (req, res, context) => {

  const updatedServicesRequests = req.body as SubmitUpdateServiceRequest;
  const servicesToUpdateIds = updatedServicesRequests.map(s => s.id);

  // Using the mock Due services response as the base for update logic.
  // Find the mock due services which match the ids in the request
  // Then construct a response based on the data in the request
  const updatedServices: ServiceResponse[] = getDueServicesResponse.services
    .filter(dueServiceResponse => servicesToUpdateIds.includes(dueServiceResponse.id))
    .map(dueServiceToUpdate => convertDueServiceResponseToUpdatedServiceResponse(dueServiceToUpdate, updatedServicesRequests))

  const response: SubmitUpdateServiceResponse = {
    updatedServices: updatedServices
  }

  return res(
    context.status(200),
    context.json(response)
  )

});

const convertDueServiceResponseToUpdatedServiceResponse = (dueServiceResponse: ServiceQueryResponse,
                                                           updatedServicesRequests: UpdatedServicesRequest[]) => {

  const findMatchingRequest = (dueServiceResponse: ServiceQueryResponse, updatedServicesRequests: UpdatedServicesRequest[]) => {

    // The fallback should never happen b/c the requests were build based on the responses.
    return updatedServicesRequests.find(req => req.id === dueServiceResponse.id) || updatedServicesRequests[0]
  };

  const incrementDateTimeByOneDay = (updateTime: string) => {

    return DateTime.fromISO(updateTime)
      .plus({day: 1})
      .toISODate()
  };

  const lastUpdateHistory = dueServiceResponse.history[dueServiceResponse.history.length - 1];

  return {
    id: dueServiceResponse.id,
    contractId: dueServiceResponse.contract.id,
    dueDate: dueServiceResponse.dueDate,
    currentStatus: findMatchingRequest(dueServiceResponse, updatedServicesRequests).currentStatus,
    history: [
      ...dueServiceResponse.history,
      {
        id: lastUpdateHistory.id + 1,
        status: findMatchingRequest(dueServiceResponse, updatedServicesRequests).currentStatus,
        updateTime: incrementDateTimeByOneDay(lastUpdateHistory.updateTime)
      }
    ]
  }
};

export const servicesHandlers = [
  getDueServicesHandler, submitUpdatedServicesHandler
]
