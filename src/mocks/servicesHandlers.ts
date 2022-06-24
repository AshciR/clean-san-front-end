import {rest} from "msw";
import {getDueServicesResponse} from "./servicesEndpointResponses";
import {
  DueServiceResponse,
  GetDueServicesResponse,
  SubmitUpdateServiceRequest,
  SubmitUpdateServiceResponse,
  UpdatedServiceResponse,
  UpdatedServicesRequest
} from "../services/services.services";
import {DateTime} from "luxon";

const getDueServicesHandler = rest.get('*/v1/services', (req, res, context) => {

  const filterByDueDate = (getDueServicesResponse: GetDueServicesResponse, dueDate: string) => {

    const dueServicesBeforeDate = getDueServicesResponse.dueServices.filter(serviceResponse => {
      return DateTime.fromISO(serviceResponse.dueDate).startOf('day') <= DateTime.fromISO(dueDate).startOf('day')
    });

    return {
      dueServices: dueServicesBeforeDate
    }
  };

  const dueDate = req.url.searchParams.get('dueDate');
  const response = (dueDate) ? filterByDueDate(getDueServicesResponse, dueDate) : getDueServicesResponse

  return res(
    context.status(200),
    context.json(response)
  )

});

const submitUpdatedServicesHandler = rest.put('*/v1/services', (req, res, context) => {

  const updatedServicesRequests = req.body as SubmitUpdateServiceRequest;
  const servicesToUpdateIds = updatedServicesRequests.map(s => s.id);

  // Using the mock Due services response as the base for update logic.
  // Find the mock due services which match the ids in the request
  // Then construct a response based on the data in the request
  const updatedServices: UpdatedServiceResponse[] = getDueServicesResponse.dueServices
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

const convertDueServiceResponseToUpdatedServiceResponse = (dueServiceResponse: DueServiceResponse,
                                                           updatedServicesRequests: UpdatedServicesRequest[]) => {

  const findMatchingRequest = (dueServiceResponse: DueServiceResponse, updatedServicesRequests: UpdatedServicesRequest[]) => {

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