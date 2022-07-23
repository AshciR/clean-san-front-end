import {GetDueServicesResponse} from "../services/services.services";

const getDueServicesResponse: GetDueServicesResponse = {
  "services": [
    {
      "id": 1,
      "client": {
        "id": 1,
        "name": "Sash",
        "email": "sash@gmail.com"
      },
      "contract": {
        "id": 1,
        "clientId": 1,
        "startDate": "2022-02-10",
        "endDate": "2023-02-09",
        "serviceFrequency": "MONTHLY",
        "status": "ACTIVE"
      },
      "dueDate": "2022-02-10",
      "currentStatus": "NOT_COMPLETED",
      "history": [
        {
          "id": 1,
          "status": "NOT_COMPLETED",
          "updateTime": "2022-05-13T19:59:48.490639Z"
        }
      ]
    },
    {
      "id": 2,
      "client": {
        "id": 2,
        "name": "Richie",
        "email": "rich@gmail.com"
      },
      "contract": {
        "id": 2,
        "clientId": 2,
        "startDate": "2022-02-10",
        "endDate": "2023-02-09",
        "serviceFrequency": "FORTNIGHTLY",
        "status": "ACTIVE"
      },
      "dueDate": "2022-03-10",
      "currentStatus": "NOT_COMPLETED",
      "history": [
        {
          "id": 2,
          "status": "NOT_COMPLETED",
          "updateTime": "2022-05-13T19:59:48.507424Z"
        }
      ]
    },
    {
      "id": 3,
      "client": {
        "id": 3,
        "name": "Morty",
        "email": "mort@gmail.com"
      },
      "contract": {
        "id": 3,
        "clientId": 3,
        "startDate": "2022-02-10",
        "endDate": "2023-02-09",
        "serviceFrequency": "WEEKLY",
        "status": "ACTIVE"
      },
      "dueDate": "2022-04-07",
      "currentStatus": "IN_PROGRESS",
      "history": [
        {
          "id": 3,
          "status": "NOT_COMPLETED",
          "updateTime": "2022-05-13T19:59:48.508036Z"
        },
        {
          "id": 15,
          "status": "IN_PROGRESS",
          "updateTime": "2022-05-13T20:00:08.680155Z"
        }
      ]
    },
    {
      "id": 4,
      "client": {
        "id": 1,
        "name": "Sash",
        "email": "sash@gmail.com"
      },
      "contract": {
        "id": 1,
        "clientId": 1,
        "startDate": "2022-02-10",
        "endDate": "2023-02-09",
        "serviceFrequency": "MONTHLY",
        "status": "ACTIVE"
      },
      "dueDate": "2022-05-05",
      "currentStatus": "IN_PROGRESS",
      "history": [
        {
          "id": 4,
          "status": "NOT_COMPLETED",
          "updateTime": "2022-05-13T19:59:48.508665Z"
        },
        {
          "id": 16,
          "status": "IN_PROGRESS",
          "updateTime": "2022-05-13T20:00:12.669974Z"
        }
      ]
    },
    {
      "id": 5,
      "client": {
        "id": 1,
        "name": "Sash",
        "email": "sash@gmail.com"
      },
      "contract": {
        "id": 1,
        "clientId": 1,
        "startDate": "2022-02-10",
        "endDate": "2023-02-09",
        "serviceFrequency": "MONTHLY",
        "status": "ACTIVE"
      },
      "dueDate": "2022-06-05",
      "currentStatus": "NOT_COMPLETED",
      "history": [
        {
          "id": 17,
          "status": "NOT_COMPLETED",
          "updateTime": "2022-05-13T19:59:48.508665Z"
        }
      ]
    },
    {
      "id": 6,
      "client": {
        "id": 1,
        "name": "Sash",
        "email": "sash@gmail.com"
      },
      "contract": {
        "id": 1,
        "clientId": 1,
        "startDate": "2022-02-10",
        "endDate": "2023-02-09",
        "serviceFrequency": "MONTHLY",
        "status": "ACTIVE"
      },
      "dueDate": "2022-07-05",
      "currentStatus": "NOT_COMPLETED",
      "history": [
        {
          "id": 18,
          "status": "NOT_COMPLETED",
          "updateTime": "2022-05-13T19:59:48.508665Z"
        }
      ]
    },
    {
      "id": 7,
      "client": {
        "id": 1,
        "name": "Sash",
        "email": "sash@gmail.com"
      },
      "contract": {
        "id": 1,
        "clientId": 1,
        "startDate": "2022-02-10",
        "endDate": "2023-02-09",
        "serviceFrequency": "MONTHLY",
        "status": "ACTIVE"
      },
      "dueDate": "2022-08-05",
      "currentStatus": "NOT_COMPLETED",
      "history": [
        {
          "id": 19,
          "status": "NOT_COMPLETED",
          "updateTime": "2022-05-13T19:59:48.508665Z"
        }
      ]
    },
    {
      "id": 8,
      "client": {
        "id": 2,
        "name": "Richie",
        "email": "rich@gmail.com"
      },
      "contract": {
        "id": 2,
        "clientId": 2,
        "startDate": "2022-02-10",
        "endDate": "2023-02-09",
        "serviceFrequency": "FORTNIGHTLY",
        "status": "ACTIVE"
      },
      "dueDate": "2022-03-24",
      "currentStatus": "NOT_COMPLETED",
      "history": [
        {
          "id": 20,
          "status": "NOT_COMPLETED",
          "updateTime": "2022-05-13T19:59:48.507424Z"
        }
      ]
    }
  ]
}

const updatedServicesResponse = {
  "updatedServices": [
    {
      "id": 3,
      "contractId": 1,
      "dueDate": "2022-04-07",
      "currentStatus": "COMPLETED",
      "history": [
        {
          "id": 3,
          "status": "NOT_COMPLETED",
          "updateTime": "2022-05-13T19:59:48.508036Z"
        },
        {
          "id": 15,
          "status": "IN_PROGRESS",
          "updateTime": "2022-05-13T20:00:08.680155Z"
        },
        {
          "id": 17,
          "status": "COMPLETED",
          "updateTime": "2022-05-14T11:47:38.999945Z"
        }
      ]
    },
    {
      "id": 4,
      "contractId": 1,
      "dueDate": "2022-05-05",
      "currentStatus": "CANCELLED",
      "history": [
        {
          "id": 4,
          "status": "NOT_COMPLETED",
          "updateTime": "2022-05-13T19:59:48.508665Z"
        },
        {
          "id": 16,
          "status": "IN_PROGRESS",
          "updateTime": "2022-05-13T20:00:12.669974Z"
        },
        {
          "id": 18,
          "status": "CANCELLED",
          "updateTime": "2022-05-14T11:47:39.001182Z"
        }
      ]
    }
  ]
}

export {getDueServicesResponse, updatedServicesResponse}