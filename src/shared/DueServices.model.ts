import Client from "./Client.model";
import Contract from "./Contract.model";
import ServiceHistory from "./ServiceHistory.model";
import ServiceStatus from "./ServiceStatus.model";

interface DueServices {
    id: number;
    client: Client;
    contract: Contract;
    dueDate: Date;
    currentStatus: ServiceStatus;
    history: Array<ServiceHistory>;
};

export default DueServices;
