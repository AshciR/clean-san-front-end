const getClientsResponse = {
  "totalItems": 4,
  "totalPages": 1,
  "currentPage": 0,
  "clients": [
    {
      "client": {
        "id": 1,
        "name": "Sash",
        "primaryContactFirstName": "Lulu",
        "primaryContactLastName": "Gardner",
        "telephoneNumber": "8761234567",
        "email": "sash@gmail.com",
      },
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
      "client": {
        "id": 2,
        "name": "Richie",
        "primaryContactFirstName": "Jasper",
        "primaryContactLastName": "Walker",
        "telephoneNumber": "9192224444",
      },
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
      "client": {
        "id": 3,
        "name": "Morty",
        "primaryContactFirstName": "Rick",
        "primaryContactLastName": "Sanchez",
        "email": "mort@gmail.com",
      },
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
      "client": {
        "id": 4,
        "name": "Space Ghost",
        "primaryContactFirstName": "Cartoon",
        "primaryContactLastName": "Network",
      },
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