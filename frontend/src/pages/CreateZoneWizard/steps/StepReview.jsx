import {
    Box,
    Heading,
    Text,
    Stack,
    SimpleGrid,
    Badge,
    DataList,
    HStack,
} from "@chakra-ui/react"

import { useState } from "react"

import FrequencyTimeline from "../../../components/FrequencyTimeline"

function CorrectionIndicator({ label, value }) {
    return (
        <Stack spacing={1} align="center">
            <Text fontSize="xs" color="fg.subtle">
                {label}
            </Text>
            <Box
                w="60px"
                h="6px"
                bg="bg.subtle"
                borderRadius="full"
                position="relative"
            >
                <Box
                    position="absolute"
                    left="50%"
                    transform={`translateX(${value * 30}px)`}
                    w="6px"
                    h="6px"
                    bg="teal.500"
                    borderRadius="full"
                />
            </Box>
        </Stack>
    )
}

export default function StepReview({ data }) {
    const [showRawData, setShowRawData] = useState(false)

    const {
        name,
        relay_pin,
        enabled,
        irrigation_mode,
        irrigation_configuration,
        emitters_configuration,
        frequency_settings,
        local_correction_factors,
    } = data

    const totalZoneFlow =
        irrigation_mode === "even_area"
            ? emitters_configuration?.summary?.reduce(
                (s, e) => s + e.flow_rate_lph * e.count,
                0
            )
            : emitters_configuration?.plants?.reduce(
                (sum, plant) =>
                    sum +
                    plant.emitters.reduce(
                        (s, e) =>
                            s +
                            (e.type === "soaker_hose"
                                ? e.flow_rate_lph
                                : e.flow_rate_lph * e.count),
                        0
                    ),
                0
            )

    return (
        <Stack spacing={8}>

            {/* -------------------------
            Zone summary
        ------------------------- */}
            <Box bg="bg.panel" p={4} borderRadius="md" borderWidth="1px">
                <Heading size="sm" mb={4} color="teal.600">
                    Zone summary
                </Heading>

                <DataList.Root orientation="horizontal" spacing={6}>
                    <DataList.Item>
                        <DataList.ItemLabel>Name</DataList.ItemLabel>
                        <DataList.ItemValue>
                            {name || "Unnamed zone"}
                        </DataList.ItemValue>
                    </DataList.Item>

                    <DataList.Item>
                        <DataList.ItemLabel>Relay pin</DataList.ItemLabel>
                        <DataList.ItemValue>
                            <Badge variant="subtle" colorPalette="teal">
                                Pin {relay_pin}
                            </Badge>
                        </DataList.ItemValue>
                    </DataList.Item>

                    <DataList.Item>
                        <DataList.ItemLabel>Status</DataList.ItemLabel>
                        <DataList.ItemValue>
                            {enabled ? (
                                <Badge colorPalette="green" variant="subtle">
                                    Enabled
                                </Badge>
                            ) : (
                                <Badge colorPalette="red" variant="subtle">
                                    Disabled
                                </Badge>
                            )}
                        </DataList.ItemValue>
                    </DataList.Item>
                </DataList.Root>
            </Box>

            {/* -------------------------
            Irrigation strategy
        ------------------------- */}
            <Box bg="bg.panel" p={4} borderRadius="md" borderWidth="1px">
                <Heading size="sm" mb={4} color="teal.600">
                    Irrigation strategy
                </Heading>

                <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
                    <Box>
                        <Text fontSize="xs" color="fg.muted">Mode</Text>
                        <Badge colorPalette="teal" variant="subtle">
                            {irrigation_mode === "even_area"
                                ? "Even area"
                                : "Per plant"}
                        </Badge>
                    </Box>

                    {irrigation_mode === "even_area" && (
                        <>
                            <Box>
                                <Text fontSize="xs" color="fg.muted">Zone area</Text>
                                <Text>
                                    {irrigation_configuration.zone_area_m2} m²
                                </Text>
                            </Box>

                            <Box>
                                <Text fontSize="xs" color="fg.muted">Target depth</Text>
                                <Text>
                                    {irrigation_configuration.target_mm} mm
                                </Text>
                            </Box>
                        </>
                    )}

                    {irrigation_mode === "per_plant" && (
                        <Box>
                            <Text fontSize="xs" color="fg.muted">
                                Base target volume
                            </Text>
                            <Text>
                                {irrigation_configuration.base_target_volume_liters} L
                            </Text>
                        </Box>
                    )}
                </SimpleGrid>
            </Box>

            {/* -------------------------
            Emitters overview
        ------------------------- */}
            <Box bg="bg.panel" p={4} borderRadius="md" borderWidth="1px">
                <Heading size="sm" mb={4} color="teal.600">
                    Emitters overview
                </Heading>

                <Text fontSize="sm" color="fg.muted" mb={3}>
                    Total zone flow
                </Text>

                <Text fontSize="lg" fontWeight="semibold">
                    {totalZoneFlow?.toFixed(1)} l/h
                </Text>
            </Box>

            {/* -------------------------
            Behavior & scheduling
        ------------------------- */}
            <Box bg="bg.panel" p={4} borderRadius="md" borderWidth="1px">
                <Heading size="sm" mb={4} color="teal.600">
                    Behavior & scheduling
                </Heading>

                <FrequencyTimeline settings={frequency_settings} />
            </Box>

            {/* -------------------------
            Corrections
        ------------------------- */}
            <Box bg="bg.panel" p={4} borderRadius="md" borderWidth="1px">
                <Heading size="sm" mb={4} color="teal.600">
                    Local corrections
                </Heading>

                <HStack spacing={6}>
                    <CorrectionIndicator
                        label="Solar"
                        value={local_correction_factors.solar}
                    />
                    <CorrectionIndicator
                        label="Rain"
                        value={local_correction_factors.rain}
                    />
                    <CorrectionIndicator
                        label="Temp"
                        value={local_correction_factors.temperature}
                    />
                </HStack>
            </Box>

            {/* -------------------------
            Option to show raw data
            ------------------------- */}
            <Box bg="bg.panel" p={4} borderRadius="md" borderWidth="1px">
                <Text
                    fontSize="sm"
                    color="teal.600"
                    cursor="pointer"
                    textDecoration="underline"
                    onClick={() => setShowRawData(!showRawData)}
                >
                    {showRawData ? "Hide" : "Show"} raw data
                </Text>

                {showRawData && (
                    <Box
                        as="pre"
                        mt={4}
                        p={4}
                        bg="bg.subtle"
                        borderRadius="md"
                        overflowX="auto"
                        fontSize="xs"
                    >
                        {JSON.stringify(data, null, 2)}
                    </Box>
                )}
            </Box>

            {/* -------------------------
            Final hint
        ------------------------- */}
            <Box bg="teal.50" p={4} borderRadius="md">
                <Text fontSize="sm" color="teal.700">
                    Review the configuration carefully. Once the zone is created,
                    it will be evaluated automatically during each irrigation cycle
                    according to the node schedule and weather data.
                </Text>
            </Box>

        </Stack>
    )
}
