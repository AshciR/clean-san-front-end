import {
  addClient,
  AddClientResponse,
  convertAddedClientResponseToClient,
  convertClientResponseToClientWithContracts,
  fetchClientsWithContracts,
  GetClientResponse
} from "./clients.services";
import {getClientsResponse} from "../mocks/clientsEndpointResponses";
import {ContractStatus, createContract, ServiceFrequency} from "../shared/Contract.model";
import {DateTime} from "luxon";
import {ClientWithContracts} from "../shared/ClientWithContracts.model";
import Client, {createDefaultClient} from "../shared/Client.model";

describe('Clients Services', () => {

  it('fetches the clients successfully', async () => {

    // When: the clients are fetched
    const clients = await fetchClientsWithContracts();

    // Then: The clients should be present
    const expectedServices = getClientsResponse.clients.map((clientResponse: GetClientResponse) =>
      convertClientResponseToClientWithContracts(clientResponse)
    )

    expect(clients.length).toBe(expectedServices.length);
    expect(clients).toStrictEqual(expectedServices);

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

});