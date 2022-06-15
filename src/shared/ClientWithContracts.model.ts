import Contract, {createDefaultContract} from "./Contract.model";

interface ClientWithContracts {
  id: number;
  name: string;
  email: string;
  contracts: Contract[];
  isActive: boolean;
}

const createClientWithContracts = ({
                                     id,
                                     name,
                                     email,
                                     isActive = true,
                                     contracts = []
                                   }: ClientWithContracts): ClientWithContracts => ({
  id: id,
  name: name,
  email: email,
  isActive: isActive,
  contracts: contracts
});

const createDefaultClientWithContracts = (): ClientWithContracts => createClientWithContracts({
  id: 1,
  name: 'Rick & Morty Adventures',
  email: 'rickandmorty@adultswim.com',
  isActive: true,
  contracts: [createDefaultContract()]
});

export {createClientWithContracts, createDefaultClientWithContracts};
export type {ClientWithContracts};
