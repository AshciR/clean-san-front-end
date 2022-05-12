import {setupWorker} from 'msw'
import {handlers} from './handlers'

// Configures a Service Worker with the given request handlers.
export const worker = setupWorker(...handlers)