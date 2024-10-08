import {DateTime} from "luxon";

interface Contract {
  id: number;
  clientId: number;
  startDate: DateTime;
  endDate: DateTime;
  serviceFrequency: ServiceFrequency;
  status: ContractStatus;
}

enum ServiceFrequency {
  WEEKLY = 'WEEKLY',
  FORTNIGHTLY = 'FORTNIGHTLY',
  MONTHLY = 'MONTHLY'
}

enum ContractStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

const createContract = ({id, clientId, startDate, endDate, serviceFrequency, status}: Contract): Contract => ({
  id: id,
  clientId: clientId,
  startDate: startDate,
  endDate: endDate,
  serviceFrequency: serviceFrequency,
  status: status
});

const createDefaultContract = (): Contract => createContract({
  id: 10,
  clientId: 1,
  startDate: DateTime.now(),
  endDate: DateTime.now().plus({years: 1}),
  serviceFrequency: ServiceFrequency.MONTHLY,
  status: ContractStatus.ACTIVE
});

const convertToSentenceCase = (frequency: ServiceFrequency) => frequency.charAt(0) + frequency.slice(1).toLowerCase();

export default Contract;
export {createContract, createDefaultContract, ServiceFrequency, ContractStatus, convertToSentenceCase};