import {
  ClientWithContracts,
  createClientWithContracts,
  createDefaultClientWithContracts
} from "./ClientWithContracts.model";
import {ContractStatus, createContract, ServiceFrequency} from "./Contract.model";
import {DateTime} from "luxon";

const rickAndMorty = createDefaultClientWithContracts();
const spaceGhost = createClientWithContracts({
  client: {
    id: 2,
    name: 'Space Ghost',
    primaryContactFirstName: 'Cartoon',
    primaryContactLastName: 'Network',
    email: 'space@gmail.com',
    isActive: false,
  },
  isActive: false,
  contracts: [createContract({
    id: 2,
    clientId: 2,
    startDate: DateTime.now(),
    endDate: DateTime.now().plus({years: 1}),
    serviceFrequency: ServiceFrequency.FORTNIGHTLY,
    status: ContractStatus.ACTIVE
  })]
})

const MOCK_CLIENTS_WITH_CONTRACTS: ClientWithContracts[] = [rickAndMorty, spaceGhost];

export default MOCK_CLIENTS_WITH_CONTRACTS;
