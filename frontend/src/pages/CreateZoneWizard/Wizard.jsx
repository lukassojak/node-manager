import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Stack, Box, Heading, Text, Button } from '@chakra-ui/react'


export default function Wizard() {
    const { nodeId } = useParams();

    const steps = ["basic", "mode", "irrigation", "emitters", "review",]
    const [currentStep, setCurrentStep] = useState(0)

    const [zoneDraft, setZoneDraft] = useState({
        name: "",
        relay_pin: null,
        enabled: true,
        irrigation_mode: null,
    })

    const isFirstStep = currentStep === 0
    const isLastStep = currentStep === steps.length - 1

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
                    {/* Step content will go here */}
                    <Text>Step content placeholder</Text>
                </Box>
            </Box>

            <Stack direction="row" spacing={2} mt={4}>
                <Button
                    onClick={goBack}
                    disabled={isFirstStep}
                >
                    Back
                </Button>

                <Button
                    colorScheme="teal"
                    mb={4}
                    onClick={goNext}
                    disabled={isLastStep}
                >
                    Next
                </Button>
            </Stack>
        </Box>
    )
}