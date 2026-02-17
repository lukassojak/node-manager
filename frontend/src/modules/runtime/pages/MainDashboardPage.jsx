import {
    Box,
    Grid,
    Stack,
    Text,
    HStack,
    VStack,
    Progress,
    Badge,
    Button
} from "@chakra-ui/react"
import {
    Activity,
    Droplets,
    CloudRain,
    ShieldCheck,
    AlertTriangle
} from "lucide-react"

import GlassPageHeader from "../../../components/layout/GlassPageHeader"
import GlassPanelSection from "../../../components/layout/GlassPanelSection"
import PanelSection from "../../../components/layout/PanelSection"
import SystemOverviewCard from "../components/SystemOverviewCard"
import CurrentTaskCard from "../components/CurrentTaskCard"
import AlertItem from "../components/AlertItem"
import TimelineItem from "../components/TimelineItem"
import TodaysActivityCard from "../components/TodaysActivityCard"

export default function MainDashboardPage() {

    // ---- Fake Data ----

    const overview = {
        zonesOnline: 12,
        totalZones: 15,
        warnings: 1,
        errors: 0,
        irrigationPlanned: 5,
        completedToday: 2,
        waterUsedToday: 124,
        waterDelta: "+8%",
        weatherAdjustment: "-15%"
    }

    const currentTasks = [
        {
            id: "1",
            zoneName: "South Lawn",
            progress: 45,
            currentVolume: 6.2,
            targetVolume: 12,
            remainingMinutes: 5
        },
        {
            id: "2",
            zoneName: "Greenhouse",
            progress: 70,
            currentVolume: 9.8,
            targetVolume: 14,
            remainingMinutes: 3
        }
    ]

    const alerts = [
        {
            id: "a1",
            type: "warning",
            title: "Low flow detected",
            message: "Zone South Lawn reported lower than expected flow.",
            timestamp: "12:42 today"
        },
        {
            id: "a2",
            type: "error",
            title: "Water leak detected",
            message: "Zone Greenhouse reported a possible leak. Immediate inspection recommended.",
            timestamp: "08:15 today"
        }
    ]

    const nextTasks = [
        {
            id: "t1",
            zoneName: "Orchard",
            time: "18:30",
            volume: 14,
            status: "planned"
        },
        {
            id: "t2",
            zoneName: "Greenhouse",
            time: "06:00",
            volume: 10,
            status: "completed"
        }
    ]

    const todaysActivity = [
        {
            id: "t1",
            zoneName: "Greenhouse",
            time: "06:00",
            volume: 10,
            status: "completed"
        },
        {
            id: "t2",
            zoneName: "Orchard",
            time: "18:30",
            volume: 14,
            status: "planned"
        },
        {
            id: "t3",
            zoneName: "South Lawn",
            time: "20:00",
            volume: 12,
            status: "planned"
        }
    ]



    return (
        <Box>

            <GlassPageHeader
                title="Dashboard"
                subtitle="Live system overview"
            />

            <Stack gap={8} p={8}>

                {/* SECTION 1 - SYSTEM OVERVIEW */}
                <GlassPanelSection
                    title="System Overview"
                    description="Current system health and today's irrigation summary"
                >
                    <Grid
                        templateColumns="repeat(auto-fit, minmax(240px, 1fr))"
                        gap={6}
                    >

                        <SystemOverviewCard
                            icon={ShieldCheck}
                            title="System Health"
                            value={`${overview.zonesOnline} / ${overview.totalZones}`}
                            description="Zones online"
                            footer={
                                <>
                                    <Badge colorPalette="orange" variant="subtle">
                                        {overview.warnings} warnings
                                    </Badge>
                                    <Badge colorPalette="red" variant="subtle">
                                        {overview.errors} errors
                                    </Badge>
                                </>
                            }
                        />

                        <SystemOverviewCard
                            icon={Activity}
                            title="Today Summary"
                            value={`${overview.irrigationPlanned} planned`}
                            description={`${overview.completedToday} completed`}
                        />

                        <SystemOverviewCard
                            icon={Droplets}
                            title="Water Usage"
                            value={`${overview.waterUsedToday} L`}
                            description={`vs average ${overview.waterDelta}`}
                        />

                        <SystemOverviewCard
                            icon={CloudRain}
                            title="Weather Impact"
                            value={overview.weatherAdjustment}
                            description="Adjustment applied today"
                        />

                    </Grid>
                </GlassPanelSection>


                {/* SECTION 2 - CURRENT IRRIGATION */}
                <GlassPanelSection
                    title="Current Irrigation"
                    description="Active irrigation tasks"
                >
                    <Stack gap={2}>
                        {currentTasks.map(task => (
                            <CurrentTaskCard key={task.id} task={task} />
                        ))}
                    </Stack>
                </GlassPanelSection>

                {/* SECTION 3 - ALERTS */}
                <GlassPanelSection
                    title="Alerts"
                    description="Recent system notifications requiring attention"
                >
                    <Stack gap={2}>
                        {alerts.map(alert => (
                            <AlertItem key={alert.id} alert={alert} />
                        ))}
                    </Stack>
                </GlassPanelSection>

                {/* SECTION 4 - UPCOMING TASKS */}
                <TodaysActivityCard items={nextTasks} />


            </Stack>
        </Box>
    )
}
