import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { SimpleGrid, DataList, Badge, HStack, Button, Stack, Box, Heading, Text } from '@chakra-ui/react'
import { fetchZoneById, deleteZone } from '../api/nodes.api'

import FrequencyTimeline from '../components/FrequencyTimeline'
import { FullCorrectionIndicator } from '../components/CorrectionIndicator'


function JsonBlock({ title, data }) {
    return (
        <Box mt={4}>
            <Heading size="sm" mb={2}>{title}</Heading>
            <Box
                as="pre"
                p={3}
                bg="gray.50"
                borderRadius="md"
                fontSize="sm"
                overflowX="auto"
                textAlign="left"
            >
                {JSON.stringify(data, null, 2)}
            </Box>
        </Box>
    )
}


export default function ZoneDetailPage() {
    const { nodeId, zoneId } = useParams();
    const navigate = useNavigate();
    const [zone, setZone] = useState(null);

    useEffect(() => {
        fetchZoneById(nodeId, zoneId)
            .then((response) => {
                setZone(response.data)
            })
            .catch((error) => {
                console.error('Failed to fetch zone:', error)
            })
    }, [zoneId])

    if (!zone) {
        return (
            <Box p={4} >
                <Text>Loading zone details...</Text>
            </Box>
        )
    }

    return (
        <Box p={6}>
            {/* Page header */}
            <HStack justify="space-between" mb={6}>
                <Stack spacing={2} align="flex-start">
                    {/* Show breadcrumbs with node and zone */}
                    <HStack spacing={2} align="center">
                        <Link to={`/nodes/${nodeId}`}>
                            <Text fontSize="xs" color="teal">
                                Node #{nodeId}
                            </Text>
                        </Link>
                        <Text fontSize="xs" color="teal">
                            &rarr;
                        </Text>
                        <Text fontSize="xs" color="teal">
                            Zone #{zone.id}
                        </Text>
                    </HStack>
                    <Heading size="lg" color="fg">
                        Zone #{zone.id}
                    </Heading>
                    <Text fontSize="sm" color="fg.muted" fontWeight="semibold">
                        {zone.name || "Unnamed Zone"}
                    </Text>
                </Stack>

                <HStack spacing={2}>
                    <Button
                        colorPalette="red"
                        onClick={() => {
                            if (!confirm("Are you sure you want to delete this zone?")) return
                            deleteZone(nodeId, zone.id)
                                .then(() => navigate("/nodes/" + nodeId))
                                .catch(() => alert("Failed to delete zone"))
                        }}
                    >
                        Delete zone
                    </Button>

                    <Button
                        as={Link}
                        to={`/nodes/${nodeId}`}
                    >
                        &larr; Back to Node #{nodeId}
                    </Button>
                </HStack>
            </HStack>

            {/* Zone summary */}
            <Box
                bg="bg.panel"
                borderWidth="1px"
                borderColor="border"
                borderRadius="md"
                p={4}
                mb={6}
                textAlign="left"
            >
                <Heading size="sm" mb={4} color="teal.600">
                    Zone Summary
                </Heading>
                <DataList.Root orientation="horizontal" spacing={6}>
                    <DataList.Item key="ID">
                        <DataList.ItemLabel>ID</DataList.ItemLabel>
                        <DataList.ItemValue>{zone.id}</DataList.ItemValue>
                    </DataList.Item>
                    <DataList.Item>
                        <DataList.ItemLabel>Name</DataList.ItemLabel>
                        <DataList.ItemValue>{zone.name || "Unnamed Zone"}</DataList.ItemValue>
                    </DataList.Item>
                    <DataList.Item>
                        <DataList.ItemLabel>Relay Valve Pin</DataList.ItemLabel>
                        <DataList.ItemValue>
                            <Badge colorPalette="teal" variant="subtle">
                                Pin {zone.relay_pin}
                            </Badge>
                        </DataList.ItemValue>
                    </DataList.Item>
                    <DataList.Item>
                        <DataList.ItemLabel>Auto irrigation</DataList.ItemLabel>
                        <DataList.ItemValue>
                            {zone.enabled ? (
                                <Badge colorPalette="green" variant="subtle">Enabled</Badge>
                            ) : (
                                <Badge colorPalette="red" variant="subtle">Disabled</Badge>
                            )}
                        </DataList.ItemValue>
                    </DataList.Item>
                </DataList.Root>
            </Box>

            {/* Two-column layout for data + help boxes */}
            <SimpleGrid columns={{ base: 1, lg: 3 }} gap={6}>
                <Stack spacing={6} gap={10} gridColumn="span 2">
                    {/* Main data boxes */}
                    <Box
                        bg="bg.panel"
                        borderWidth="1px"
                        borderColor="border"
                        borderRadius="md"
                        p={4}
                        textAlign="left"
                    >
                        <Heading size="sm" mb={4} color="teal.600">
                            Irrigation Configuration
                        </Heading>
                        {zone.irrigation_mode === "even_area" && (
                            <DataList.Root orientation="horizontal" spacing={6}>
                                <DataList.Item>
                                    <DataList.ItemLabel>Mode</DataList.ItemLabel>
                                    <DataList.ItemValue>
                                        <Badge colorPalette="teal" variant="subtle">
                                            Even Area
                                        </Badge>
                                    </DataList.ItemValue>
                                </DataList.Item>
                                <DataList.Item>
                                    <DataList.ItemLabel>
                                        Zone area
                                    </DataList.ItemLabel>
                                    <DataList.ItemValue>
                                        {zone.irrigation_configuration.zone_area_m2} m²
                                    </DataList.ItemValue>
                                </DataList.Item>
                                <DataList.Item>
                                    <DataList.ItemLabel>
                                        Base target
                                    </DataList.ItemLabel>
                                    <DataList.ItemValue>
                                        {zone.irrigation_configuration.target_mm} mm
                                    </DataList.ItemValue>
                                </DataList.Item>
                                <DataList.Item>
                                    <DataList.ItemLabel>
                                        Base total zone target volume
                                    </DataList.ItemLabel>
                                    {/* Calculate liters from mm and area */}
                                    <DataList.ItemValue>
                                        {(
                                            zone.irrigation_configuration.target_mm *
                                            zone.irrigation_configuration.zone_area_m2
                                        ).toFixed(1)} L
                                    </DataList.ItemValue>
                                </DataList.Item>
                            </DataList.Root>
                        )}

                        {zone.irrigation_mode === "per_plant" && (
                            <DataList.Root orientation="horizontal" spacing={6}>
                                <DataList.Item>
                                    <DataList.ItemLabel>Mode</DataList.ItemLabel>
                                    <DataList.ItemValue>
                                        <Badge colorPalette="teal" variant="subtle">
                                            Per Plant
                                        </Badge>
                                    </DataList.ItemValue>
                                </DataList.Item>
                                <DataList.Item>
                                    <DataList.ItemLabel>
                                        Base total zone target volume
                                    </DataList.ItemLabel>
                                    <DataList.ItemValue>
                                        {(zone.irrigation_configuration.base_target_volume_liters).toFixed(1)} L
                                    </DataList.ItemValue>
                                </DataList.Item>
                            </DataList.Root>
                        )}
                    </Box>

                    {/* Behavior & Scheduling - frequency settings & fallback strategies */}
                    <Box
                        bg="bg.panel"
                        borderWidth="1px"
                        borderColor="border"
                        borderRadius="md"
                        p={4}
                        textAlign="left"
                    >
                        <Heading size="sm" mb={4} color="teal.600">
                            Behavior & Scheduling
                        </Heading>

                        {/* Top: two-column overview */}
                        <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
                            {/* Frequency settings */}
                            <Box>
                                <Text fontSize="sm" fontWeight="semibold" mb={3}>
                                    Frequency Settings
                                </Text>

                                <DataList.Root orientation="horizontal" spacing={4}>
                                    <DataList.Item>
                                        <DataList.ItemLabel>Dynamic interval</DataList.ItemLabel>
                                        <DataList.ItemValue>
                                            {zone.frequency_settings.dynamic_interval ? (
                                                <Badge colorPalette="green" variant="subtle">Enabled</Badge>
                                            ) : (
                                                <Badge variant="subtle">Disabled</Badge>
                                            )}
                                        </DataList.ItemValue>
                                    </DataList.Item>

                                    <DataList.Item>
                                        <DataList.ItemLabel>{zone.frequency_settings.dynamic_interval ? "Min interval" : "Fixed interval"}</DataList.ItemLabel>
                                        <DataList.ItemValue>
                                            {zone.frequency_settings.min_interval_days} days
                                        </DataList.ItemValue>
                                    </DataList.Item>

                                    {zone.frequency_settings.dynamic_interval && (
                                        <DataList.Item>
                                            <DataList.ItemLabel>Max interval</DataList.ItemLabel>
                                            <DataList.ItemValue>
                                                {zone.frequency_settings.max_interval_days} days
                                            </DataList.ItemValue>
                                        </DataList.Item>
                                    )}
                                </DataList.Root>
                            </Box>

                            {/* Fallback strategy */}
                            <Box>
                                <Text fontSize="sm" fontWeight="semibold" mb={3}>
                                    Fallback Strategy
                                </Text>

                                <DataList.Root orientation="horizontal" spacing={4}>
                                    <DataList.Item>
                                        <DataList.ItemLabel>No fresh data</DataList.ItemLabel>
                                        <DataList.ItemValue>
                                            <Badge variant="outline">
                                                {zone.fallback_strategy.on_fresh_weather_data_unavailable}
                                            </Badge>
                                        </DataList.ItemValue>
                                    </DataList.Item>

                                    <DataList.Item>
                                        <DataList.ItemLabel>Expired data</DataList.ItemLabel>
                                        <DataList.ItemValue>
                                            <Badge variant="outline">
                                                {zone.fallback_strategy.on_expired_weather_data}
                                            </Badge>
                                        </DataList.ItemValue>
                                    </DataList.Item>

                                    <DataList.Item>
                                        <DataList.ItemLabel>Missing weather data</DataList.ItemLabel>
                                        <DataList.ItemValue>
                                            <Badge variant="outline">
                                                {zone.fallback_strategy.on_missing_weather_data}
                                            </Badge>
                                        </DataList.ItemValue>
                                    </DataList.Item>
                                </DataList.Root>
                            </Box>
                        </SimpleGrid>


                        {/* show divider & timeline if dynamic interval is enabled */}
                        {zone.frequency_settings.dynamic_interval && (
                            <>
                                <Box my={6} borderBottom="1px solid" borderColor="border.muted" />
                                <FrequencyTimeline settings={zone.frequency_settings} />
                            </>
                        )}

                    </Box>




                    {/* Corrections & Adjustments */}
                    <Box
                        bg="bg.panel"
                        borderWidth="1px"
                        borderColor="border"
                        borderRadius="md"
                        p={4}
                        textAlign="left"
                    >
                        <Heading size="sm" mb={4} color="teal.600">
                            Corrections & Adjustments
                        </Heading>

                        <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
                            {/* Indicators */}
                            <HStack spacing={6}>
                                <FullCorrectionIndicator
                                    label="Solar"
                                    value={zone.local_correction_factors.solar}
                                />
                                <FullCorrectionIndicator
                                    label="Rain"
                                    value={zone.local_correction_factors.rain}
                                />
                                <FullCorrectionIndicator
                                    label="Temperature"
                                    value={zone.local_correction_factors.temperature}
                                />
                            </HStack>

                            {/* Legend */}
                            <Box>
                                <Text fontSize="sm" fontWeight="semibold" mb={2}>
                                    Adjustment Impact
                                </Text>
                                <Text fontSize="sm" color="fg.muted">
                                    Correction factors dynamically increase or decrease the calculated
                                    irrigation volume based on environmental conditions.
                                </Text>
                                <Text fontSize="xs" color="fg.subtle" mt={2}>
                                    Left = less water • Center = neutral • Right = more water
                                </Text>
                            </Box>
                        </SimpleGrid>
                    </Box>



                    {/* Emitters overview */}
                    <Box
                        bg="bg.panel"
                        borderWidth="1px"
                        borderColor="border"
                        borderRadius="md"
                        p={4}
                        textAlign="left"
                    >
                        <Heading size="sm" mb={4} color="teal.600">
                            Emitters Overview
                        </Heading>

                        {zone.irrigation_mode === "even_area" && (
                            <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} gap={4}>
                                {zone.emitters_configuration.summary.map((emitter, index) => (
                                    <Box
                                        key={index}
                                        bg="bg.muted"
                                        borderRadius="md"
                                        p={4}
                                        borderWidth="1px"
                                        borderColor="border.subtle"
                                    >
                                        {/* Header */}
                                        <HStack spacing={3} mb={3}>
                                            <Box
                                                w="36px"
                                                h="36px"
                                                borderRadius="md"
                                                bg="bg.panel"
                                                display="flex"
                                                alignItems="center"
                                                justifyContent="center"
                                                fontSize="lg"
                                            >
                                                🫗
                                            </Box>

                                            <Box>
                                                <Text fontSize="xs" color="fg.muted">
                                                    Emitter type
                                                </Text>
                                                <Badge colorPalette="blue" variant="subtle">
                                                    {emitter.type}
                                                </Badge>
                                            </Box>
                                        </HStack>

                                        {/* Stats */}
                                        <Stack spacing={2}>
                                            <HStack justify="space-between">
                                                <Text fontSize="sm" color="fg.muted">
                                                    Flow rate
                                                </Text>
                                                <Text fontSize="sm" fontWeight="medium">
                                                    {emitter.flow_rate_lph} l/h
                                                </Text>
                                            </HStack>

                                            <HStack justify="space-between">
                                                <Text fontSize="sm" color="fg.muted">
                                                    Count
                                                </Text>
                                                <Text fontSize="sm" fontWeight="medium">
                                                    {emitter.count} pcs
                                                </Text>
                                            </HStack>
                                        </Stack>
                                    </Box>
                                ))}
                            </SimpleGrid>
                        )}

                        {zone.irrigation_mode === "per_plant" && (
                            <Stack spacing={5}>
                                {zone.emitters_configuration.plants.map((plant, plantIndex) => (
                                    <Box
                                        key={plantIndex}
                                        bg="bg.muted"
                                        borderRadius="md"
                                        p={4}
                                        borderWidth="1px"
                                        borderColor="border.subtle"
                                    >
                                        {/* Plant header */}
                                        <HStack spacing={3} mb={4}>
                                            <Box
                                                w="36px"
                                                h="36px"
                                                borderRadius="md"
                                                bg="bg.panel"
                                                display="flex"
                                                alignItems="center"
                                                justifyContent="center"
                                                fontSize="lg"
                                            >
                                                🌱
                                            </Box>

                                            <Box>
                                                <Text fontSize="xs" color="fg.muted">
                                                    Plant #{plantIndex + 1}
                                                </Text>
                                                <Heading size="sm">
                                                    {plant.name || "Unnamed Plant"}
                                                </Heading>
                                            </Box>
                                        </HStack>

                                        {/* Emitters grid */}
                                        <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} gap={4}>
                                            {plant.emitters.map((emitter, emitterIndex) => (
                                                <Box
                                                    key={emitterIndex}
                                                    bg="bg.panel"
                                                    borderRadius="md"
                                                    p={4}
                                                    borderWidth="1px"
                                                    borderColor="border.subtle"
                                                >
                                                    {/* Header */}
                                                    <HStack spacing={3} mb={3}>
                                                        <Box
                                                            w="32px"
                                                            h="32px"
                                                            borderRadius="md"
                                                            bg="bg.muted"
                                                            display="flex"
                                                            alignItems="center"
                                                            justifyContent="center"
                                                            fontSize="lg"
                                                        >
                                                            🫗
                                                        </Box>

                                                        <Box>
                                                            <Text fontSize="xs" color="fg.muted">
                                                                Emitter type
                                                            </Text>
                                                            <Badge colorPalette="blue" variant="subtle">
                                                                {emitter.type}
                                                            </Badge>
                                                        </Box>
                                                    </HStack>

                                                    {/* Stats */}
                                                    <Stack spacing={2}>
                                                        <HStack justify="space-between">
                                                            <Text fontSize="sm" color="fg.muted">
                                                                Flow rate
                                                            </Text>
                                                            <Text fontSize="sm" fontWeight="medium">
                                                                {emitter.flow_rate_lph} l/h
                                                            </Text>
                                                        </HStack>

                                                        <HStack justify="space-between">
                                                            <Text fontSize="sm" color="fg.muted">
                                                                Count
                                                            </Text>
                                                            <Text fontSize="sm" fontWeight="medium">
                                                                {emitter.count} pcs
                                                            </Text>
                                                        </HStack>
                                                    </Stack>
                                                </Box>
                                            ))}
                                        </SimpleGrid>
                                    </Box>
                                ))}
                            </Stack>
                        )}

                    </Box>
                </Stack>

                <Box
                    position="sticky"
                    top="80px"              // under page header
                    maxH="calc(100vh - 120px)"
                    overflowY="auto"
                    pr={2}                  // scrollbar space
                    bg="bg.panel"
                    borderWidth="1px"
                    borderColor="bg.panel"   // blend with background
                    borderRadius="md"
                    p={4}
                >
                    <Stack spacing={4} gap={6}>
                        {/* Help boxes */}
                        <Heading size="md" color="fg" textAlign="left">
                            Need Help?
                        </Heading>
                        <Box bg="teal.50" p={4} borderRadius="md" textAlign="left">
                            <Heading fontSize="sm" fontWeight="bold" mb={2} color="teal.700">
                                What is a Zone?
                            </Heading>
                            <Text fontSize="sm" color="fg.muted">
                                A zone represents a <strong>specific area in your irrigation system that is managed independently</strong>. Each zone can have its own configuration, including the type and number of emitters, irrigation mode, and scheduling.

                                Each zone is controlled by a relay valve connected to a specific pin on your irrigation controller.
                            </Text>
                        </Box>

                        <Box bg="teal.50" p={4} borderRadius="md" textAlign="left">
                            <Heading fontSize="sm" fontWeight="bold" mb={2} color="teal.700">
                                Understanding Irrigation Modes
                            </Heading>
                            <Text fontSize="sm" color="fg.muted">
                                Irrigation mode defines <strong>how the base water volume is calculated</strong> for this zone.
                                <br /><br />
                                <strong>Even Area</strong> mode is suitable for uniform areas such as lawns or garden beds.
                                The base volume is calculated from:
                                <ul>
                                    <li>zone area (m²)</li>
                                    <li>target water depth (mm)</li>
                                </ul>
                                <br />
                                <strong>Per Plant</strong> mode is designed for zones with individual plants (e.g. pots or mixed crops).
                                In this mode, the zone uses a predefined base target volume and distributes water based on plant-level emitter configuration.
                            </Text>
                        </Box>

                        {zone.frequency_settings.dynamic_interval && (
                            <Box bg="teal.50" p={4} borderRadius="md" textAlign="left">
                                <Heading fontSize="sm" fontWeight="bold" mb={2} color="teal.700">
                                    Frequency & Scheduling
                                </Heading>
                                <Text fontSize="sm" color="fg.muted">
                                    Frequency settings define <strong>how often this zone is allowed to irrigate</strong>.
                                    <br /><br />
                                    When dynamic intervals are enabled, the node decides the irrigation day dynamically between
                                    the minimum and maximum interval based on: <strong>weather conditions</strong>, <strong>calculated irrigation volume</strong>, and
                                    a <strong>minimum volume threshold</strong>
                                    <br />
                                    The timeline below visualizes the allowed irrigation window and helps you understand
                                    when irrigation may be skipped or delayed.
                                </Text>
                            </Box>
                        )}

                        <Box bg="teal.50" p={4} borderRadius="md" textAlign="left">
                            <Heading fontSize="sm" fontWeight="bold" mb={2} color="teal.700">
                                Weather Data Fallback Strategy
                            </Heading>
                            <Text fontSize="sm" color="fg.muted">
                                Weather data is critical for adaptive irrigation, but it may occasionally be unavailable.

                                Depending on configuration, the system can respond to missing or outdated weather data in different ways:
                                <ul>
                                    <li>use cached data</li>
                                    <li>fall back to base volume</li>
                                    <li>apply a reduced volume</li>
                                    <li>or skip irrigation entirely</li>
                                </ul>
                            </Text>
                        </Box>

                        <Box bg="teal.50" p={4} borderRadius="md" textAlign="left">
                            <Heading fontSize="sm" fontWeight="bold" mb={2} color="teal.700">
                                Carry-over Volume & Threshold
                            </Heading>
                            <Text fontSize="sm" color="fg.muted">
                                Sometimes the calculated irrigation volume is too small to be meaningful.
                                <br /><br />
                                If the volume is below the configured threshold, irrigation is skipped.
                                When <strong>carry-over volume</strong> is enabled, the skipped volume
                                is <strong>accumulated</strong> and added to the next irrigation cycle.
                                <br /><br />
                                This prevents frequent micro-irrigation cycles and helps maintain stable soil moisture.
                                Disabling carry-over may lead to under-watering and is generally not recommended.
                            </Text>
                        </Box>

                        <Box bg="teal.50" p={4} borderRadius="md" textAlign="left">
                            <Heading fontSize="sm" fontWeight="bold" mb={2} color="teal.700">
                                Local Correction Factors
                            </Heading>
                            <Text fontSize="sm" color="fg.muted">
                                Correction factors fine-tune how strongly different weather conditions affect this zone.
                                <br /><br />
                                They are applied <strong>after</strong> the base irrigation volume is calculated.
                                <ul>
                                    <li><strong>Solar</strong> – adjusts sensitivity to sunlight</li>
                                    <li><strong>Rain</strong> – adjusts impact of rainfall</li>
                                    <li><strong>Temperature</strong> – adjusts response to air temperature</li>
                                </ul>
                                <br />
                                These values allow compensating for microclimate differences between zones
                                (e.g. shade, roof coverage, or soil type).
                            </Text>
                        </Box>
                    </Stack>
                </Box>
            </SimpleGrid>
        </Box>
    )
}