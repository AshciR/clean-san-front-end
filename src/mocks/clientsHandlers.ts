import {rest} from "msw";
import {getClientsResponse} from "./clientsEndpointResponses";

const getClientsHandler = rest.get('*/v1/clients', (req, res, context) => {

  return res(
    context.status(200),
    context.json(getClientsResponse)
  )

});

export const clientsHandlers = [
  getClientsHandler
]