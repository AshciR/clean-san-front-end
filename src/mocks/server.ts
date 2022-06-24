import {setupServer} from "msw/node";
import {servicesHandlers} from "./servicesHandlers";
import {clientsHandlers} from "./clientsHandlers";

// This configures a request mocking server with the given request dueServiceHandlers.
export const server = setupServer(
  ...servicesHandlers,
  ...clientsHandlers
)