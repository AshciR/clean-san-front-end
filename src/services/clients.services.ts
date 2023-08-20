import axios from "../axiosConfig";
import {ContractResponse, convertContractResponseToContract} from "./shared-responses";
import {ClientWithContracts} from "../shared/ClientWithContracts.model";
import Contract, {ContractStatus} from "../shared/Contract.model";
import Client from "../shared/Client.model";

/**
 * Fetches the clients from the backend
 */
const fetchClientsWithContracts = async (page?: number, itemsPerPage?: number, sort?:string) => {

  const params = {
    page: page,
    itemsPerPage: itemsPerPage,
    sort: sort
  };

  try {

    const response = await axios.get<GetClientsResponse>('/v1/clients', {params})
    return convertGetClientsResponseToPaginatedClientsWithContracts(response.data)

  } catch (error) {
    throw error;
  }

}

const convertGetClientsResponseToPaginatedClientsWithContracts = (response: GetClientsResponse) => {

  const clientsWithContracts = response.clients.map(response => convertClientResponseToClientWithContracts(response));

  return {
    totalItems: response.totalItems,
    totalPages: response.totalPages,
    currentPage: response.currentPage,
    clients: clientsWithContracts
  };

};

/**
 * Helper method to convert the ClientResponse response into the ClientWithContracts domain model
 * @param response
 */
const convertClientResponseToClientWithContracts = (response: GetClientResponse): ClientWithContracts => {

  const isAnyContractActive = (contracts: ContractResponse[]) => (
    contracts.some(contract => contract.status === ContractStatus.ACTIVE)
  );

  return {
    id: response.id,
    name: response.name,
    email: response.email,
    contracts: response.contracts.map(contract => convertContractResponseToContract(contract)),
    isActive: isAnyContractActive(response.contracts)
  }
};

/**
 * Submits a client to be added to the system
 * @param prospectiveClient the client to be added
 */
const addClient = async (prospectiveClient: Client): Promise<Client> => {

  try {

    const clientRequest: AddClientRequest = {
      name: prospectiveClient.name,
      primaryContactFirstName: prospectiveClient.primaryContactFirstName,
      primaryContactLastName: prospectiveClient.primaryContactLastName,
      telephoneNumber: prospectiveClient.telephoneNumber,
      email: prospectiveClient.email
    }

    const response = await axios.post<AddClientResponse>(
      '/v1/clients',
      clientRequest
    );

    return convertAddedClientResponseToClient(response.data)

  } catch (error) {
    throw error;
  }

}

/**
 * Helper method to convert the AddClientResponse response into the Client domain model
 * @param response
 */
const convertAddedClientResponseToClient = (response: AddClientResponse): Client => ({
  id: response.id,
  name: response.name,
  primaryContactFirstName: response.primaryContactFirstName,
  primaryContactLastName: response.primaryContactLastName,
  telephoneNumber: response.telephoneNumber,
  email: response.email,
  isActive: false
});

/**
 * Submits a contract to be added to a client
 * @param contract the contract to be added
 */
const addContractToClient = async (contract: Contract): Promise<Contract> => {

  try {

    const contractRequest: AddContractRequest = {
      startDate: contract.startDate.toISODate(),
      endDate: contract.endDate.toISODate(),
      serviceFrequency: contract.serviceFrequency
    };

    const response = await axios.post<ContractResponse>(
      `/v1/clients/${contract.clientId}/contracts`,
      contractRequest
    );

    return convertContractResponseToContract(response.data);

  } catch (error) {
    throw error
  }

}

const updateContract = async (contract: Contract): Promise<Contract> => {

  try {

    const contractRequest: UpdateContractRequest = {
      id: contract.id,
      clientId: contract.clientId,
      startDate: contract.startDate.toISODate(),
      endDate: contract.endDate.toISODate(),
      serviceFrequency: contract.serviceFrequency,
      status: contract.status
    }

    const response = await axios.put<ContractResponse>(
      `/v1/clients/${contract.clientId}/contracts/${contract.id}`,
      contractRequest
    )

    return convertContractResponseToContract(response.data);

  } catch (error) {
    throw error
  }

}

type GetClientsResponse = {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  clients: GetClientResponse[];
};

type GetClientResponse = {
  id: number;
  name: string;
  email: string;
  contracts: ContractResponse[]
};

type AddClientRequest = {
  name: string;
  primaryContactFirstName: string;
  primaryContactLastName: string;
  telephoneNumber?: string;
  email?: string;
};

type AddClientResponse = {
  id: number;
  name: string;
  primaryContactFirstName: string;
  primaryContactLastName: string;
  telephoneNumber?: string;
  email?: string;
};

type AddContractRequest = {
  startDate: string;
  endDate: string;
  serviceFrequency: string;
}

type UpdateContractRequest = {
  id: number;
  clientId: number;
  startDate: string;
  endDate: string;
  serviceFrequency: string;
  status: string;
}

export type {
  GetClientsResponse,
  GetClientResponse,
  AddClientRequest,
  AddClientResponse,
  AddContractRequest,
  UpdateContractRequest
}
export {
  fetchClientsWithContracts,
  convertClientResponseToClientWithContracts,
  addClient,
  convertAddedClientResponseToClient,
  addContractToClient,
  updateContract
}