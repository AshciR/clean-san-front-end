import { DateTime } from "luxon";
import DueService from "../../shared/DueService.model";
import MOCK_DUE_SERVICES from "../DueServicesTable/MockDueServicesData";

const fetchDueServices = (beforeDate?: DateTime) => {

    if (beforeDate) {
        return findServicesDueBeforeDate(MOCK_DUE_SERVICES, beforeDate);
    }

    // Default to returning all due services
    return new Promise<DueService[]>(resolve =>
        setTimeout(() => resolve(MOCK_DUE_SERVICES), 500)
    );

};

const findServicesDueBeforeDate = (dueServices: DueService[], beforeDate: DateTime) => {
    const filteredServices = dueServices.filter(service => service.dueDate.startOf('day') <= beforeDate.startOf('day'));

    return new Promise<DueService[]>(resolve =>
        setTimeout(() => resolve(filteredServices), 500)
    );
};

export { fetchDueServices };