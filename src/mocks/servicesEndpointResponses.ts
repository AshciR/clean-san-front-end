import {GetDueServicesResponse} from "../services/services.services";

const getDueServicesResponse: GetDueServicesResponse = {
  "dueServices": [
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
          "updateTime": "2022-05-13T19:59:48.490639"
        }
      ]
    },
    {
      "id": 2,
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
      "dueDate": "2022-03-10",
      "currentStatus": "NOT_COMPLETED",
      "history": [
        {
          "id": 2,
          "status": "NOT_COMPLETED",
          "updateTime": "2022-05-13T19:59:48.507424"
        }
      ]
    },
    {
      "id": 3,
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
      "dueDate": "2022-04-07",
      "currentStatus": "IN_PROGRESS",
      "history": [
        {
          "id": 3,
          "status": "NOT_COMPLETED",
          "updateTime": "2022-05-13T19:59:48.508036"
        },
        {
          "id": 15,
          "status": "IN_PROGRESS",
          "updateTime": "2022-05-13T20:00:08.680155"
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
          "updateTime": "2022-05-13T19:59:48.508665"
        },
        {
          "id": 16,
          "status": "IN_PROGRESS",
          "updateTime": "2022-05-13T20:00:12.669974"
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
          "updateTime": "2022-05-13T19:59:48.508036"
        },
        {
          "id": 15,
          "status": "IN_PROGRESS",
          "updateTime": "2022-05-13T20:00:08.680155"
        },
        {
          "id": 17,
          "status": "COMPLETED",
          "updateTime": "2022-05-14T11:47:38.999945"
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
          "updateTime": "2022-05-13T19:59:48.508665"
        },
        {
          "id": 16,
          "status": "IN_PROGRESS",
          "updateTime": "2022-05-13T20:00:12.669974"
        },
        {
          "id": 18,
          "status": "CANCELLED",
          "updateTime": "2022-05-14T11:47:39.001182"
        }
      ]
    }
  ]
}

export {getDueServicesResponse, updatedServicesResponse}