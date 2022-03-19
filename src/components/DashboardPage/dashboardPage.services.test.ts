import { DateTime } from "luxon";
import MOCK_DUE_SERVICES from "../DueServicesTable/MockDueServicesData";
import { fetchDueServices } from "./dashboardPage.services";

describe('Dashboard Page Services', () => {

    it('It fetches the due services successfully', async () => {

        // When: the due services are fetched
        const dueServices = await fetchDueServices();

        // Then: The services should be present
        expect(dueServices.length).toBe(MOCK_DUE_SERVICES.length);
        expect(dueServices).toStrictEqual(MOCK_DUE_SERVICES);

    });

    it.each([
        { beforeDate: DateTime.now().minus({ months: 1 }), expectedDueServices: MOCK_DUE_SERVICES.slice(1) },
        { beforeDate: DateTime.now(), expectedDueServices: MOCK_DUE_SERVICES }
    ])('It fetches only the due services before a given date - index: $#', async ({ beforeDate, expectedDueServices }) => {

        // Given: We have a before date
       
        // When: the due services are fetched
        const dueServices = await fetchDueServices(beforeDate);

        // Then: The services should be present
        expect(dueServices).toStrictEqual(expectedDueServices);

    });

});
