import {DateTime} from "luxon";
import DueService from "../shared/DueService.model";
import ServiceStatus from "../shared/ServiceStatus.model";
import MOCK_DUE_SERVICES from "./MockDueServicesData";
import {
  convertDueServicesResponseToDueService,
  fetchDueServices,
  submitUpdatedServices
} from "./dashboardPage.services";
import {ContractStatus, createContract, ServiceFrequency} from "../shared/Contract.model";
import {createClient} from "../shared/Client.model";
import {createServiceHistory} from "../shared/ServiceHistory.model";
import {getDueServicesResponse} from "../mocks/servicesEndpointResponses";

describe('Dashboard Page Services', () => {

  it('fetches the due services successfully', async () => {

    // When: the due services are fetched
    const dueServices = await fetchDueServices();

    // Then: The services should be present
    const expectedServices = getDueServicesResponse.dueServices.map(serviceResponse =>
      convertDueServicesResponseToDueService(serviceResponse)
    )

    expect(dueServices.length).toBe(expectedServices.length);
    expect(dueServices).toStrictEqual(expectedServices);

  });

  it('fetches only the due services before a given date', async () => {

    // Given: We have a before date
    const dueDate = DateTime.fromISO(getDueServicesResponse.dueServices[1].dueDate);

    // When: the due services are fetched
    const dueServices = await fetchDueServices(dueDate);

    // Then: The services should be present
    const expectedServices = getDueServicesResponse.dueServices
      .slice(0, 2) // Get the 1st two elements
      .map(serviceResponse => convertDueServicesResponseToDueService(serviceResponse))

    expect(dueServices).toStrictEqual(expectedServices);

  });

  it('Submits the updated services successfully', async () => {

    // Given: We have services with prospective statuses
    const servicesToBeUpdated: DueService[] = [
      {...MOCK_DUE_SERVICES[0], prospectiveStatus: ServiceStatus.IN_PROGRESS},
      {...MOCK_DUE_SERVICES[1], prospectiveStatus: ServiceStatus.COMPLETED},
      {...MOCK_DUE_SERVICES[2]}, // This should not be updated
      {...MOCK_DUE_SERVICES[3]}, // This should not be updated
    ]

    // When: We update the current status with the prospective status
    const updatedServices = await submitUpdatedServices(servicesToBeUpdated);

    // Then: The current status should reflect the change
    expect(updatedServices[0].currentStatus).toBe(ServiceStatus.IN_PROGRESS);
    expect(updatedServices[0].prospectiveStatus).toBe(undefined);

    expect(updatedServices[1].currentStatus).toBe(ServiceStatus.COMPLETED);
    expect(updatedServices[1].prospectiveStatus).toBe(undefined);

  })

  it('converts DueServices response to domain model', () => {
    // Given: We have a DueServices response
    const dueServiceResponse = getDueServicesResponse.dueServices[0]

    // When: We convert the response
    const dueService = convertDueServicesResponseToDueService(dueServiceResponse);

    // Then: The domain should be mapped correctly
    const expectedDueService: DueService = {
      id: 1,
      client: createClient({id: 1, name: 'Sash', email: 'sash@gmail.com'}),
      contract: createContract({
        id: 1,
        clientId: 1,
        startDate: DateTime.fromObject({year: 2022, month: 2, day: 10}),
        endDate: DateTime.fromObject({year: 2023, month: 2, day: 9}),
        serviceFrequency: ServiceFrequency.MONTHLY,
        status: ContractStatus.ACTIVE
      }),
      currentStatus: ServiceStatus.NOT_COMPLETED,
      dueDate: DateTime.fromObject({year: 2022, month: 2, day: 10}),
      history: [
        createServiceHistory({
          id: 1,
          status: ServiceStatus.NOT_COMPLETED,
          updateTime: DateTime.fromISO('2022-05-13T19:59:48.490639')
        })
      ]
    };
    expect(dueService).toStrictEqual(expectedDueService);
  })
});
