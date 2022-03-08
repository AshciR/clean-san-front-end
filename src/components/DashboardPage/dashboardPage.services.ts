import DueService from "../../shared/DueService.model";
import MOCK_DUE_SERVICES from "../DueServicesTable/MockDueServicesData";

const fetchDueServices = () => {
    return new Promise<DueService[]>(resolve =>
        setTimeout(() => resolve(MOCK_DUE_SERVICES), 1000)
    )
};

export { fetchDueServices };