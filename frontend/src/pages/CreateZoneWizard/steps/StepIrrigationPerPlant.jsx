import {
    Box,
    Heading,
    Text,
    Field,
    Input,
    Stack,
    Separator,
} from "@chakra-ui/react"

export default function StepIrrigationPerPlant({ data, onChange }) {
    const baseVolume = data.base_target_volume_liters || ""

    return (
        <Box
            bg="bg.panel"
            borderWidth="1px"
            borderColor="border"
            borderRadius="md"
            p={4}
            textAlign="left"
        >
            <Heading size="sm" mb={4} color="teal.600">
                Per-Plant Irrigation
            </Heading>

            <Text fontSize="sm" color="fg.muted" mb={6}>
                In this mode, irrigation is based on <strong>individual plants</strong> rather than total area.
                <br /><br />
                You define a <strong>base water volume for the entire zone</strong>.
                This volume will later be distributed between plants based on
                their emitter configuration.
            </Text>

            <Field.Root required>
                <Field.Label>
                    Base target zone volume (liters)
                </Field.Label>
                <Input
                    type="number"
                    min={0}
                    step="1"
                    placeholder="e.g. 40"
                    value={baseVolume}
                    onChange={(e) =>
                        onChange({
                            ...data,
                            base_target_volume_liters: Number(e.target.value),
                        })
                    }
                />
                <Field.HelperText>
                    Total amount of water available for this zone per irrigation cycle.
                </Field.HelperText>
            </Field.Root>

            <Separator my={6} />

            <Stack spacing={2}>
                <Text fontSize="sm" fontWeight="medium">
                    What happens next?
                </Text>
                <Text fontSize="sm" color="fg.muted">
                    In the next steps, you will define individual plants and their emitters.
                    The system will use this base volume to calculate how much water
                    each plant receives.
                </Text>
            </Stack>
        </Box>
    )
}
