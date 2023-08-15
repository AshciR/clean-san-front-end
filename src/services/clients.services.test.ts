import {
  addClient,
  AddClientResponse,
  addContractToClient,
  convertAddedClientResponseToClient,
  convertClientResponseToClientWithContracts,
  fetchClientsWithContracts,
  GetClientResponse,
  updateContract
} from "./clients.services";
import {getClientsResponse} from "../mocks/clientsEndpointResponses";
import {ContractStatus, createContract, ServiceFrequency} from "../shared/Contract.model";
import {DateTime} from "luxon";
import {ClientWithContracts} from "../shared/ClientWithContracts.model";
import Client, {createDefaultClient} from "../shared/Client.model";

describe('Clients Services', () => {

  it('fetches the clients successfully', async () => {

    // When: the clients are fetched
    const paginatedClients = await fetchClientsWithContracts();

    // Then: The clients should be present
    const expectedClients = getClientsResponse.clients.map((clientResponse: GetClientResponse) =>
      convertClientResponseToClientWithContracts(clientResponse)
    )

    expect(paginatedClients.clients.length).toBe(expectedClients.length);

    const compareByNameAsc = (a: ClientWithContracts, b: ClientWithContracts) => a.name.localeCompare(b.name);
    expect(paginatedClients.clients).toStrictEqual(expectedClients.sort(compareByNameAsc));

  });

  it('fetches the paginated clients successfully', async () => {

    // When: the clients are fetched using pagination
    const paginatedClients = await fetchClientsWithContracts(1, 2);

    // Then: The clients should be present
    const expectedClients = getClientsResponse.clients.slice(-2)
      .map(it => convertClientResponseToClientWithContracts(it))

    const expectedClientsResponse = {
      totalItems: 4,
      totalPages: 2,
      currentPage: 1,
      clients: expectedClients
    }

    expect(paginatedClients).toStrictEqual(expectedClientsResponse)

  });

  it('fetches the clients with sort order', async () => {

    // Given: We have the query params
    const sort = "name:desc"

    // When: the clients are fetched using pagination
    const sortedClients = await fetchClientsWithContracts(0, 25, sort);

    // Then: The clients should be sorted
    expect(sortedClients.clients.length).toEqual(4)
    expect(sortedClients.clients[0]).toStrictEqual(convertClientResponseToClientWithContracts(getClientsResponse.clients[3]))
    expect(sortedClients.clients[3]).toStrictEqual(convertClientResponseToClientWithContracts(getClientsResponse.clients[2]))

  });

  it('converts GetClientResponse to domain model', () => {

    // Given: We have a Client response
    const clientResponse = getClientsResponse.clients[3];

    // When: We convert the response
    const client = convertClientResponseToClientWithContracts(clientResponse);

    // Then: The domain should be mapped correctly
    const expectedClient: ClientWithContracts = {
      id: 4,
      name: "Space Ghost",
      email: "spaceghost@gmail.com",
      contracts: [
        createContract({
          id: 6,
          clientId: 4,
          startDate: DateTime.fromObject({year: 2022, month: 5, day: 3}),
          endDate: DateTime.fromObject({year: 2023, month: 5, day: 2}),
          serviceFrequency: ServiceFrequency.WEEKLY,
          status: ContractStatus.INACTIVE
        })
      ],
      isActive: false
    };

    expect(client).toStrictEqual(expectedClient);

  });

  it('adds a client successfully', async () => {

    // Given: We have a prospective client
    const client = createDefaultClient();

    // When: we add the client
    const addedClient = await addClient(client);

    // Then: The client info should be correct
    const idOfLastClient = getClientsResponse.clients[getClientsResponse.clients.length - 1].id;
    expect(addedClient.id).toBe(idOfLastClient + 1);
    expect(addedClient.name).toBe(client.name);
    expect(addedClient.email).toBe(client.email);
    expect(addedClient.isActive).toBeFalsy();

  });

  it('converts AddClientResponse to domain model', () => {

    // Given: We have a AddClientResponse
    const addClientResponse: AddClientResponse = {
      id: 1,
      name: "Morty",
      email: "morty@adultswim.com"
    }

    // When: We convert the response
    const client = convertAddedClientResponseToClient(addClientResponse);

    // Then: The domain should be mapped correctly
    const expectedClient: Client = {
      id: 1,
      name: "Morty",
      email: "morty@adultswim.com",
      isActive: false
    };

    expect(client).toStrictEqual(expectedClient);

  });

  it('adds a contract successfully', async () => {

    // Given: We have a new contract for a client
    const clientId = 1;
    const startDate = DateTime.local(2022, 9, 27);
    const endDate = DateTime.local(2023, 9, 26);

    const contract = createContract({
      id: 0,
      clientId: clientId,
      startDate: startDate,
      endDate: endDate,
      serviceFrequency: ServiceFrequency.MONTHLY,
      status: ContractStatus.INACTIVE
    });

    // When: we add the client
    const addedContract = await addContractToClient(contract);

    // Then: The client info should be correct
    expect(addedContract.id).toEqual(7); // There are currently 6 contracts in getClientsResponse
    expect(addedContract.clientId).toEqual(clientId);
    expect(addedContract.startDate).toEqual(startDate);
    expect(addedContract.endDate).toEqual(endDate);
    expect(addedContract.serviceFrequency).toEqual(ServiceFrequency.MONTHLY);
    expect(addedContract.status).toEqual(ContractStatus.INACTIVE);

  });

  it('updates a contract successfully', async () => {

    // Given: A contract exists
    const inactiveContract = getClientsResponse.clients[0].contracts[2];

    // And: We have the updated contract request
    const updateContractRequest = createContract({
      id: inactiveContract.id,
      clientId: inactiveContract.clientId,
      startDate: DateTime.fromISO(inactiveContract.startDate),
      endDate: DateTime.fromISO(inactiveContract.endDate),
      serviceFrequency: inactiveContract.serviceFrequency as ServiceFrequency,
      status: ContractStatus.ACTIVE
    });

    // When: We update the contract
    const updatedContract = await updateContract(updateContractRequest)

    // Then: It has the updated values
    expect(updatedContract).toStrictEqual(updateContractRequest);

  });

});