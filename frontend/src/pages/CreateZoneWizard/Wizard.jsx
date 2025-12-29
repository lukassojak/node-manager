import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Stack, Box, Heading, Text, Button } from '@chakra-ui/react'

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

    const steps = ["basic", "mode", "irrigation", "emitters", "behavior", "review",]
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

            <Box p={4} borderWidth="1px" borderRadius="md">
                <Text>
                    Step {currentStep + 1} / {steps.length} - {steps[currentStep]}
                </Text>

                <Box mt={4}>
                    {steps[currentStep] === "basic" && (
                        <StepBasicInfo
                            data={zoneDraft}
                            onChange={setZoneDraft}
                        />
                    )}

                    {steps[currentStep] === "mode" && (
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

                    {steps[currentStep] === "irrigation" && (
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

                    {steps[currentStep] === "emitters" && (
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

                    {steps[currentStep] === "behavior" && (
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

                    {steps[currentStep] === "review" && (
                        <StepReview data={zoneDraft} />
                    )}

                </Box>
            </Box>

            {submitError && steps[currentStep] === "review" && (
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

                {steps[currentStep] !== "review" && (
                    <Button
                        colorScheme="teal"
                        mb={4}
                        onClick={goNext}
                        disabled={
                            isLastStep ||
                            (steps[currentStep] === "mode" && !isModeValid) ||
                            (steps[currentStep] === "basic" && !isBasicInfoValid) ||
                            (steps[currentStep] === "irrigation" && !isIrrigationValid) ||
                            (steps[currentStep] === "emitters" && !isEmittersValid)
                        }
                    >
                        Next
                    </Button>
                )}

                {steps[currentStep] === "review" && (
                    <Button
                        colorPalette="green"
                        mb={4}
                        onClick={handleSubmit}
                    >
                        Create Zone
                    </Button>
                )}
            </Stack>
        </Box>
    )
}