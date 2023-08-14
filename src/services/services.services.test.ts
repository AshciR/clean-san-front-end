import {DateTime} from "luxon";
import DueService from "../shared/DueService.model";
import ServiceStatus from "../shared/ServiceStatus.model";
import {
  convertGetDueServicesResponseToDueServices,
  convertServiceResponseToDueService,
  convertServicesQueryResponseToDueService,
  fetchDueServices,
  fetchServicesForContract,
  ServiceQueryResponse,
  submitUpdatedServices
} from "./services.services";
import {ContractStatus, createContract, ServiceFrequency} from "../shared/Contract.model";
import {createClient} from "../shared/Client.model";
import {createServiceHistory} from "../shared/ServiceHistory.model";
import {getDueServicesResponse, updatedServicesResponse} from "../mocks/servicesEndpointResponses";

describe('Due Services Services', () => {

  it('fetches the due services successfully', async () => {

    // When: the due services are fetched
    const dueServices = await fetchDueServices();

    // Then: The services should be present
    const expectedServices = convertGetDueServicesResponseToDueServices(getDueServicesResponse)
    expect(dueServices).toStrictEqual(expectedServices);

  });

  it('fetches only the due services before a given date', async () => {

    // Given: We have a before date
    const dueDate = DateTime.fromISO(getDueServicesResponse.services[1].dueDate);

    // When: the due services are fetched
    const dueServices = await fetchDueServices(dueDate);

    // Then: The services should be present
    const expectedServices = getDueServicesResponse.services
      .slice(0, 2) // Get the 1st two elements
      .map((serviceResponse: ServiceQueryResponse) => convertServicesQueryResponseToDueService(serviceResponse))

    expect(dueServices.services).toStrictEqual(expectedServices);

  });

  it('fetches the paginated due services successfully', async () => {

    // Given: We have a before date
    const dueDate = DateTime.fromISO(getDueServicesResponse.services[2].dueDate);

    // When: the due services are fetched
    const dueServices = await fetchDueServices(dueDate, 1, 3);

    // Then: The services should be present
    const expectedDueServices = convertServicesQueryResponseToDueService(getDueServicesResponse.services[7])
    const expectedServiceResponse = {
      totalItems: 4,
      totalPages: 2,
      currentPage: 1,
      services: [expectedDueServices]
    };

    expect(dueServices).toStrictEqual(expectedServiceResponse);

  });

  it('fetches due services with sort order', async () => {

    // Given: We have the query params
    const dueDate = DateTime.fromISO(getDueServicesResponse.services[3].dueDate);
    const sort = "client:desc"

    // When: the due services are fetched
    const dueServices = await fetchDueServices(dueDate,0,25, sort);

    // Then: The services should be present
    expect(dueServices.services.length).toEqual(5);
    expect(dueServices.services[0]).toStrictEqual(convertServicesQueryResponseToDueService(getDueServicesResponse.services[0]));
    expect(dueServices.services[2]).toStrictEqual(convertServicesQueryResponseToDueService(getDueServicesResponse.services[1]));
    expect(dueServices.services[4]).toStrictEqual(convertServicesQueryResponseToDueService(getDueServicesResponse.services[2]));

  });

  it('fetches the services for a contract', async () => {

    // Given: We have the contract id
    const contractId = getDueServicesResponse.services[1].contract.id;

    // When: the services are fetched
    const dueServices = await fetchServicesForContract(contractId);

    // Then: The services should be present
    const expectedServices = getDueServicesResponse.services.filter(service => service.contract.id === contractId)
      .map((serviceResponse: ServiceQueryResponse) => convertServicesQueryResponseToDueService(serviceResponse))

    expect(dueServices).toStrictEqual(expectedServices);

  });

  it('Submits the updated services successfully', async () => {

    // Given: We have due services that can be updated
    const currentDueServices = getDueServicesResponse.services
      .map(service => convertServicesQueryResponseToDueService(service))

    // And: We update services with prospective statuses
    const servicesToBeUpdated: DueService[] = [
      {...currentDueServices[0], prospectiveStatus: ServiceStatus.IN_PROGRESS},
      {...currentDueServices[1], prospectiveStatus: ServiceStatus.COMPLETED},
      {...currentDueServices[2]}, // prospectiveStatus: undefined by default. This should not be updated
      ...currentDueServices.slice(3)
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
    const dueServiceResponse = getDueServicesResponse.services[0]

    // When: We convert the response
    const dueService = convertServicesQueryResponseToDueService(dueServiceResponse);

    // Then: The domain should be mapped correctly
    const expectedDueService: DueService = {
      id: 1,
      client: createClient({id: 1, name: 'Sash', email: 'sash@gmail.com', isActive: true}),
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
          updateTime: DateTime.fromISO('2022-05-13T19:59:48.490639Z')
        })
      ]
    };
    expect(dueService).toStrictEqual(expectedDueService);
  })

  it('converts UpdatedServices response to domain model', () => {
    // Given: We have a UpdatedServices response
    const updatedServiceResponse = updatedServicesResponse.updatedServices[0]

    // And: The corresponding service
    const correspondingService = {
      id: 3,
      client: createClient({id: 1, name: 'Sash', email: 'sash@gmail.com', isActive: true}),
      contract: createContract({
        id: 1,
        clientId: 1,
        startDate: DateTime.fromObject({year: 2022, month: 2, day: 10}),
        endDate: DateTime.fromObject({year: 2023, month: 2, day: 9}),
        serviceFrequency: ServiceFrequency.MONTHLY,
        status: ContractStatus.ACTIVE
      }),
      currentStatus: ServiceStatus.IN_PROGRESS,
      dueDate: DateTime.fromObject({year: 2022, month: 4, day: 7}),
      history: [
        createServiceHistory({
          id: 3,
          status: ServiceStatus.NOT_COMPLETED,
          updateTime: DateTime.fromISO('2022-05-13T19:59:48.508036Z')
        }),
        createServiceHistory({
          id: 15,
          status: ServiceStatus.IN_PROGRESS,
          updateTime: DateTime.fromISO('2022-05-13T20:00:08.680155Z')
        })
      ]
    };

    // When: We convert the response
    const updatedService = convertServiceResponseToDueService(updatedServiceResponse, correspondingService);

    // Then: The domain should be mapped correctly
    const expectedDueService: DueService = {
      id: 3,
      client: createClient({id: 1, name: 'Sash', email: 'sash@gmail.com', isActive: true}),
      contract: createContract({
        id: 1,
        clientId: 1,
        startDate: DateTime.fromObject({year: 2022, month: 2, day: 10}),
        endDate: DateTime.fromObject({year: 2023, month: 2, day: 9}),
        serviceFrequency: ServiceFrequency.MONTHLY,
        status: ContractStatus.ACTIVE
      }),
      currentStatus: ServiceStatus.COMPLETED,
      dueDate: DateTime.fromObject({year: 2022, month: 4, day: 7}),
      history: [
        createServiceHistory({
          id: 3,
          status: ServiceStatus.NOT_COMPLETED,
          updateTime: DateTime.fromISO('2022-05-13T19:59:48.508036Z')
        }),
        createServiceHistory({
          id: 15,
          status: ServiceStatus.IN_PROGRESS,
          updateTime: DateTime.fromISO('2022-05-13T20:00:08.680155Z')
        }),
        createServiceHistory({
          id: 17,
          status: ServiceStatus.COMPLETED,
          updateTime: DateTime.fromISO('2022-05-14T11:47:38.999945Z')
        })
      ]
    };

    expect(updatedService).toStrictEqual(expectedDueService);
  })

});
