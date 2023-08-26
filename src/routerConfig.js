import routes from "./routes";
import DashboardPage from "./components/dashboard/DashboardPage/DashboardPage";
import NotFoundPage from "./components/shared/NotFoundPage/NotFoundPage";
import ClientsPage from "./components/clients/ClientsPage/ClientsPage";
import React from "react";

const routerConfig = [
    {
        path: routes.dashboardPage,
        element: <DashboardPage/>,
        errorElement: <NotFoundPage/>,
    },
    {
        path: routes.clientsPage,
        element: <ClientsPage/>
    },
];

export default routerConfig;