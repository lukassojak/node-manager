import { useRef, useState, useMemo, useEffect } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import {
    SimpleGrid,
    HStack,
    Stack,
    Box,
    Heading,
    Text,
    Button,
} from "@chakra-ui/react"

import { createZone } from "../../api/nodes.api"

import StepBasicInfo from "./steps/StepBasicInfo"
import StepIrrigationMode from "./steps/StepIrrigationMode"
import StepIrrigationEvenArea from "./steps/StepIrrigationEvenArea"
import StepIrrigationPerPlant from "./steps/StepIrrigationPerPlant"
import StepEmittersEvenArea from "./steps/StepEmittersEvenArea"
import StepEmittersPerPlant from "./steps/StepEmittersPerPlant"
import StepBehaviorSettings from "./steps/StepBehaviorSettings"
import StepReview from "./steps/StepReview"

export default function Wizard() {
    const { nodeId } = useParams()
    const navigate = useNavigate()

    const [currentStep, setCurrentStep] = useState(0)
    const [submitError, setSubmitError] = useState(null)

    /* --------------------------------------------
       Zone draft state
    -------------------------------------------- */

    const [zoneDraft, setZoneDraft] = useState({
        name: "",
        relay_pin: null,
        enabled: true,
        irrigation_mode: null,

        irrigation_configuration: null,
        emitters_configuration: null,

        local_correction_factors: {
            solar: 0,
            rain: 0,
            temperature: 0,
        },
        frequency_settings: {
            dynamic_interval: false,
            min_interval_days: 1,
            max_interval_days: 7,
            carry_over_volume: true,
            irrigation_volume_threshold_percent: 20,
        },
        fallback_strategy: {
            on_fresh_weather_data_unavailable: "use_cached_data",
            on_expired_weather_data: "use_cached_data",
            on_missing_weather_data: "use_base_volume",
        },
    })

    /* --------------------------------------------
       Steps (DATA-DRIVEN)
    -------------------------------------------- */

    const steps = useMemo(
        () => [
            {
                key: "basic",
                title: "Basic",
                description: "Zone identity & valve",
                isValid: () =>
                    zoneDraft.name.trim() !== "" &&
                    zoneDraft.relay_pin !== null,
                render: () => (
                    <StepBasicInfo
                        data={zoneDraft}
                        onChange={setZoneDraft}
                    />
                ),
            },
            {
                key: "mode",
                title: "Mode",
                description: "Irrigation strategy",
                isValid: () => zoneDraft.irrigation_mode !== null,
                render: () => (
                    <StepIrrigationMode
                        value={zoneDraft.irrigation_mode}
                        onChange={(mode) =>
                            setZoneDraft({
                                ...zoneDraft,
                                irrigation_mode: mode,

                                // Reset dependent configurations
                                irrigation_configuration: null,
                                emitters_configuration: null,
                            })
                        }
                    />
                ),
            },
            {
                key: "irrigation",
                title: "Irrigation",
                description: "Water targets",
                isValid: () =>
                    zoneDraft.irrigation_mode === "even_area"
                        ? zoneDraft.irrigation_configuration?.zone_area_m2 &&
                        zoneDraft.irrigation_configuration?.target_mm
                        : zoneDraft.irrigation_configuration
                            ?.base_target_volume_liters,
                render: () =>
                    zoneDraft.irrigation_mode === "even_area" ? (
                        <StepIrrigationEvenArea
                            data={zoneDraft.irrigation_configuration || {}}
                            onChange={(config) =>
                                setZoneDraft({
                                    ...zoneDraft,
                                    irrigation_configuration: config,
                                })
                            }
                        />
                    ) : (
                        <StepIrrigationPerPlant
                            data={zoneDraft.irrigation_configuration || {}}
                            onChange={(config) =>
                                setZoneDraft({
                                    ...zoneDraft,
                                    irrigation_configuration: config,
                                })
                            }
                        />
                    ),
            },
            {
                key: "emitters",
                title: "Emitters",
                description: "Hardware layout",
                isValid: () =>
                    zoneDraft.irrigation_mode === "even_area"
                        ? zoneDraft.emitters_configuration?.summary?.length > 0
                        : zoneDraft.emitters_configuration?.plants?.length > 0,
                render: () =>
                    zoneDraft.irrigation_mode === "even_area" ? (
                        <StepEmittersEvenArea
                            data={zoneDraft.emitters_configuration || {}}
                            onChange={(config) =>
                                setZoneDraft({
                                    ...zoneDraft,
                                    emitters_configuration: config,
                                })
                            }
                        />
                    ) : (
                        <StepEmittersPerPlant
                            data={zoneDraft.emitters_configuration || {}}
                            baseTargetVolumeLiters={
                                zoneDraft.irrigation_configuration?.base_target_volume_liters || 0
                            }
                            onChange={(config) =>
                                setZoneDraft({
                                    ...zoneDraft,
                                    emitters_configuration: config,
                                })
                            }
                        />
                    ),
            },
            {
                key: "behavior",
                title: "Behavior",
                description: "Frequency & corrections",
                isValid: () => true,
                render: () => (
                    <StepBehaviorSettings
                        data={{
                            local_correction_factors:
                                zoneDraft.local_correction_factors,
                            frequency_settings:
                                zoneDraft.frequency_settings,
                            fallback_strategy:
                                zoneDraft.fallback_strategy,
                        }}
                        onChange={(updated) =>
                            setZoneDraft({
                                ...zoneDraft,
                                ...updated,
                            })
                        }
                    />
                ),
            },
            {
                key: "review",
                title: "Review",
                description: "Final check",
                isValid: () => true,
                render: () => <StepReview data={zoneDraft} />,
            },
        ],
        [zoneDraft]
    )

    const activeStep = steps[currentStep]

    /* --------------------------------------------
       Navigation
    -------------------------------------------- */

    const goNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep((s) => s + 1)
        }
    }

    const goBack = () => {
        if (currentStep > 0) {
            setCurrentStep((s) => s - 1)
        }
    }

    const handleSubmit = () => {
        createZone(nodeId, zoneDraft)
            .then((res) =>
                navigate(`/nodes/${nodeId}/zones/${res.data.id}`)
            )
            .catch((error) => {
                console.error("Create zone failed:", error)

                if (error.response) {
                    console.error("Response data:", error.response.data)
                    console.error("Status:", error.response.status)
                }

                setSubmitError(
                    error.response?.data?.message ??
                    JSON.stringify(error.response?.data, null, 2) ??
                    "An unknown error occurred."
                )
            }
            )
    }

    /* --------------------------------------------
       Sidebar scroll logic
    -------------------------------------------- */

    const sidebarScrollRef = useRef(null)
    const helpRefs = useRef({})

    const helpIndexByStep = {
        basic: 0,
        mode: 1,
        irrigation: 2,
        emitters: 3,
        behavior: 4,
        review: 0,
    }

    useEffect(() => {
        const container = sidebarScrollRef.current
        const index = helpIndexByStep[activeStep.key]
        const target = helpRefs.current[index]

        if (!container || !target) return

        container.scrollTo({
            top: target.offsetTop - container.offsetTop,
            behavior: "smooth"
        })
    }, [activeStep.key])

    /* --------------------------------------------
        New step scroll to top
    -------------------------------------------- */

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" })
    }, [currentStep])

    /* --------------------------------------------
       Render
    -------------------------------------------- */

    return (
        <Box p={6} textAlign="left">
            <HStack mb={6} justify="space-between">
                <Stack spacing={2} alignItems="flex-start">
                    <Heading>Create new zone</Heading>
                    <Text>Node ID: {nodeId}</Text>
                </Stack>
                <Button
                    as={Link}
                    to={`/nodes/${nodeId}`}
                    variant="outline"
                >
                    Exit Wizard
                </Button>
            </HStack>

            {/* Step indicator */}
            <HStack mb={4} spacing={2}>
                {steps.map((step, index) => (
                    <Box
                        key={step.key}
                        px={3}
                        py={1}
                        borderRadius="full"
                        fontSize="sm"
                        transition="all 0.15s ease"
                        bg={index === currentStep ? "teal.100" : "bg.subtle"}
                        color={index === currentStep ? "teal.700" : "fg.muted"}
                        fontWeight={index === currentStep ? "semibold" : "normal"}
                        transform={index === currentStep ? "scale(1.05)" : "scale(1)"}
                    >
                        {index + 1}. {step.title}
                    </Box>
                ))}
            </HStack>

            <SimpleGrid columns={{ base: 1, lg: 3 }} gap={6}>
                {/* Main column */}
                <Stack spacing={6} gridColumn="span 2">
                    <Box
                        key={activeStep.key}
                        animation="fadeSlideIn 0.25s ease-out"
                    >
                        {activeStep.render()}
                    </Box>

                    {submitError && activeStep.key === "review" && (
                        <Box p={3} bg="red.50" borderRadius="md">
                            <Text fontSize="sm" color="red.700">
                                {submitError}
                            </Text>
                        </Box>
                    )}

                    <HStack>
                        <Button
                            variant="outline"
                            colorPalette="teal"
                            onClick={goBack}
                            disabled={currentStep === 0}
                        >
                            Back
                        </Button>

                        {activeStep.key !== "review" ? (
                            <Button
                                variant="outline"
                                colorPalette="teal"
                                onClick={goNext}
                                disabled={!activeStep.isValid()}
                            >
                                Next
                            </Button>
                        ) : (
                            <Button
                                colorPalette="teal"
                                onClick={handleSubmit}
                            >
                                Create Zone
                            </Button>
                        )}
                    </HStack>
                </Stack>

                {/* Sidebar */}
                <Stack spacing={4}>
                    <Heading size="md" textAlign="left">
                        Need Help?
                    </Heading>

                    <Box
                        ref={sidebarScrollRef}
                        maxH="calc(100vh - 160px)"
                        overflowY="auto"
                        pr={2}
                    >
                        <Stack spacing={6}>
                            {helpSections.map((section, index) => (
                                <Box
                                    key={index}
                                    ref={(el) =>
                                        (helpRefs.current[index] = el)
                                    }
                                    bg={
                                        helpIndexByStep[activeStep.key] ===
                                            index
                                            ? "teal.700"
                                            : "teal.50"
                                    }
                                    p={4}
                                    borderRadius="md"
                                    textAlign="left"
                                >
                                    <Heading
                                        fontSize="sm"
                                        fontWeight="bold"
                                        mb={2}
                                        color={
                                            helpIndexByStep[
                                                activeStep.key
                                            ] === index
                                                ? "whiteAlpha.900"
                                                : "teal.700"
                                        }
                                    >
                                        {section.title}
                                    </Heading>
                                    <Text
                                        fontSize="sm"
                                        color={
                                            helpIndexByStep[
                                                activeStep.key
                                            ] === index
                                                ? "whiteAlpha.800"
                                                : "fg.muted"
                                        }
                                    >
                                        {section.content}
                                    </Text>
                                </Box>
                            ))}
                        </Stack>
                    </Box>
                </Stack>
            </SimpleGrid>
        </Box>
    )
}

/* --------------------------------------------
   Help content (PLACEHOLDERS)
-------------------------------------------- */

const helpSections = [
    {
        title: "What is a Zone?",
        content: (
            <>
                A <strong>zone</strong> represents a single, independently controlled
                irrigation area connected to one physical valve.
                <br /><br />
                Each zone defines:
                <ul>
                    <li>how much water should be applied (<strong>base volume</strong>)</li>
                    <li>how often irrigation is allowed (<strong>frequency rules</strong>)</li>
                    <li>how weather influences irrigation (<strong>corrections</strong>)</li>
                </ul>
                <br />
                A zone is always attached to a specific <strong>node</strong> and uses
                one <strong>relay pin</strong> to control its valve.
            </>
        ),
    },

    {
        title: "Irrigation Mode",
        content: (
            <>
                Irrigation mode defines <strong>how the base irrigation volume is calculated</strong> for this zone.
                <br /><br />
                <strong>Even Area</strong> mode is designed for uniform areas such as lawns
                or garden beds. The base volume is calculated from:
                <ul>
                    <li>zone area (m²)</li>
                    <li>target irrigation depth (mm)</li>
                </ul>
                <br />
                <strong>Per Plant</strong> mode is intended for zones with individual plants.
                In this mode, a predefined <strong>base target volume</strong> is distributed
                according to plant-level emitter configuration.
            </>
        ),
    },

    {
        title: "Irrigation Targets",
        content: (
            <>
                Irrigation targets define the <strong>base amount of water</strong> applied
                during one irrigation cycle, before any weather-based adjustments.
                <br /><br />
                This value represents an <strong>ideal reference volume</strong>.
                The final applied volume may be:
                <ul>
                    <li>reduced by rainfall</li>
                    <li>increased during hot or sunny conditions</li>
                    <li>skipped entirely if below the configured threshold</li>
                </ul>
                <br />
                All further behavior is calculated relative to this base target.
            </>
        ),
    },

    {
        title: "Emitters & Hardware Layout",
        content: (
            <>
                Emitters describe the <strong>physical irrigation
                    hardware</strong> used in this zone.
                <br /><br />
                Each emitter defines:
                <ul>
                    <li><strong>type</strong> (e.g. dripper, sprinkler)</li>
                    <li><strong>flow rate</strong> (liters per hour)</li>
                    <li><strong>count</strong> (number of identical emitters)</li>
                </ul>
                <br />
                The system uses this information to estimate irrigation duration
                and to validate hydraulic limits.
            </>
        ),
    },

    {
        title: "Frequency & Scheduling",
        content: (
            <>
                Frequency settings define <strong>when irrigation is allowed to occur</strong>.
                <br /><br />
                Irrigation is permitted only within a window defined by:
                <ul>
                    <li><strong>minimum interval</strong> (earliest possible day)</li>
                    <li><strong>maximum interval</strong> (latest allowed day)</li>
                </ul>
                <br />
                When <strong>dynamic interval</strong> is enabled, the system selects
                the optimal irrigation day inside this window based on:
                <ul>
                    <li>weather conditions</li>
                    <li>calculated irrigation volume</li>
                    <li>volume threshold rules</li>
                </ul>
            </>
        ),
    },

    {
        title: "Carry-over Volume & Threshold",
        content: (
            <>
                Very small irrigation volumes are often ineffective.
                <br /><br />
                If the calculated volume is below the configured
                <strong>irrigation volume threshold</strong>, irrigation is skipped.
                <br /><br />
                When <strong>carry-over volume</strong> is enabled, the skipped volume
                is <strong>accumulated</strong> and added to the next irrigation cycle.
                <br /><br />
                This prevents frequent micro-irrigation and helps maintain
                stable soil moisture over time.
            </>
        ),
    },

    {
        title: "Local Correction Factors",
        content: (
            <>
                Local correction factors adjust how strongly weather data influences
                this specific zone.
                <br /><br />
                They are applied <strong>after</strong> the base irrigation volume
                is calculated.
                <ul>
                    <li><strong>Solar</strong> – sensitivity to sunlight</li>
                    <li><strong>Rain</strong> – impact of rainfall</li>
                    <li><strong>Temperature</strong> – response to air temperature</li>
                </ul>
                <br />
                These factors allow compensating for <strong>microclimates</strong>,
                such as shaded areas, covered zones, or different soil types.
            </>
        ),
    },

    {
        title: "Weather Data Fallback Strategy",
        content: (
            <>
                Adaptive irrigation relies on fresh weather data, but data may
                occasionally be unavailable.
                <br /><br />
                The fallback strategy defines how the system behaves when:
                <ul>
                    <li>weather data is missing</li>
                    <li>cached data is expired</li>
                    <li>data cannot be refreshed</li>
                </ul>
                <br />
                Possible strategies include using cached values,
                falling back to base volume, or skipping irrigation
                to avoid unsafe behavior.
            </>
        ),
    },
]

