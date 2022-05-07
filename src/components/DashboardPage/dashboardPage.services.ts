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

const submitUpdatedServices = (servicesToBeSubmitted: DueService[]) => {


    const updatedServices = servicesToBeSubmitted
        .filter(service => !!service.prospectiveStatus)
        .map(service => updateCurrentStatusWithProspectiveStatus(service));

    return new Promise<DueService[]>(resolve =>
        setTimeout(() => resolve(updatedServices), 250)
    );

};

const updateCurrentStatusWithProspectiveStatus = (service: DueService) => {

    const updatedService: DueService = {
        ...service,
        currentStatus: service.prospectiveStatus || service.currentStatus,
        prospectiveStatus: undefined
    }

    return updatedService

};

export { fetchDueServices, submitUpdatedServices };