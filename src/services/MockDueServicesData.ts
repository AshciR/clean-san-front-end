import DueService, { createDefaultDueService } from "../shared/DueService.model";
import ServiceStatus from "../shared/ServiceStatus.model";

const notCompletedService: DueService = createDefaultDueService();
const inProgressService: DueService = {
    ...notCompletedService,
    id: notCompletedService.id + 1,
    dueDate: notCompletedService.dueDate.minus({ months: 1 }),
    currentStatus: ServiceStatus.IN_PROGRESS
};
const completedService: DueService = {
    ...inProgressService,
    id: inProgressService.id + 1,
    dueDate: inProgressService.dueDate.minus({ months: 1 }),
    currentStatus: ServiceStatus.COMPLETED
};
const cancelledService: DueService = {
    ...inProgressService,
    id: completedService.id + 1,
    dueDate: completedService.dueDate.minus({ months: 1 }),
    currentStatus: ServiceStatus.CANCELLED
};

const MOCK_DUE_SERVICES: Array<DueService> = [
    notCompletedService, inProgressService, completedService, cancelledService
];

export default MOCK_DUE_SERVICES;