import {rest} from "msw";
import {getDueServicesResponse} from "./servicesEndpointResponses";
import {GetDueServicesResponse} from "../services/dashboardPage.services";
import {DateTime} from "luxon";

const getDueServicesHandler = rest.get('*/v1/services', (req, res, context) => {

  const filterByDueDate = (getDueServicesResponse: GetDueServicesResponse, dueDate: string) => {

    const dueServicesBeforeDate = getDueServicesResponse.dueServices.filter(serviceResponse => {
      return DateTime.fromISO(serviceResponse.dueDate).startOf('day') <= DateTime.fromISO(dueDate).startOf('day')
    });

    return {
      dueServices: dueServicesBeforeDate
    }
  };

  const dueDate = req.url.searchParams.get('dueDate');
  const response = (dueDate) ? filterByDueDate(getDueServicesResponse, dueDate) : getDueServicesResponse

  return res(
    context.status(200),
    context.json(response)
  )

});

export const handlers = [
  getDueServicesHandler
]