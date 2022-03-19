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
        { beforeDate: DateTime.now().minus({ months: 1 }), expectedDueServices: MOCK_DUE_SERVICES.slice(1) }, // Exactly 1 month before
        { beforeDate: DateTime.now().minus({ months: 1, days: 1 }), expectedDueServices: MOCK_DUE_SERVICES.slice(2) }, // 1 month and 1 day before
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

});
