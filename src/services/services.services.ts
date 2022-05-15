import {DateTime} from "luxon";
import DueService from "../shared/DueService.model";
import axios from "../axiosConfig";
import ServiceStatus from "../shared/ServiceStatus.model";
import Client from "../shared/Client.model";
import Contract, {ContractStatus, ServiceFrequency} from "../shared/Contract.model";
import ServiceHistory from "../shared/ServiceHistory.model";

/**
 * Fetches the due services from the backend
 * @param beforeDate services due before and on this date
 */
const fetchDueServices = async (beforeDate?: DateTime) => {

  const params = (beforeDate) ? {dueDate: beforeDate.toISODate()} : null

  try {

    const response = await axios.get<GetDueServicesResponse>('/v1/services', {params});
    const dueServices = response.data.dueServices.map(serviceResponse =>
      convertDueServicesResponseToDueService(serviceResponse)
    );

    return dueServices || [];

  } catch (error) {
    throw error
  }
};

/**
 * Helper method to convert the DueServices response into the domain model
 * @param response DueServiceResponse
 */
const convertDueServicesResponseToDueService = (response: DueServiceResponse): DueService => {

  const convertClientResponseToClient = (client: ClientResponse): Client => ({
    id: client.id,
    name: client.name,
    email: client.email
  });

  const convertContractResponseToContract = (contract: ContractResponse): Contract => ({
    id: contract.id,
    clientId: contract.clientId,
    startDate: DateTime.fromISO(contract.startDate),
    endDate: DateTime.fromISO(contract.endDate),
    serviceFrequency: contract.serviceFrequency as ServiceFrequency,
    status: contract.status as ContractStatus
  });

  return {
    id: response.id,
    client: convertClientResponseToClient(response.client),
    contract: convertContractResponseToContract(response.contract),
    currentStatus: response.currentStatus as ServiceStatus,
    dueDate: DateTime.fromISO(response.dueDate),
    history: convertServiceHistoryResponseToServiceHistory(response.history),
  };

};

/**
 * Submits the services that were updated.
 * The caller will pass in all the services in the application state.
 * This function will filter out the services that should be submitted.
 * @param services all the services in the application state
 * @return the services that were updated
 */
const submitUpdatedServices = async (services: DueService[]) => {

  // We only want to submit the services whose statues have been changed
  const updatedServicesRequest: SubmitUpdateServiceRequest = services
    .filter(service => !!service.prospectiveStatus)
    .map(service => createUpdateServicesRequest(service));

  try {

    const response = await axios.put<SubmitUpdateServiceResponse>(
      '/v1/services',
      updatedServicesRequest
    );

    // We need to convert the update service response into our
    // domain model before returning it to the application state
    return response.data.updatedServices.map(updatedServiceResponse => {

      // We want to find the service in the application state that matches the response
      // of the service that was updated.
      const serviceThatWasUpdated = services.find(s => s.id === updatedServiceResponse.id)

      // @ts-ignore serviceThatWasUpdated can not be undefined because it was submitted above
      return convertUpdatedServiceResponseToDueService(updatedServiceResponse, serviceThatWasUpdated)
    })

  } catch (error) {
    throw error
  }

};

const createUpdateServicesRequest = (service: DueService) => {

  const updateServiceRequest: UpdatedServicesRequest = {
    id: service.id,
    // Confident this will use service.prospectiveStatus b/c
    // it will be pre-filtered before the method is called
    currentStatus: service.prospectiveStatus || service.currentStatus
  }

  return updateServiceRequest
};

/**
 * Helper method to convert the UpdatedService responses into the domain model.
 * We have to pass in a correspondingService because the response does not have
 * the client and contract data in it.
 * @param updatedServiceResponse UpdatedServiceResponse
 * @param correspondingService the DueService that corresponds with the UpdatedServiceResponse
 */
const convertUpdatedServiceResponseToDueService = (updatedServiceResponse: UpdatedServiceResponse,
                                                   correspondingService: DueService): DueService => {

  return {
    id: updatedServiceResponse.id,
    client: {...correspondingService.client},     // Response doesn't have these values, that's why we're copying them
    contract: {...correspondingService.contract}, // Response doesn't have these values, that's why we're copying them
    currentStatus: updatedServiceResponse.currentStatus as ServiceStatus,
    dueDate: DateTime.fromISO(updatedServiceResponse.dueDate),
    history: convertServiceHistoryResponseToServiceHistory(updatedServiceResponse.history)
  }

};

const convertServiceHistoryResponseToServiceHistory = (history: ServiceHistoryResponse[]): ServiceHistory[] => {

  const convertSingleHistory = (response: ServiceHistoryResponse): ServiceHistory => ({
    id: response.id,
    status: response.status as ServiceStatus,
    updateTime: DateTime.fromISO(response.updateTime)
  });

  return history.map(response => convertSingleHistory(response))
};

// Get Due Services Data Types

type GetDueServicesResponse = {
  dueServices: DueServiceResponse[];
};

type DueServiceResponse = {
  id: number;
  client: ClientResponse;
  contract: ContractResponse;
  dueDate: string;
  currentStatus: string;
  history: ServiceHistoryResponse[];
};

type ClientResponse = {
  id: number;
  name: string;
  email: string;
};

type ContractResponse = {
  id: number;
  clientId: number;
  startDate: string;
  endDate: string;
  serviceFrequency: string;
  status: string;
};

type ServiceHistoryResponse = {
  id: number;
  status: string;
  updateTime: string;
}

// Submit Updated Services Data Types

type SubmitUpdateServiceResponse = {
  updatedServices: UpdatedServiceResponse[]
}

type UpdatedServiceResponse = {
  id: number;
  contractId: number;
  dueDate: string;
  currentStatus: string;
  history: ServiceHistoryResponse[]
}

type SubmitUpdateServiceRequest = UpdatedServicesRequest[]

type UpdatedServicesRequest = {
  id: number;
  currentStatus: string;
}

export {
  fetchDueServices,
  submitUpdatedServices,
  convertDueServicesResponseToDueService,
  convertUpdatedServiceResponseToDueService
};
export type {
  GetDueServicesResponse,
  DueServiceResponse,
  ClientResponse,
  ContractResponse,
  ServiceHistoryResponse,
  SubmitUpdateServiceResponse,
  UpdatedServiceResponse,
  SubmitUpdateServiceRequest,
  UpdatedServicesRequest
}