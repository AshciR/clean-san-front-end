import ServiceStatus from "./ServiceStatus.model";

interface ServiceHistory {
    id: number;
    status: ServiceStatus;
    updateTime: Date;
};

export default ServiceHistory;