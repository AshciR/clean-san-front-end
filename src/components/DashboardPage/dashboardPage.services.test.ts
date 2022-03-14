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

});
