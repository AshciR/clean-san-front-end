import {rest} from "msw";
import {getClientsResponse} from "./clientsEndpointResponses";
import {AddClientRequest, AddClientResponse, GetClientsResponse} from "../services/clients.services";


const getClientsHandler = rest.get('*/v1/clients', (req, res, context) => {

  return res(
    context.status(200),
    context.json(getClientsResponse)
  )

});

const addClientHandler = rest.post('*/v1/clients', (req, res, context) => {

  const addClientRequest = req.body as AddClientRequest;

  const determineNextId = (getClientsResponse: GetClientsResponse) =>
    getClientsResponse.clients[getClientsResponse.clients.length - 1].id + 1;

  const response: AddClientResponse = {
    id: determineNextId(getClientsResponse),
    name: addClientRequest.name,
    email: addClientRequest.email
  };

  return res(
    context.status(201),
    context.json(response)
  );

});

export const clientsHandlers = [
  getClientsHandler, addClientHandler
]