import { Box, Stack, Text, Input } from "@chakra-ui/react"


function LocalCorrectionFactors({ value, onChange }) {
    return (
        <Stack spacing={3}>
            <Text fontWeight="bold">Local correction factors</Text>
            <Text fontSize="sm" color="gray.600">
                Multipliers applied on top of weather-based adjustments.
            </Text>

            {["solar", "rain", "temperature"].map((key) => (
                <Box key={key}>
                    <Text mb={1}>{key}</Text>
                    <Input
                        type="number"
                        min="0"
                        step="0.1"
                        value={value[key]}
                        onChange={(e) =>
                            onChange({
                                ...value,
                                [key]: Number(e.target.value),
                            })
                        }
                    />
                </Box>
            ))}
        </Stack>
    )
}


function FrequencySettings({ value, onChange }) {
    return (
        <Stack spacing={3}>
            <Text fontWeight="bold">Frequency settings</Text>
            <Text fontSize="sm" color="gray.600">
                Configure how often irrigation should occur, whether irrigation
                intervals should be dynamic, and how to handle unused water volume.
            </Text>
            <label>
                <input
                    type="checkbox"
                    checked={value.dynamic_interval}
                    onChange={(e) =>
                        onChange({
                            ...value,
                            dynamic_interval: e.target.checked,
                        })
                    }
                />{" "}
                Dynamic interval
            </label>

            <Box>
                <Text mb={1}>Min interval (days)</Text>
                <Input
                    type="number"
                    min="1"
                    max="30"
                    value={value.min_interval_days}
                    onChange={(e) =>
                        onChange({
                            ...value,
                            min_interval_days: Number(e.target.value),
                        })
                    }
                />
            </Box>

            <Box>
                <Text mb={1}>Max interval (days)</Text>
                <Input
                    type="number"
                    min="1"
                    max="30"
                    value={value.max_interval_days}
                    onChange={(e) =>
                        onChange({
                            ...value,
                            max_interval_days: Number(e.target.value),
                        })
                    }
                />
            </Box>

            <label>
                <input
                    type="checkbox"
                    checked={value.carry_over_volume}
                    onChange={(e) =>
                        onChange({
                            ...value,
                            carry_over_volume: e.target.checked,
                        })
                    }
                />{" "}
                Carry over unused water volume
            </label>

            <Box>
                <Text mb={1}>Irrigation volume threshold (%)</Text>
                <Input
                    type="number"
                    min="0"
                    max="100"
                    step="5"
                    value={value.irrigation_volume_threshold_percent}
                    onChange={(e) =>
                        onChange({
                            ...value,
                            irrigation_volume_threshold_percent: Number(e.target.value),
                        })
                    }
                />
            </Box>
        </Stack>
    )
}


function FallbackStrategy({ value, onChange }) {
    const simple_fallback_options = [
        { value: "use_base_volume", label: "Use base volume" },
        { value: "use_half_base_volume", label: "Use half base volume" },
        { value: "skip_irrigation", label: "Skip irrigation" },
    ]

    const full_fallback_options = [
        ...simple_fallback_options,
        { value: "use_cached_data", label: "Use cached weather data" },
    ]

    return (
        <Stack spacing={3}>
            <Text fontWeight="bold">Fallback strategy</Text>
            <Text fontSize="sm" color="gray.600">
                Define how to handle situations when weather data is unavailable
                or expired.
            </Text>
            {[
                ["on_fresh_weather_data_unavailable", "Fresh data unavailable"],
                ["on_expired_weather_data", "Expired weather data"],
                ["on_missing_weather_data", "Missing weather data"],
            ].map(([key, label]) => (
                <Box key={key}>
                    <Text mb={1}>{label}</Text>
                    <select
                        value={value[key]}
                        onChange={(e) =>
                            onChange({
                                ...value,
                                [key]: e.target.value,
                            })
                        }
                    >
                        {(key === "on_missing_weather_data"
                            ? simple_fallback_options
                            : full_fallback_options
                        ).map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </Box>
            ))}
        </Stack>
    )
}


export default function StepBehaviorSettings({ data, onChange }) {
    return (
        <Stack spacing={6}>
            <Box p={3} borderWidth="1px" borderRadius="md">
                <LocalCorrectionFactors
                    value={data.local_correction_factors}
                    onChange={(updated) =>
                        onChange({
                            local_correction_factors: updated,
                        })
                    }
                />
            </Box>

            <Box p={3} borderWidth="1px" borderRadius="md">
                <FrequencySettings
                    value={data.frequency_settings}
                    onChange={(updated) =>
                        onChange({
                            frequency_settings: updated,
                        })
                    }
                />
            </Box>

            <Box p={3} borderWidth="1px" borderRadius="md">
                <FallbackStrategy
                    value={data.fallback_strategy}
                    onChange={(updated) =>
                        onChange({
                            fallback_strategy: updated,
                        })
                    }
                />
            </Box>
        </Stack>
    )
}
