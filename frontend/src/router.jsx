import { createBrowserRouter } from "react-router-dom"
import DashboardPage from "./pages/DashboardPage"
import NodeDetailPage from "./pages/NodeDetailPage"
import CreateNodePage from "./pages/CreateNodePage"
import ZoneDetailPage from "./pages/ZoneDetailPage"

const router = createBrowserRouter([
    {
        path: "/",
        element: <DashboardPage />,
    },
    {
        path: "/nodes/:nodeId",
        element: <NodeDetailPage />,
    },
    {
        path: "/nodes/new",
        element: <CreateNodePage />,
    },
    {
        path: "/nodes/:nodeId/zones/:zoneId",
        element: <ZoneDetailPage />,

    }
]);

export default router;