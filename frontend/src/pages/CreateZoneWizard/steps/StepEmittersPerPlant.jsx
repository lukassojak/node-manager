import { Box, Button, Input, Stack, Text } from "@chakra-ui/react"

export default function StepEmittersPerPlant({ data, onChange }) {
    const plants = data.plants || []

    const addPlant = () => {
        onChange({
            plants: [
                ...plants,
                {
                    id: Date.now(),
                    name: "",
                    emitters: [],
                },
            ],
        })
    }

    const updatePlant = (index, updated) => {
        onChange({
            plants: plants.map((p, i) => (i === index ? updated : p)),
        })
    }

    return (
        <Stack spacing={4}>
            {plants.map((plant, plantIndex) => (
                <Box key={plant.id} p={3} borderWidth="1px" borderRadius="md">
                    <Stack spacing={2}>
                        <Text fontWeight="bold">Plant {plantIndex + 1}</Text>
                        <Input
                            placeholder="Plant name"
                            value={plant.name}
                            onChange={(e) =>
                                updatePlant(plantIndex, {
                                    ...plant,
                                    name: e.target.value,
                                })
                            }
                        />

                        {plant.emitters.map((emitter, emitterIndex) => (
                            <Box key={emitterIndex} pl={3}>
                                <Stack spacing={2}>
                                    <Text fontWeight="semibold">Emitter {emitterIndex + 1}</Text>
                                    <Box>
                                        <Text mb={1}>Type *</Text>
                                        <Input
                                            placeholder="Emitter type"
                                            value={emitter.type}
                                            onChange={(e) => {
                                                const updatedEmitters = plant.emitters.map((em, i) =>
                                                    i === emitterIndex
                                                        ? { ...em, type: e.target.value }
                                                        : em
                                                )

                                                updatePlant(plantIndex, {
                                                    ...plant,
                                                    emitters: updatedEmitters,
                                                })
                                            }}
                                        />
                                    </Box>

                                    <Box>
                                        <Text mb={1}>Flow rate (l/h) *</Text>
                                        <Input
                                            type="number"
                                            min="0"
                                            placeholder="Flow rate (l/h)"
                                            value={emitter.flow_rate_lph}
                                            onChange={(e) => {
                                                const updatedEmitters = plant.emitters.map((em, i) =>
                                                    i === emitterIndex
                                                        ? { ...em, flow_rate_lph: Number(e.target.value) }
                                                        : em
                                                )

                                                updatePlant(plantIndex, {
                                                    ...plant,
                                                    emitters: updatedEmitters,
                                                })
                                            }}
                                        />
                                    </Box>

                                    <Box>
                                        <Text mb={1}>Count *</Text>
                                        <Input
                                            type="number"
                                            min="1"
                                            placeholder="Count"
                                            value={emitter.count}
                                            onChange={(e) => {
                                                const updatedEmitters = plant.emitters.map((em, i) =>
                                                    i === emitterIndex
                                                        ? { ...em, count: Number(e.target.value) }
                                                        : em
                                                )

                                                updatePlant(plantIndex, {
                                                    ...plant,
                                                    emitters: updatedEmitters,
                                                })
                                            }}
                                        />
                                    </Box>

                                    <Button
                                        size="xs"
                                        colorPalette="red"
                                        onClick={() => {
                                            const updatedEmitters = plant.emitters.filter(
                                                (_, i) => i !== emitterIndex
                                            )

                                            updatePlant(plantIndex, {
                                                ...plant,
                                                emitters: updatedEmitters,
                                            })
                                        }}
                                    >
                                        Remove emitter
                                    </Button>
                                </Stack>
                            </Box>
                        ))}

                        <Button
                            size="sm"
                            onClick={() =>
                                updatePlant(plantIndex, {
                                    ...plant,
                                    emitters: [
                                        ...plant.emitters,
                                        { type: "", flow_rate_lph: 0, count: 1 },
                                    ],
                                })
                            }
                        >
                            Add emitter
                        </Button>

                        <Button
                            size="sm"
                            colorPalette="red"
                            onClick={() =>
                                onChange({
                                    plants: plants.filter((_, i) => i !== plantIndex),
                                })
                            }
                        >
                            Remove plant
                        </Button>
                    </Stack>
                </Box>
            ))}

            <Button onClick={addPlant}>Add plant</Button>
        </Stack>
    )
}
