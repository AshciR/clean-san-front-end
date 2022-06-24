import {getDueServicesResponse} from "../mocks/servicesEndpointResponses";
import {convertContractResponseToContract} from "./shared-responses";
import Contract, {ContractStatus, createContract, ServiceFrequency} from "../shared/Contract.model";
import {DateTime} from "luxon";

describe('Shared responses', () => {

  it('converts Contract response to domain model', () => {

    // Given: We have a Contract response
    const contractResponse = getDueServicesResponse.dueServices[0].contract;

    // When: We convert the response
    const contract = convertContractResponseToContract(contractResponse);

    // Then: The domain should be mapped correctly
    const expectedContract: Contract = createContract({
      id: 1,
      clientId: 1,
      startDate: DateTime.fromObject({year: 2022, month: 2, day: 10}),
      endDate: DateTime.fromObject({year: 2023, month: 2, day: 9}),
      serviceFrequency: ServiceFrequency.MONTHLY,
      status: ContractStatus.ACTIVE
    });

    expect(contract).toStrictEqual(expectedContract);

  });

})
