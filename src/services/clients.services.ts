import axios from "../axiosConfig";
import {ContractResponse, convertContractResponseToContract} from "./shared-responses";
import {ClientWithContracts} from "../shared/ClientWithContracts.model";
import {ContractStatus} from "../shared/Contract.model";

/**
 * Fetches the clients from the backend
 */
const fetchClientsWithContracts = async () => {

  try {

    const response = await axios.get<GetClientsResponse>('/v1/clients')
    const clients = response.data.clients.map(response => convertClientResponseToClientWithContracts(response))

    return clients || [];

  } catch (error) {
    throw error
  }

}

/**
 * Helper method to convert the ClientResponse response into the Client domain model
 * @param response
 */
const convertClientResponseToClientWithContracts = (response: ClientResponse): ClientWithContracts => {

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

type GetClientsResponse = {
  clients: ClientResponse[];
};

type ClientResponse = {
  id: number;
  name: string;
  email: string;
  contracts: ContractResponse[]
};

export type {GetClientsResponse, ClientResponse}
export {fetchClientsWithContracts, convertClientResponseToClientWithContracts}