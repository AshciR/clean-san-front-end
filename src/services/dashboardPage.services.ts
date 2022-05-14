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
const convertDueServicesResponseToDueService = (response: DueServicesResponse): DueService => {

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

  const convertServiceHistoryResponseToServiceHistory = (history: ServiceHistoryResponse[]): ServiceHistory[] => {

    const convertSingleHistory = (response: ServiceHistoryResponse): ServiceHistory => ({
      id: response.id,
      status: response.status as ServiceStatus,
      updateTime: DateTime.fromISO(response.updateTime)
    });

    return history.map(response => convertSingleHistory(response))
  };

  return {
    id: response.id,
    client: convertClientResponseToClient(response.client),
    contract: convertContractResponseToContract(response.contract),
    currentStatus: response.currentStatus as ServiceStatus,
    dueDate: DateTime.fromISO(response.dueDate),
    history: convertServiceHistoryResponseToServiceHistory(response.history),
  };

};

const submitUpdatedServices = (servicesToBeSubmitted: DueService[]) => {

  const updatedServices = servicesToBeSubmitted
    .filter(service => !!service.prospectiveStatus)
    .map(service => updateCurrentStatusWithProspectiveStatus(service));

  return new Promise<DueService[]>(resolve =>
    setTimeout(() => resolve(updatedServices), 250)
  );
};

const updateCurrentStatusWithProspectiveStatus = (service: DueService) => {

  const updatedService: DueService = {
    ...service,
    currentStatus: service.prospectiveStatus || service.currentStatus,
    prospectiveStatus: undefined
  }

  return updatedService
};

// Response Data Types

type GetDueServicesResponse = {
  dueServices: DueServicesResponse[];
};

type DueServicesResponse = {
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

export {fetchDueServices, submitUpdatedServices, convertDueServicesResponseToDueService};
export type {GetDueServicesResponse, DueServicesResponse, ClientResponse, ContractResponse, ServiceHistoryResponse}