import { Stack, Input, Text, Box } from "@chakra-ui/react"


export default function StepIrrigationEvenArea({ data, onChange }) {
    return (
        <Stack spacing={4}>
            <Box>
                <Text mb={1}>Zone area (m²) *</Text>
                <Input
                    type="number"
                    min="0"
                    value={data.zone_area_m2 ?? ""}
                    onChange={(e) =>
                        onChange({
                            ...data,
                            zone_area_m2: Number(e.target.value)
                        })
                    }
                />
            </Box>

            <Box>
                <Text mb={1}>Target water depth (mm) *</Text>
                <Input
                    type="number"
                    min="0"
                    value={data.target_mm ?? ""}
                    onChange={(e) =>
                        onChange({
                            ...data,
                            target_mm: Number(e.target.value)
                        })
                    }
                />
            </Box>
        </Stack>
    )
}