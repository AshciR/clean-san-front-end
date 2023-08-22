import Contract, {createDefaultContract} from "./Contract.model";
import Client, {createDefaultClient} from "./Client.model";

interface ClientWithContracts {
  client: Client
  contracts: Contract[];
  isActive: boolean;
}

const createClientWithContracts = ({
                                     client,
                                     isActive = true,
                                     contracts = []
                                   }: ClientWithContracts): ClientWithContracts => ({
  client: client,
  isActive: isActive,
  contracts: contracts
});

const createDefaultClientWithContracts = (): ClientWithContracts => createClientWithContracts({
  client: createDefaultClient(),
  isActive: true,
  contracts: [createDefaultContract()]
});

export {createClientWithContracts, createDefaultClientWithContracts};
export type {ClientWithContracts};
