import {
  ClientResponse,
  convertClientResponseToClientWithContracts,
  fetchClientsWithContracts
} from "./clients.services";
import {getClientsResponse} from "../mocks/clientsEndpointResponses";
import {ContractStatus, createContract, ServiceFrequency} from "../shared/Contract.model";
import {DateTime} from "luxon";
import {ClientWithContracts} from "../shared/ClientWithContracts.model";

describe('Clients Services', () => {

  it('fetches the clients successfully', async () => {

    // When: the clients are fetched
    const clients = await fetchClientsWithContracts();

    // Then: The clients should be present
    const expectedServices = getClientsResponse.clients.map((clientResponse: ClientResponse) =>
      convertClientResponseToClientWithContracts(clientResponse)
    )

    expect(clients.length).toBe(expectedServices.length);
    expect(clients).toStrictEqual(expectedServices);

  });

  it('converts Clients response to domain model', () => {

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

});