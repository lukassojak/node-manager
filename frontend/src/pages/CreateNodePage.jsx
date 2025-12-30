import { useState } from 'react'
import { useNavigate } from "react-router-dom"
import { For, SegmentGroup, Switch, Field, Text, Box, Heading, Input, Button, Stack, SimpleGrid, HStack } from "@chakra-ui/react"
import { createNode } from "../api/nodes.api"


export default function CreateNodePage() {
    const navigate = useNavigate()
    const [name, setName] = useState("")
    const [location, setLocation] = useState("")
    const [scheduledHour, setScheduledHour] = useState(18)
    const [scheduledMinute, setScheduledMinute] = useState(0)
    const [scheduledTime, setScheduledTime] = useState("18:00")
    const [automationEnabled, setAutomationEnabled] = useState(true)
    const [concurrentIrrigation, setConcurrentIrrigation] = useState(false)

    {/* Collapsed advanced settings by default */ }
    const [showAdvanced, setShowAdvanced] = useState(false)
    const [minIrrigationPercent, setMinIrrigationPercent] = useState(20)
    const [maxIrrigationPercent, setMaxIrrigationPercent] = useState(200)
    const [mainValveMaxFlow, setMainValveMaxFlow] = useState(null)
    const [weatherCacheInterval, setWeatherCacheInterval] = useState(30)
    const [weatherCacheExpiry, setWeatherCacheExpiry] = useState(2)
    const [flowControlEnabled, setFlowControlEnabled] = useState(true)
    const [maxConcurrentZones, setMaxConcurrentZones] = useState(null)
    const [maxTotalIrrigationTime, setMaxTotalIrrigationTime] = useState(null)

    const updateScheduledTime = (time) => {
        setScheduledTime(time)
        const [hour, minute] = time.split(":").map(Number)
        setScheduledHour(hour)
        setScheduledMinute(minute)
    }

    const handleSubmit = () => {
        const payload = {
            name,
            location,
            hardware: {
                input_pins: { pins: [] },
                output_pins: { pins: [] },
            },
            irrigation_limits: {
                min_percent: minIrrigationPercent,
                max_percent: maxIrrigationPercent,
                main_valve_max_flow: mainValveMaxFlow,
            },
            automation: {
                enabled: automationEnabled,
                scheduled_hour: scheduledHour,
                scheduled_minute: scheduledMinute,
                weather_cache_interval_minutes: weatherCacheInterval,
                weather_cache_expiry_hours: weatherCacheExpiry,
            },
            batch_strategy: {
                concurrent_irrigation: concurrentIrrigation,
                flow_control: true,
                max_concurrent_zones: null,
                max_total_irrigation_time_minutes: null,
            },
            logging: {
                enabled: true,
                log_level: "DEBUG",
            },
        }

        createNode(payload)
            .then((response) => {
                navigate(`/nodes/${response.data.id}`)
            })
            .catch((error) => {
                console.error("Failed to create node", error)
            })
    }

    return (
        <Box p={6}>
            {/* Page header */}
            <HStack mb={6} justify="space-between">
                <Stack spacing={2} align="flex-start">
                    <Heading size="lg" color="fg">
                        Create New Node
                    </Heading>
                    <Text fontSize="sm" color="fg.muted" fontWeight="semibold">
                        Configure settings for your new irrigation node.
                    </Text>
                </Stack>
                <Button
                    onClick={() => navigate(-1)}
                >
                    Cancel
                </Button>
            </HStack>

            <SimpleGrid columns={{ base: 1, lg: 3 }} gap={6}>
                <Stack spacing={6} gap={10} gridColumn="span 2">
                    {/* Basic settings */}
                    <Stack spacing={6} gap={6}>
                        <Heading size="md" color="fg" textAlign="left">
                            Primary Settings
                        </Heading>

                        <Box
                            bg="bg.panel"
                            borderWidth="1px"
                            borderColor="border"
                            borderRadius="md"
                            textAlign="left"
                            p={4}
                        >
                            <Heading size="sm" mb={4} color="teal.600">
                                Basic Information
                            </Heading>
                            <Stack spacing={4} gap={6}>
                                {/* Name input */}
                                <Field.Root required>
                                    <Field.Label>Node Name <Field.RequiredIndicator /></Field.Label>
                                    <Input
                                        placeholder="e.g., Backyard Node"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                    <Field.HelperText>
                                        Human-readable identifier for this node.
                                    </Field.HelperText>
                                    <Field.ErrorText>
                                        Name is required.
                                    </Field.ErrorText>
                                </Field.Root>

                                {/* Location input */}
                                <Field.Root>
                                    <Field.Label>Location</Field.Label>
                                    <Input
                                        placeholder="e.g., Backyard Garden"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                    />
                                    <Field.HelperText>
                                        Location description for easier identification.
                                    </Field.HelperText>
                                </Field.Root>

                            </Stack>
                        </Box>

                        <Box
                            bg="bg.panel"
                            borderWidth="1px"
                            borderColor="border"
                            borderRadius="md"
                            textAlign="left"
                            p={4}
                        >
                            <Heading size="sm" mb={4} color="teal.600">
                                Automation Settings
                            </Heading>
                            <Stack spacing={4} gap={6}>
                                {/* Scheduled time input */}
                                <Field.Root>
                                    <Field.Label>Scheduled Time</Field.Label>
                                    <Input
                                        type="time"
                                        value={scheduledTime}
                                        onChange={(e) => updateScheduledTime(e.target.value)}
                                    />
                                    <Field.HelperText>
                                        Daily time to run automated irrigation.
                                    </Field.HelperText>
                                    <Field.ErrorText>
                                        Invalid time.
                                    </Field.ErrorText>
                                </Field.Root>

                                {/* Automation enabled input */}
                                <HStack justify="space-between">
                                    <Field.Root colorPalette="teal">
                                        <Field.Label>Automatic Irrigation</Field.Label>
                                        <Switch.Root
                                            checked={automationEnabled}
                                            onChange={(checked) => setAutomationEnabled(!automationEnabled)}
                                        >
                                            <Switch.HiddenInput />
                                            <Switch.Control>
                                                <Switch.Thumb />
                                            </Switch.Control>
                                            <Switch.Label>
                                                {automationEnabled ? "Enabled" : "Disabled"}
                                            </Switch.Label>
                                        </Switch.Root>
                                        <Field.HelperText>
                                            Toggle to enable or disable automatic daily irrigation checks.
                                        </Field.HelperText>
                                    </Field.Root>
                                </HStack>
                            </Stack>
                        </Box>

                        <Box
                            bg="bg.panel"
                            borderWidth="1px"
                            borderColor="border"
                            borderRadius="md"
                            textAlign="left"
                            p={4}
                        >
                            <Heading size="sm" mb={4} color="teal.600">
                                Batch Strategy
                            </Heading>
                            <Stack spacing={4} gap={6}>
                                <Field.Root>
                                    <Field.Label>Irrigation mode</Field.Label>
                                    <SegmentGroup.Root
                                        value={concurrentIrrigation ? "concurrent" : "sequential"}
                                        onValueChange={(details) => {
                                            setConcurrentIrrigation(details.value === "concurrent")
                                        }}
                                        size="md"
                                        colorPalette="teal"
                                        css={{
                                            "--segment-indicator-bg": "colors.white",
                                            "--segment-indicator-shadow": "shadows.md",
                                        }}
                                    >
                                        <SegmentGroup.Indicator />
                                        <For each={["sequential", "concurrent"]}>
                                            {(item) => (
                                                <SegmentGroup.Item key={item} value={item}>
                                                    <SegmentGroup.ItemText
                                                        _checked={{ color: "colorPalette.fg", fontWeight: "medium" }}
                                                    >
                                                        {item}
                                                    </SegmentGroup.ItemText>
                                                    <SegmentGroup.ItemHiddenInput />
                                                </SegmentGroup.Item>
                                            )}
                                        </For>
                                    </SegmentGroup.Root>
                                    <Field.HelperText>
                                        Choose how to handle multiple irrigation zones simultaneously.
                                    </Field.HelperText>
                                    <Field.ErrorText>
                                        Invalid selection.
                                    </Field.ErrorText>
                                </Field.Root>

                            </Stack>

                        </Box>
                    </Stack>

                    {/* Advanced settings, collapsible */}
                    {showAdvanced && (
                        <Stack spacing={6} gap={6}>
                            <Heading size="md" color="fg" textAlign="left">
                                Advanced Settings
                            </Heading>
                            <Box
                                bg="bg.panel"
                                borderWidth="1px"
                                borderColor="border"
                                borderRadius="md"
                                textAlign="left"
                                p={4}
                            >
                                <Heading size="sm" mb={4} color="teal.600">
                                    Irrigation Limits
                                </Heading>

                                <Stack spacing={4} gap={6}>
                                    <HStack justify="space-between" align="flex-start">
                                        <Field.Root>
                                            <Field.Label>Minimum Irrigation %</Field.Label>
                                            <Input
                                                type="number"
                                                step="5"
                                                value={minIrrigationPercent}
                                                onChange={(e) => setMinIrrigationPercent(Number(e.target.value))}
                                            />
                                            <Field.HelperText>
                                                If the calculated volume will be less than this percentage of the zone's
                                                base volume, it will be clamped to this minimum.
                                            </Field.HelperText>
                                        </Field.Root>
                                        <Field.Root>
                                            <Field.Label>Maximum Irrigation %</Field.Label>
                                            <Input
                                                type="number"
                                                step="5"
                                                value={maxIrrigationPercent}
                                                onChange={(e) => setMaxIrrigationPercent(Number(e.target.value))}
                                            />
                                            <Field.HelperText>
                                                If the calculated volume exceeds this percentage of the zone's base
                                                volume, it will be clamped to this maximum.
                                            </Field.HelperText>
                                        </Field.Root>
                                    </HStack>
                                    <Field.Root>
                                        <Field.Label>Main Valve Max Flow (L/min)</Field.Label>
                                        <Input
                                            type="number"
                                            step="100"
                                            value={mainValveMaxFlow || ""}
                                            onChange={(e) => {
                                                const val = e.target.value
                                                setMainValveMaxFlow(val ? Number(val) : null)
                                            }}
                                            placeholder="Leave blank for no limit"
                                        />
                                        <Field.HelperText>
                                            Maximum flow rate for the main valve in liters per minute. Leave blank for no limit.
                                        </Field.HelperText>
                                        <Field.ErrorText>
                                            Invalid flow rate.
                                        </Field.ErrorText>
                                    </Field.Root>
                                </Stack>
                            </Box>

                            <Box
                                bg="bg.panel"
                                borderWidth="1px"
                                borderColor="border"
                                borderRadius="md"
                                textAlign="left"
                                p={4}
                            >
                                <Heading size="sm" mb={4} color="teal.600">
                                    Weather Fetching Settings
                                </Heading>
                                <Stack spacing={4} gap={6}>
                                    <Text fontSize="sm" color="fg.muted">
                                        These settings control how often weather data is fetched and how long it is cached.
                                        Default values are applied upon node creation and can be modified later.
                                    </Text>
                                    <HStack justify="space-between" align="flex-start">
                                        <Field.Root required>
                                            <Field.Label>Weather Cache Interval <Field.RequiredIndicator /></Field.Label>
                                            <Input
                                                type="number"
                                                step="5"
                                                value={weatherCacheInterval}
                                                onChange={(e) => setWeatherCacheInterval(Number(e.target.value))}
                                            />
                                            <Field.HelperText>
                                                Interval in minutes to fetch new weather data.
                                            </Field.HelperText>
                                            <Field.ErrorText>
                                                Invalid interval.
                                            </Field.ErrorText>
                                        </Field.Root>
                                        <Field.Root required>
                                            <Field.Label>Weather Cache Expiry <Field.RequiredIndicator /></Field.Label>
                                            <Input
                                                type="number"
                                                step="1"
                                                value={weatherCacheExpiry}
                                                onChange={(e) => setWeatherCacheExpiry(Number(e.target.value))}
                                            />
                                            <Field.HelperText>
                                                Duration in hours before cached weather data is considered stale.
                                            </Field.HelperText>
                                            <Field.ErrorText>
                                                Invalid duration.
                                            </Field.ErrorText>
                                        </Field.Root>
                                    </HStack>
                                </Stack>
                            </Box>

                            <Box
                                bg="bg.panel"
                                borderWidth="1px"
                                borderColor="border"
                                borderRadius="md"
                                textAlign="left"
                                p={4}
                            >
                                <Heading size="sm" mb={4} color="teal.600">
                                    Batch Strategy - Advanced
                                </Heading>
                                <Stack spacing={4} gap={6}>
                                    <Field.Root colorPalette="teal">
                                        <Field.Label>Flow Control</Field.Label>
                                        <Switch.Root
                                            checked={flowControlEnabled}
                                            onChange={(checked) => setFlowControlEnabled(!flowControlEnabled)}
                                        >
                                            <Switch.HiddenInput />
                                            <Switch.Control>
                                                <Switch.Thumb />
                                            </Switch.Control>
                                            <Switch.Label>
                                                {flowControlEnabled ? "Enabled" : "Disabled"}
                                            </Switch.Label>
                                        </Switch.Root>
                                        <Field.HelperText>
                                            Enable flow control to manage water pressure during concurrent irrigation.
                                        </Field.HelperText>
                                    </Field.Root>

                                    <HStack justify="space-between" align="flex-start">
                                        <Field.Root>
                                            <Field.Label>Max Concurrent Zones</Field.Label>
                                            <Input
                                                type="number"
                                                step="1"
                                                value={maxConcurrentZones || ""}
                                                onChange={(e) => {
                                                    const val = e.target.value
                                                    setMaxConcurrentZones(val ? Number(val) : null)
                                                }}
                                                placeholder="Leave blank for no limit"
                                            />
                                            <Field.HelperText>
                                                Maximum number of zones that can be irrigated simultaneously.
                                            </Field.HelperText>
                                        </Field.Root>
                                        <Field.Root>
                                            <Field.Label>Max Total Irrigation Time</Field.Label>
                                            <Input
                                                type="number"
                                                step="5"
                                                value={maxTotalIrrigationTime || ""}
                                                onChange={(e) => {
                                                    const val = e.target.value
                                                    setMaxTotalIrrigationTime(val ? Number(val) : null)
                                                }}
                                                placeholder="Leave blank for no limit"
                                            />
                                            <Field.HelperText>
                                                Maximum total irrigation time for one cycle in minutes.
                                            </Field.HelperText>
                                        </Field.Root>
                                    </HStack>
                                </Stack>
                            </Box>
                        </Stack>
                    )}

                    <HStack spacing={4}>
                        <Button
                            alignSelf="flex-start"
                            variant="outline"
                            colorPalette="teal"
                            onClick={() => setShowAdvanced((v) => !v)}
                        >
                            {showAdvanced ? "Hide advanced settings" : "Show advanced settings"}
                        </Button>

                        <Button
                            alignSelf="flex-start"
                            colorPalette="teal"
                            onClick={handleSubmit}
                            isDisabled={!name.trim()}
                        >
                            Create Node
                        </Button>
                    </HStack>
                </Stack >

                <Stack spacing={4} gap={6}>
                    {/* Help boxes */}
                    <Heading size="md" color="fg" textAlign="left">
                        Need Help?
                    </Heading>
                    <Box bg="teal.50" p={4} borderRadius="md" textAlign="left">
                        <Heading fontSize="sm" fontWeight="bold" mb={2} color="teal.700">
                            What is a Node?
                        </Heading>
                        <Text fontSize="sm" color="fg.muted">
                            A node represents a <strong>physical irrigation controller</strong> responsible for managing one or more irrigation zones.

                            Each node defines global behavior such as automation schedule, safety irrigation limits, and batching strategy.
                            Zones created under a node inherit these settings and apply them during irrigation cycles.
                        </Text>
                    </Box>

                    <Box bg="teal.50" p={4} borderRadius="md" textAlign="left">
                        <Heading fontSize="sm" fontWeight="bold" mb={2} color="teal.700">
                            How does automation & scheduling work?
                        </Heading>
                        <Text fontSize="sm" color="fg.muted">
                            When automation is enabled, the node evaluates irrigation needs <strong>once per day at the scheduled time</strong>.

                            Based on weather data, zone configuration, and system limits, the node decides which zones should be irrigated and how much water should be applied.
                        </Text>
                    </Box>

                    <Box bg="teal.50" p={4} borderRadius="md" textAlign="left">
                        <Heading fontSize="sm" fontWeight="bold" mb={2} color="teal.700">
                            What is Batch Strategy?
                        </Heading>
                        <Text fontSize="sm" color="fg.muted">
                            The batch strategy defines <strong>how multiple irrigation zones are executed</strong> within one irrigation cycle.

                            Sequential mode irrigates zones one after another, while concurrent mode allows multiple zones to run at the same time, depending on system limits and water flow capacity.
                        </Text>
                    </Box>

                    <Box bg="teal.50" p={4} borderRadius="md" textAlign="left">
                        <Heading fontSize="sm" fontWeight="bold" mb={2} color="teal.700">
                            Do I need to configure advanced settings?
                        </Heading>
                        <Text fontSize="sm" color="fg.muted">
                            <strong>Advanced settings are optional</strong> and provide finer control over irrigation behavior.

                            Safe default values are applied upon node creation and can be modified later as needed.
                        </Text>
                    </Box>

                    {showAdvanced && (
                        <Box bg="teal.700" p={4} borderRadius="md" textAlign="left">
                            <Box
                                px={2}
                                py={1}
                                borderRadius="sm"
                                bg="teal.800"
                                display="inline-block"
                            >
                                <Text fontSize="xs" color="whiteAlpha.700" fontWeight="semibold">
                                    Advanced
                                </Text>
                            </Box>
                            <Heading fontSize="sm" fontWeight="bold" mb={2} color="whiteAlpha.900">
                                How to configure irrigation limits?
                            </Heading>
                            <Text fontSize="sm" color="whiteAlpha.700">
                                Irrigation limits define <strong>safe boundaries for how much water can be applied</strong> during a single irrigation cycle.

                                These limits act as a protection layer when weather-based calculations would otherwise produce extremely low or high irrigation volumes.
                            </Text>
                        </Box>
                    )}

                    {showAdvanced && (
                        <Box bg="teal.700" p={4} borderRadius="md" textAlign="left">
                            <Box
                                px={2}
                                py={1}
                                borderRadius="sm"
                                bg="teal.800"
                                display="inline-block"
                            >
                                <Text fontSize="xs" color="whiteAlpha.700" fontWeight="semibold">
                                    Advanced
                                </Text>
                            </Box>
                            <Heading fontSize="sm" fontWeight="bold" mb={2} color="whiteAlpha.900">
                                Main Valve Flow Limit
                            </Heading>
                            <Text fontSize="sm" color="whiteAlpha.700">
                                This setting represents a <strong>physical limitation of your water supply connection</strong>.

                                When multiple zones are irrigated concurrently, the system ensures that the total water flow does not exceed this limit.

                                Leave this unset if your installation does not require flow-based restrictions.
                            </Text>
                        </Box>
                    )}

                    {showAdvanced && (
                        <Box bg="teal.700" p={4} borderRadius="md" textAlign="left">
                            <Box
                                px={2}
                                py={1}
                                borderRadius="sm"
                                bg="teal.800"
                                display="inline-block"
                            >
                                <Text fontSize="xs" color="whiteAlpha.700" fontWeight="semibold">
                                    Advanced
                                </Text>
                            </Box>
                            <Heading fontSize="sm" fontWeight="bold" mb={2} color="whiteAlpha.900">
                                What are weather cache settings?
                            </Heading>
                            <Text fontSize="sm" color="whiteAlpha.700">
                                These settings control how often new weather data is fetched and how long it is considered valid.
                                Longer cache durations improve system stability, while shorter intervals provide more up-to-date adjustments.
                            </Text>
                        </Box>
                    )}

                    {showAdvanced && (
                        <Box bg="teal.700" p={4} borderRadius="md" textAlign="left">
                            <Box
                                px={2}
                                py={1}
                                borderRadius="sm"
                                bg="teal.800"
                                display="inline-block"
                            >
                                <Text fontSize="xs" color="whiteAlpha.700" fontWeight="semibold">
                                    Advanced
                                </Text>
                            </Box>
                            <Heading fontSize="sm" fontWeight="bold" mb={2} color="whiteAlpha.900">
                                Flow Control in Batch Strategy
                            </Heading>
                            <Text fontSize="sm" color="whiteAlpha.700">
                                Enabling flow control <strong>helps manage water pressure when irrigating multiple zones concurrently</strong>.
                                It dynamically adjusts valve openings to ensure the total flow remains within safe limits.
                            </Text>
                        </Box>
                    )}
                </Stack>
            </SimpleGrid >

        </Box >
    )

}

