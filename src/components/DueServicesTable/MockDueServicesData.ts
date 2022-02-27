import DueService, { createDefaultDueService } from "../../shared/DueService.model";

const service1: DueService = createDefaultDueService();
const service2: DueService = {
    ...service1,
    id: service1.id + 1,
    dueDate: service1.dueDate.minus({ months: 1 }),
};
const service3: DueService = {
    ...service2,
    id: service2.id + 1,
    dueDate: service2.dueDate.minus({ months: 1 }),
};

const MOCK_DUE_SERVICES: Array<DueService> = [
    service1, service2, service3
];

export default MOCK_DUE_SERVICES;