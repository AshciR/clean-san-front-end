interface Contract {
    id: number;
    clientId: number;
    startDate: Date;
    endDate: Date;
    serviceFrequency: ServiceFrequency;
    status: ContractStatus;
};

enum ServiceFrequency {
    WEEKLY,
    BIWEEKLY, // Every 2 weeks (English is a trash language)
    MONTHLY
};

enum ContractStatus {
    ACTIVE,
    INACTIVE,
    COMPLETED,
    CANCELLED
};

export default Contract;