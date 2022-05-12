import { DateTime } from "luxon";
import ServiceStatus from "./ServiceStatus.model";

interface ServiceHistory {
    id: number;
    status: ServiceStatus;
    updateTime: DateTime;
}

const createServiceHistory = ({ id, status, updateTime }: ServiceHistory): ServiceHistory => ({
    id: id,
    status: status,
    updateTime: updateTime
});

const createDefaultServiceHistory = (): ServiceHistory => createServiceHistory({
    id: 1000,
    status: ServiceStatus.NOT_COMPLETED,
    updateTime: DateTime.now()
});

export default ServiceHistory;
export { createServiceHistory, createDefaultServiceHistory };