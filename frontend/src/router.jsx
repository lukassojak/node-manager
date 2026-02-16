import { createBrowserRouter } from "react-router-dom"
import DashboardPage from "./pages/DashboardPage"
import NodeDetailPage from "./pages/NodeDetailPage"
import CreateNodePage from "./pages/CreateNodePage"
import ZoneDetailPage from "./pages/ZoneDetailPage"
import Wizard from "./pages/CreateZoneWizard/Wizard"
import AppLayout from "./components/layout/AppLayout"

const router = createBrowserRouter([
    {
        path: "/",
        element: <AppLayout />,
        children: [

            // Runtime
            {
                path: "dashboard",
                element: <DashboardPage />,
            },

            // Configuration (Node Manager)
            {
                path: "configuration/nodes",
                element: <DashboardPage />, // NodeManager Dashboard
            },
            {
                path: "configuration/nodes/new",
                element: <CreateNodePage />,
            },
            {
                path: "configuration/nodes/:nodeId",
                element: <NodeDetailPage />,
            },
            {
                path: "configuration/nodes/:nodeId/zones/:zoneId",
                element: <ZoneDetailPage />,
            },
            {
                path: "configuration/nodes/:nodeId/zones/new",
                element: <Wizard />,
            },

            // History
            {
                path: "history/statistics",
                element: <div>Statistics (placeholder)</div>,
            },
            {
                path: "history/weather",
                element: <div>Weather history (placeholder)</div>,
            },

            // Runtime
            {
                path: "runtime/manual",
                element: <div>Manual control (placeholder)</div>,
            },
            {
                path: "runtime/notifications",
                element: <div>Notifications (placeholder)</div>,
            },
            {
                path: "runtime/monitoring",
                element: <div>Monitoring (placeholder)</div>,
            },

            // System
            {
                path: "system/settings",
                element: <div>Settings (placeholder)</div>,
            },

            // Redirect root → dashboard
            {
                index: true,
                element: <DashboardPage />,
            }

        ]
    }
])


export default router;