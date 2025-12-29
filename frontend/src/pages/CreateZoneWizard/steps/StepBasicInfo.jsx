import { Stack, Input, Text, Box } from "@chakra-ui/react"

export default function StepBasicInfo({ data, onChange }) {
    return (
        <Stack spacing={4}>
            <Box>
                <Text mb={1}>Zone name *</Text>
                <Input
                    value={data.name}
                    onChange={(e) =>
                        onChange({
                            ...data,
                            name: e.target.value,
                        })
                    }
                />
            </Box>

            <Box>
                <Text mb={1}>Relay pin *</Text>
                <Input
                    type="number"
                    min="0"
                    value={data.relay_pin ?? ""}
                    onChange={(e) =>
                        onChange({
                            ...data,
                            relay_pin: Number(e.target.value),
                        })
                    }
                />
            </Box>

            <Box>
                <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <input
                        type="checkbox"
                        checked={data.enabled}
                        onChange={(e) =>
                            onChange({
                                ...data,
                                enabled: e.target.checked,
                            })
                        }
                    />
                    Enabled
                </label>
            </Box>
        </Stack>
    )
}
