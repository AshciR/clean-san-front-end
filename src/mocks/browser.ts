import {setupWorker} from 'msw'
import {servicesHandlers} from './servicesHandlers'
import {clientsHandlers} from "./clientsHandlers";

// Configures a Service Worker with the given request dueServiceHandlers.
export const worker = setupWorker(
  ...servicesHandlers,
  ...clientsHandlers
)