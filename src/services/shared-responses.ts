import Contract, {ContractStatus, ServiceFrequency} from "../shared/Contract.model";
import {DateTime} from "luxon";

type ContractResponse = {
  id: number;
  clientId: number;
  startDate: string;
  endDate: string;
  serviceFrequency: string;
  status: string;
};

const convertContractResponseToContract = (contract: ContractResponse): Contract => ({
  id: contract.id,
  clientId: contract.clientId,
  startDate: DateTime.fromISO(contract.startDate),
  endDate: DateTime.fromISO(contract.endDate),
  serviceFrequency: contract.serviceFrequency as ServiceFrequency,
  status: contract.status as ContractStatus
});

export {convertContractResponseToContract};
export type {ContractResponse};
