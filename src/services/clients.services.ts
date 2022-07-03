import axios from "../axiosConfig";
import {ContractResponse, convertContractResponseToContract} from "./shared-responses";
import {ClientWithContracts} from "../shared/ClientWithContracts.model";
import {ContractStatus} from "../shared/Contract.model";
import Client from "../shared/Client.model";

/**
 * Fetches the clients from the backend
 */
const fetchClientsWithContracts = async () => {

  try {

    const response = await axios.get<GetClientsResponse>('/v1/clients')
    const clients = response.data.clients.map(response => convertClientResponseToClientWithContracts(response))

    return clients || [];

  } catch (error) {
    throw error;
  }

}

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
  email: response.email,
  isActive: false
});

type GetClientsResponse = {
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
  email: string;
};

type AddClientResponse = {
  id: number;
  name: string;
  email: string;
};

export type {GetClientsResponse, GetClientResponse, AddClientRequest, AddClientResponse}
export {
  fetchClientsWithContracts,
  convertClientResponseToClientWithContracts,
  addClient,
  convertAddedClientResponseToClient
}