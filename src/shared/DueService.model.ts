import Client, { createDefaultClient } from "./Client.model";
import Contract, { createDefaultContract } from "./Contract.model";
import ServiceHistory, { createDefaultServiceHistory } from "./ServiceHistory.model";
import ServiceStatus from "./ServiceStatus.model";
import { DateTime } from "luxon";

interface DueService {
    id: number;
    client: Client;
    contract: Contract;
    dueDate: DateTime;
    currentStatus: ServiceStatus;
    history: Array<ServiceHistory>;
};

const createDueService = ({ id, client, contract, dueDate, currentStatus, history }: DueService): DueService => ({
    id: id,
    client: client,
    contract: contract,
    dueDate: dueDate,
    currentStatus: currentStatus,
    history: history
});

const createDefaultDueService = (): DueService => {

    const serviceHistory: ServiceHistory = createDefaultServiceHistory();

    return {
        id: 100,
        client: createDefaultClient(),
        contract: createDefaultContract(),
        dueDate: DateTime.now(),
        currentStatus: serviceHistory.status,
        history: [serviceHistory]
    };
};

export default DueService;
export { createDueService, createDefaultDueService };

