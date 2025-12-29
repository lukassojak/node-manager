import { Stack, Box, Text } from "@chakra-ui/react"

export default function StepIrrigationMode({ value, onChange }) {
    return (
        <Stack spacing={4}>
            <Box>
                <label style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <input
                        type="radio"
                        name="irrigation_mode"
                        value="even_area"
                        checked={value === "even_area"}
                        onChange={() => onChange("even_area")}
                    />
                    Even area (uniform watering)
                </label>
            </Box>

            <Box>
                <label style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <input
                        type="radio"
                        name="irrigation_mode"
                        value="per_plant"
                        checked={value === "per_plant"}
                        onChange={() => onChange("per_plant")}
                    />
                    Per plant (individual plants)
                </label>
            </Box>

            {!value && (
                <Text color="gray.500">
                    Please select an irrigation mode.
                </Text>
            )}
        </Stack>
    )
}
