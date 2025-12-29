import { Stack, Input, Text, Box } from "@chakra-ui/react"

export default function StepIrrigationPerPlant({ data, onChange }) {
    return (
        <Stack spacing={4}>
            <Box>
                <Text mb={1}>Base target volume (liters) *</Text>
                <Input
                    type="number"
                    min="0"
                    value={data.base_target_volume_liters ?? ""}
                    onChange={(e) =>
                        onChange({
                            ...data,
                            base_target_volume_liters: Number(e.target.value),
                        })
                    }
                />
            </Box>
        </Stack>
    )
}
