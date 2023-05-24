const getClientsResponse = {
  "totalItems": 4,
  "totalPages": 1,
  "currentPage": 0,
  "clients": [
    {
      "id": 1,
      "name": "Sash",
      "email": "sash@gmail.com",
      "contracts": [
        {
          "id": 1,
          "clientId": 1,
          "startDate": "2022-02-10",
          "endDate": "2023-02-09",
          "serviceFrequency": "MONTHLY",
          "status": "ACTIVE"
        },
        {
          "id": 4,
          "clientId": 1,
          "startDate": "2021-02-10",
          "endDate": "2022-02-09",
          "serviceFrequency": "MONTHLY",
          "status": "COMPLETED"
        },
        {
          "id": 5,
          "clientId": 1,
          "startDate": "2023-02-10",
          "endDate": "2024-02-09",
          "serviceFrequency": "MONTHLY",
          "status": "INACTIVE"
        }
      ]
    },
    {
      "id": 2,
      "name": "Richie",
      "email": "rich@gmail.com",
      "contracts": [
        {
          "id": 2,
          "clientId": 2,
          "startDate": "2022-02-10",
          "endDate": "2023-02-09",
          "serviceFrequency": "FORTNIGHTLY",
          "status": "ACTIVE"
        }
      ]
    },
    {
      "id": 3,
      "name": "Morty",
      "email": "mort@gmail.com",
      "contracts": [
        {
          "id": 3,
          "clientId": 3,
          "startDate": "2022-02-10",
          "endDate": "2023-02-09",
          "serviceFrequency": "WEEKLY",
          "status": "ACTIVE"
        }
      ]
    },
    {
      "id": 4,
      "name": "Space Ghost",
      "email": "spaceghost@gmail.com",
      "contracts": [
        {
          "id": 6,
          "clientId": 4,
          "startDate": "2022-05-03",
          "endDate": "2023-05-02",
          "serviceFrequency": "WEEKLY",
          "status": "INACTIVE"
        }
      ]
    }
  ]
}

export {getClientsResponse}