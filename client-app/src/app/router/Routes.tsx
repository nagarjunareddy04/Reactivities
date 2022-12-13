import { createBrowserRouter, Navigate, RouteObject } from "react-router-dom";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import ActivityDetails from "../../features/activities/details/ActivityDetails";
import ActivityForm from "../../features/activities/form/ActivityForm";
import NotFound from "../../features/errors/NotFound";
import ServerError from "../../features/errors/ServerError";
import TestErrors from "../../features/errors/TestError";
import HomePage from "../../features/home/HomePage";
import App from "../layout/App";

export const routes: RouteObject[] = [
    {
        path: "/",
        element: <App />,
        children:[
            // {path: "", element: <HomePage />},
            {path: "activities", element: <ActivityDashboard />},
            {path: "activities/:id", element: <ActivityDetails key="create" />},
            {path: "createactivity", element: <ActivityForm key="manage" />},
            {path: "manage/:id", element: <ActivityForm />},
            {path: "errors", element: <TestErrors />},
            {path: "not-found", element: <NotFound />},
            {path: "server-error", element: <ServerError />},
            {path: "*", element: <Navigate replace to="/not-found" />}
        ]
    }
]
export const router = createBrowserRouter(routes);