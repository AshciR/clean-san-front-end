import {rest} from "msw";
import {getClientsResponse} from "./clientsEndpointResponses";
import {
  AddClientRequest,
  AddClientResponse,
  AddContractRequest,
  GetClientResponse,
  GetClientsResponse,
  UpdateContractRequest
} from "../services/clients.services";
import {ContractResponse} from "../services/shared-responses";
import {ContractStatus} from "../shared/Contract.model";


const getClientsHandler = rest.get('*/v1/clients', (req, res, context) => {

  const page = Number(req.url.searchParams.get('page')) || 0;
  const itemsPerPage = Number(req.url.searchParams.get('itemsPerPage')) || 50;
  const sort = req.url.searchParams.get('sort') || 'name:asc';

  const paginatedClients = paginate(getClientsResponse.clients, page, itemsPerPage);
  const sortedClients = sortClients(paginatedClients, sort);

  const response: GetClientsResponse = {
    currentPage: page,
    totalItems: getClientsResponse.clients.length,
    totalPages: Math.ceil(getClientsResponse.clients.length / itemsPerPage),
    clients: sortedClients
  }

  return res(
    context.status(200),
    context.json(response)
  )

});

const sortClients = (paginatedClients: GetClientResponse[], sort: string) => {
  const parts = sort.split(":");
  const orderBy = parts[0] || "name";
  const direction = parts[1] || "asc";

  const sortCondition = {
    "name": sortByName,
  }

  // @ts-ignore
  const comparator = sortCondition[orderBy](direction);
  return paginatedClients.sort(comparator);

}

const sortByName = (direction: string) => (a: GetClientResponse, b: GetClientResponse) => {
  const nameA = a.name.toLowerCase();
  const nameB = b.name.toLowerCase();
  const compareResult = nameA.localeCompare(nameB);
  return direction === "asc" ? compareResult : -compareResult;
};

const paginate = (clients: GetClientResponse[], page: number, itemsPerPage: number) => {

  const startIndex = page * itemsPerPage;
  const endIndex = startIndex + Number(itemsPerPage);

  return clients.slice(startIndex, endIndex);
};

const addClientHandler = rest.post('*/v1/clients', (req, res, context) => {

  const addClientRequest = req.body as AddClientRequest;

  const determineNextId = (getClientsResponse: GetClientsResponse) =>
    getClientsResponse.clients[getClientsResponse.clients.length - 1].id + 1;

  const response: AddClientResponse = {
    id: determineNextId(getClientsResponse),
    name: addClientRequest.name,
    primaryContactFirstName: addClientRequest.primaryContactFirstName,
    primaryContactLastName: addClientRequest.primaryContactLastName,
    telephoneNumber: addClientRequest.telephoneNumber,
    email: addClientRequest.email
  };

  return res(
    context.status(201),
    context.json(response)
  );

});

const addContractHandler = rest.post('*/v1/clients/:clientId/contracts', (req, res, context) => {

  const {clientId} = req.params;
  const clientWithContract = getClientsResponse.clients.find(client => client.id === Number(clientId));

  if (clientWithContract) {

    const addContractRequest = req.body as AddContractRequest;

    const response: ContractResponse = {
      id: determineNextContractId(getClientsResponse),
      clientId: Number(clientId),
      startDate: addContractRequest.startDate,
      endDate: addContractRequest.endDate,
      serviceFrequency: addContractRequest.serviceFrequency,
      status: ContractStatus.INACTIVE,
    };

    return res(
      context.status(201),
      context.json(response)
    );

  }

  // Client doesn't exist, so we can't create a contract
  return res(
    context.status(404)
  );

});

const updateContractHandler = rest.put('*/v1/clients/:clientId/contracts/:contractId', (req, res, context) => {

  const contracts: ContractResponse[] = getAllContractsInResponse(getClientsResponse);
  const {contractId} = req.params;

  const matchingContract = findContract(contracts, Number(contractId));

  // Contract doesn't exist in our mocked responses
  if (!matchingContract) {
    return res(
      context.status(404),
    );
  }

  // Can't update cancelled or completed contracts
  // The system forces you to create a new one
  if(matchingContract.status === ContractStatus.CANCELLED || matchingContract.status === ContractStatus.COMPLETED){
    return res(
      context.status(400),
    );
  }

  const updateContractRequest = req.body as UpdateContractRequest;

  const response: ContractResponse = {
    id: updateContractRequest.id,
    clientId: updateContractRequest.clientId,
    startDate: updateContractRequest.startDate,
    endDate: updateContractRequest.endDate,
    serviceFrequency: updateContractRequest.serviceFrequency,
    status: updateContractRequest.status
  }

  return res(
    context.status(200),
    context.json(response)
  );


});

const findContract = (contracts: ContractResponse[], contractId: number) => {
  return contracts.find(contract => contract.id === contractId);
};

const determineNextContractId = (getClientsResponse: GetClientsResponse) => {
  const contracts = getAllContractsInResponse(getClientsResponse);
  return contracts[contracts.length - 1].id + 1;

}

const getAllContractsInResponse = (getClientsResponse: GetClientsResponse) => {

  const allContracts = getClientsResponse.clients
    .map(client => client.contracts);
  // The mapping returns an array of array [ [{}, {}], [{}] ]
  // We need to convert it to [{}, {}, {}]
  const flattenedContracts = flattenArray(allContracts);

  flattenedContracts.sort((a: ContractResponse, b: ContractResponse) => a.id - b.id);
  return flattenedContracts;

}
// @ts-ignore
const flattenArray = (data: any[]) => {
  // our initial value this time is a blank array
  // call reduce on our data
  return data.reduce((total, value) => {
    // if the value is an array then recursively call reduce
    // if the value is not an array then just concat our value

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return total.concat(Array.isArray(value) ? flattenArray(value) : value);
  }, []);

};

export const clientsHandlers = [
  getClientsHandler, addClientHandler, addContractHandler, updateContractHandler
]
