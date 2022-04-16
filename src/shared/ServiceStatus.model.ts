enum ServiceStatus {
    NOT_COMPLETED = 'NOT COMPLETED',
    IN_PROGRESS = 'IN PROGRESS',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED'
}

type ServiceStatusKeys = keyof typeof ServiceStatus

export default ServiceStatus;
export type { ServiceStatusKeys }
