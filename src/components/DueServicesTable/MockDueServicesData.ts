import DueService, { createDefaultDueService } from "../../shared/DueService.model";

const service1: DueService = createDefaultDueService();
const service2: DueService = {
    ...service1,
    id: 200,
    dueDate: service1.dueDate.plus({ months: 1 }),
};
const service3: DueService = {
    ...service2,
    id: 200,
    dueDate: service2.dueDate.plus({ months: 1 }),
};

const mockDueServices: Array<DueService> = [
    service1
];

export default mockDueServices;