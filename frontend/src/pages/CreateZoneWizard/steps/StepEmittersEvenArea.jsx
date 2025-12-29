import { Box, Button, Input, Stack, Text } from "@chakra-ui/react"


export default function StepEmittersEvenArea({ data, onChange }) {
    const emitters = data.summary || []

    const addEmitter = () => {
        onChange({
            summary: [
                ...emitters,
                { type: "", flow_rate_lph: 0, count: 1 },
            ],
        })
    }

    const updateEmitter = (index, updated) => {
        onChange({
            summary: emitters.map((e, i) => (i === index ? updated : e)),
        })
    }

    const removeEmitter = (index) => {
        onChange({
            summary: emitters.filter((_, i) => i !== index),
        })
    }

    return (
        <Stack spacing={4}>
            {emitters.map((emitter, index) => (
                <Box key={index} p={3} borderWidth="1px" borderRadius="md">
                    <Stack spacing={2}>
                        <Text fontWeight="semibold">Emitter {index + 1}</Text>
                        <Box>
                            <Text mb={1}>Type *</Text>
                            <Input
                                placeholder="Emitter type"
                                value={emitter.type}
                                onChange={(e) =>
                                    updateEmitter(index, {
                                        ...emitter,
                                        type: e.target.value,
                                    })
                                }
                            />
                        </Box>

                        <Box>
                            <Text mb={1}>Flow rate (l/h) *</Text>
                            <Input
                                type="number"
                                min="0"
                                placeholder="Flow rate (l/h)"
                                value={emitter.flow_rate_lph}
                                onChange={(e) =>
                                    updateEmitter(index, {
                                        ...emitter,
                                        flow_rate_lph: Number(e.target.value),
                                    })
                                }
                            />
                        </Box>

                        <Box>
                            <Text mb={1}>Count *</Text>
                            <Input
                                type="number"
                                min="1"
                                placeholder="Count"
                                value={emitter.count}
                                onChange={(e) =>
                                    updateEmitter(index, {
                                        ...emitter,
                                        count: Number(e.target.value),
                                    })
                                }
                            />
                        </Box>

                        <Button
                            size="sm"
                            colorPalette="red"
                            onClick={() => removeEmitter(index)}
                        >
                            Remove
                        </Button>
                    </Stack>
                </Box>
            ))}

            <Button onClick={addEmitter}>Add emitter</Button>
        </Stack>
    )
}