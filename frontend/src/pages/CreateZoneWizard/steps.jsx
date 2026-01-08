import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Steps, SimpleGrid, HStack, Stack, Box, Heading, Text, Button } from '@chakra-ui/react'

import { createZone } from "../../api/nodes.api"

import StepBasicInfo from "./steps/StepBasicInfo"
import StepIrrigationMode from './steps/StepIrrigationMode'
import StepIrrigationEvenArea from './steps/StepIrrigationEvenArea'
import StepIrrigationPerPlant from './steps/StepIrrigationPerPlant'
import StepEmittersEvenArea from './steps/StepEmittersEvenArea'
import StepEmittersPerPlant from './steps/StepEmittersPerPlant'
import StepBehaviorSettings from './steps/StepBehaviorSettings'
import StepReview from './steps/StepReview'


export default function Wizard() {
    const { nodeId } = useParams();
    const navigate = useNavigate();

    const [submitError, setSubmitError] = useState(null)

    const handleSubmit = () => {
        createZone(nodeId, zoneDraft)
            .then((response) => {
                navigate(`/nodes/${nodeId}/zones/${response.data.id}`)
            })
            .catch((error) => {
                if (error.response?.status === 422) {
                    setSubmitError("The configuration is invalid. Please review your inputs.")
                } else {
                    setSubmitError(
                        error.response?.data?.detail.msg ||
                        "The configurration is invalid. Please review your inputs."
                    )
                }
            })
    }

    const steps = [
        {
            key: "basic",
            title: "Basic",
            description: "Zone identity & valve",
        },
        {
            key: "mode",
            title: "Mode",
            description: "Irrigation strategy",
        },
        {
            key: "irrigation",
            title: "Irrigation",
            description: "Water targets",
        },
        {
            key: "emitters",
            title: "Emitters",
            description: "Hardware layout",
        },
        {
            key: "behavior",
            title: "Behavior",
            description: "Frequency & corrections",
        },
        {
            key: "review",
            title: "Review",
            description: "Final check",
        },
    ]
    const [currentStep, setCurrentStep] = useState(0)

    const [zoneDraft, setZoneDraft] = useState({
        name: "",
        relay_pin: null,
        enabled: true,
        irrigation_mode: null,

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

    const isFirstStep = currentStep === 0
    const isLastStep = currentStep === steps.length - 1

    const isBasicInfoValid = zoneDraft.name.trim() !== "" && zoneDraft.relay_pin !== null
    const isModeValid = zoneDraft.irrigation_mode !== null
    const isIrrigationValid =
        zoneDraft.irrigation_mode === "even_area"
            ? zoneDraft.irrigation_configuration?.zone_area_m2 &&
            zoneDraft.irrigation_configuration?.target_mm
            : zoneDraft.irrigation_configuration?.base_target_volume_liters
    const isEmittersValid =
        zoneDraft.irrigation_mode === "even_area"
            ? zoneDraft.emitters_configuration?.summary?.length > 0
            : zoneDraft.emitters_configuration?.plants?.length > 0

    const goNext = () => {
        setCurrentStep((s) => {
            if (s >= steps.length - 1) {
                return s
            }
            return s + 1
        })
    }

    const goBack = () => {
        setCurrentStep((s) => {
            if (s <= 0) {
                return s
            }
            return s - 1
        })
    }


    return (
        <Box p={6}>
            <Heading mb={2}>Create new zone</Heading>
            <Text mb={4}>Node ID: {nodeId} </Text>
            {/* Stepper */}
            <HStack mb={4} spacing={3}>
                {steps.map((step, index) => (
                    <Box
                        key={step.key}
                        px={3}
                        py={1}
                        borderRadius="full"
                        fontSize="sm"
                        bg={index === currentStep ? "teal.100" : "bg.subtle"}
                        color={index === currentStep ? "teal.700" : "fg.muted"}
                        fontWeight={index === currentStep ? "semibold" : "normal"}
                    >
                        {index + 1}. {step.key}
                    </Box>
                ))}
            </HStack>

            <SimpleGrid columns={{ base: 1, lg: 3 }} gap={6}>
                {/* Main content */}
                <Stack spacing={6} gridColumn="span 2">
                    <Box mt={4}>
                        {steps[currentStep].key === "basic" && (
                            <StepBasicInfo
                                data={zoneDraft}
                                onChange={setZoneDraft}
                            />
                        )}
                        {steps[currentStep].key === "mode" && (
                            <StepIrrigationMode
                                value={zoneDraft.irrigation_mode}
                                onChange={(mode) =>
                                    setZoneDraft({
                                        ...zoneDraft,
                                        irrigation_mode: mode,
                                    })
                                }
                            />
                        )}
                        {steps[currentStep].key === "irrigation" && (
                            <>
                                {zoneDraft.irrigation_mode === "even_area" && (
                                    <StepIrrigationEvenArea
                                        data={zoneDraft.irrigation_configuration || {}}
                                        onChange={(config) =>
                                            setZoneDraft({
                                                ...zoneDraft,
                                                irrigation_configuration: config,
                                            })
                                        }
                                    />
                                )}
                                {zoneDraft.irrigation_mode === "per_plant" && (
                                    <StepIrrigationPerPlant
                                        data={zoneDraft.irrigation_configuration || {}}
                                        onChange={(config) =>
                                            setZoneDraft({
                                                ...zoneDraft,
                                                irrigation_configuration: config,
                                            })
                                        }
                                    />
                                )}
                            </>
                        )}
                        {steps[currentStep].key === "emitters" && (
                            <>
                                {zoneDraft.irrigation_mode === "even_area" && (
                                    <StepEmittersEvenArea
                                        data={zoneDraft.emitters_configuration || {}}
                                        onChange={(config) =>
                                            setZoneDraft({
                                                ...zoneDraft,
                                                emitters_configuration: config,
                                            })
                                        }
                                    />
                                )}
                                {zoneDraft.irrigation_mode === "per_plant" && (
                                    <StepEmittersPerPlant
                                        data={zoneDraft.emitters_configuration || {}}
                                        onChange={(config) =>
                                            setZoneDraft({
                                                ...zoneDraft,
                                                emitters_configuration: config,
                                            })
                                        }
                                    />
                                )}
                            </>
                        )}
                        {steps[currentStep].key === "behavior" && (
                            <StepBehaviorSettings
                                data={{
                                    local_correction_factors: zoneDraft.local_correction_factors,
                                    frequency_settings: zoneDraft.frequency_settings,
                                    fallback_strategy: zoneDraft.fallback_strategy,
                                }}
                                onChange={(updated) =>
                                    setZoneDraft({
                                        ...zoneDraft,
                                        ...updated,
                                    })
                                }
                            />
                        )}
                        {steps[currentStep].key === "review" && (
                            <StepReview data={zoneDraft} />
                        )}
                    </Box>
                    {submitError && steps[currentStep].key === "review" && (
                        <Box
                            mt={4}
                            p={3}
                            bg="red.50"
                            border="1px solid"
                            borderColor="red.300"
                            borderRadius="md"
                        >
                            <Text color="red.700" fontSize="sm">
                                {typeof submitError === "string"
                                    ? submitError
                                    : JSON.stringify(submitError, null, 2)}
                            </Text>
                        </Box>
                    )}
                    <Stack direction="row" spacing={2} mt={4}>
                        <Button
                            onClick={goBack}
                            disabled={isFirstStep}
                        >
                            Back
                        </Button>
                        {steps[currentStep].key !== "review" && (
                            <Button
                                colorScheme="teal"
                                mb={4}
                                onClick={goNext}
                                disabled={
                                    isLastStep ||
                                    (steps[currentStep].key === "mode" && !isModeValid) ||
                                    (steps[currentStep].key === "basic" && !isBasicInfoValid) ||
                                    (steps[currentStep].key === "irrigation" && !isIrrigationValid) ||
                                    (steps[currentStep].key === "emitters" && !isEmittersValid)
                                }
                            >
                                Next
                            </Button>
                        )}
                        {steps[currentStep].key === "review" && (
                            <Button
                                colorPalette="green"
                                mb={4}
                                onClick={handleSubmit}
                            >
                                Create Zone
                            </Button>
                        )}
                    </Stack>
                </Stack>

                {/* Sidebar */}
                <Stack spacing={4}>
                    {/* Help boxes or additional info can go here */}
                    <Box
                        position="sticky"
                        top="80px"              // pod page header
                        maxH="calc(100vh - 120px)"
                        overflowY="auto"
                        pr={2}                  // prostor pro scrollbar
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
                </Stack>
            </SimpleGrid>
        </Box>
    )
}