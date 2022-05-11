import { DateTime } from "luxon";
import DueService from "../shared/DueService.model";
import ServiceStatus from "../shared/ServiceStatus.model";
import MOCK_DUE_SERVICES from "./MockDueServicesData";
import { fetchDueServices, submitUpdatedServices } from "./dashboardPage.services";

describe('Dashboard Page Services', () => {

    it('It fetches the due services successfully', async () => {

        // When: the due services are fetched
        const dueServices = await fetchDueServices();

        // Then: The services should be present
        expect(dueServices.length).toBe(MOCK_DUE_SERVICES.length);
        expect(dueServices).toStrictEqual(MOCK_DUE_SERVICES);

    });

    it.each([
        { beforeDate: DateTime.now().minus({ months: 1, days: 1 }), expectedDueServices: MOCK_DUE_SERVICES.slice(2) }, // 1 month and 1 day before
        { beforeDate: DateTime.now().minus({ months: 1 }), expectedDueServices: MOCK_DUE_SERVICES.slice(1) }, // Exactly 1 month before
        { beforeDate: DateTime.now().minus({ days: 1 }), expectedDueServices: MOCK_DUE_SERVICES.slice(1) }, // 1 day before
        { beforeDate: DateTime.now(), expectedDueServices: MOCK_DUE_SERVICES }, // Same day
        { beforeDate: DateTime.now().plus({ days: 1 }), expectedDueServices: MOCK_DUE_SERVICES }  // 1 day ahead
    ])('It fetches only the due services before a given date - index: $#', async ({ beforeDate, expectedDueServices }) => {

        // Given: We have a before date

        // When: the due services are fetched
        const dueServices = await fetchDueServices(beforeDate);

        // Then: The services should be present
        expect(dueServices).toStrictEqual(expectedDueServices);

    });

    it('Submits the updated services successfully', async () => {

        // Given: We have services with prospective statuses
        const servicesToBeUpdated: DueService[] = [
            { ...MOCK_DUE_SERVICES[0], prospectiveStatus: ServiceStatus.IN_PROGRESS },
            { ...MOCK_DUE_SERVICES[1], prospectiveStatus: ServiceStatus.COMPLETED },
            { ...MOCK_DUE_SERVICES[2] }, // This should not be updated
            { ...MOCK_DUE_SERVICES[3] }, // This should not be updated
        ]
                
        // When: We update the current status with the prospective status
        const updatedServices = await submitUpdatedServices(servicesToBeUpdated);

        // Then: The current status should refelct the change
        expect(updatedServices[0].currentStatus).toBe(ServiceStatus.IN_PROGRESS);
        expect(updatedServices[0].prospectiveStatus).toBe(undefined);
        
        expect(updatedServices[1].currentStatus).toBe(ServiceStatus.COMPLETED);
        expect(updatedServices[1].prospectiveStatus).toBe(undefined);
        
    })

});
