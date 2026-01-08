import { useState } from "react"
import {
    Box,
    Heading,
    Text,
    Field,
    Input,
    Stack,
    HStack,
    Button,
    Badge,
    SimpleGrid,
    Progress,
    Separator,
} from "@chakra-ui/react"

const EMITTER_PRESETS = [
    { type: "dripper", label: "Dripper", icon: "💧", defaultFlow: 2 },
    { type: "soaker_hose", label: "Soaker hose", icon: "〰️", defaultFlow: 10 },
    { type: "micro_spray", label: "Micro spray", icon: "🌫️", defaultFlow: 15 },
]

const emitterFlow = (emitter) => {
    if (emitter.type === "soaker_hose") {
        return emitter.flow_rate_lph || 0
    }
    return (emitter.flow_rate_lph || 0) * (emitter.count || 0)
}

export default function StepEmittersPerPlant({
    data,
    baseTargetVolumeLiters,
    onChange,
}) {
    const plants = data.plants || []
    const [activePlantIndex, setActivePlantIndex] = useState(null)

    const activePlant =
        activePlantIndex !== null ? plants[activePlantIndex] : null

    /* -----------------------------
    Plant CRUD
    ----------------------------- */

    const startNewPlant = () => {
        const nextPlants = [
            ...plants,
            {
                id: crypto.randomUUID(),
                name: "",
                emitters: [],
            },
        ]
        onChange({ plants: nextPlants })
        setActivePlantIndex(nextPlants.length - 1)
    }

    const updateActivePlant = (updatedPlant) => {
        const next = [...plants]
        next[activePlantIndex] = updatedPlant
        onChange({ plants: next })
    }

    const removePlant = (index) => {
        onChange({
            plants: plants.filter((_, i) => i !== index),
        })
        if (activePlantIndex === index) {
            setActivePlantIndex(null)
        }
    }

    const totalZoneFlow = plants.reduce(
        (sum, plant) =>
            sum +
            plant.emitters.reduce((s, e) => s + emitterFlow(e), 0),
        0
    )

    /* -----------------------------
    Emitter CRUD (inside plant)
    ----------------------------- */

    const addEmitterToPlant = (preset) => {
        updateActivePlant({
            ...activePlant,
            emitters: [
                ...activePlant.emitters,
                {
                    type: preset.type,
                    flow_rate_lph: preset.defaultFlow,
                    count: preset.type === "soaker_hose" ? null : 1,
                },
            ],
        })
    }

    const updateEmitter = (index, updated) => {
        const nextEmitters = [...activePlant.emitters]
        nextEmitters[index] = updated
        updateActivePlant({
            ...activePlant,
            emitters: nextEmitters,
        })
    }

    const removeEmitter = (index) => {
        updateActivePlant({
            ...activePlant,
            emitters: activePlant.emitters.filter((_, i) => i !== index),
        })
    }

    /* -----------------------------
    Render
    ----------------------------- */

    return (
        <Stack spacing={6} gap={10}>
            <Box
                bg="bg.panel"
                borderWidth="1px"
                borderColor="border"
                borderRadius="md"
                p={4}
                textAlign="left"
            >
                <Heading size="sm" mb={2} color="teal.600">
                    Configure plants and emitters
                </Heading>

                <Text fontSize="sm" color="fg.muted" mb={6}>
                    Define individual plants within this zone and assign emitters to
                    each plant. The system will later distribute the zone water
                    budget across these plants.
                </Text>

                {/* -----------------------------
                        Inactive plant editor
                        ----------------------------- */}
                {!activePlant && (
                    <Text fontSize="sm" color="fg.subtle" mb={4}>
                        Select a plant to edit its configuration, or add a new plant
                        to get started.
                    </Text>
                )}


                {/* -----------------------------
                    Active plant editor
                ----------------------------- */}

                {activePlant && (
                    <Box
                        mb={8}
                        p={4}
                        bg="bg.panel"
                        borderWidth="1px"
                        borderColor="border"
                        borderRadius="md"
                    >
                        <Heading size="sm" mb={4} color="teal.600">
                            🌱 Plant configuration
                        </Heading>

                        <Field.Root required mb={4}>
                            <Field.Label>Plant name</Field.Label>
                            <Input
                                placeholder="e.g. Tomato"
                                value={activePlant.name}
                                onChange={(e) =>
                                    updateActivePlant({
                                        ...activePlant,
                                        name: e.target.value,
                                    })
                                }
                            />
                        </Field.Root>

                        {/* Add emitter buttons */}
                        <HStack spacing={3} mb={4}>
                            {EMITTER_PRESETS.map((preset) => (
                                <Button
                                    key={preset.type}
                                    variant="outline"
                                    onClick={() => addEmitterToPlant(preset)}
                                >
                                    {preset.icon} Add {preset.label}
                                </Button>
                            ))}
                        </HStack>

                        {/* Emitters grid */}
                        <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                            {activePlant.emitters.map((emitter, index) => {
                                const flow = emitterFlow(emitter)
                                const totalFlow = activePlant.emitters.reduce(
                                    (s, e) => s + emitterFlow(e),
                                    0
                                )
                                const share =
                                    totalFlow > 0
                                        ? Math.round((flow / totalFlow) * 100)
                                        : 0

                                return (
                                    <Box
                                        key={index}
                                        p={4}
                                        borderRadius="lg"
                                        bg="bg.panel"
                                        boxShadow="sm"
                                        borderWidth="1px"
                                        borderColor="border.subtle"
                                    >
                                        {/* Header */}
                                        <HStack justify="space-between" mb={3}>
                                            <HStack spacing={3}>
                                                <Box fontSize="xl">
                                                    {emitter.type === "dripper" && "💧"}
                                                    {emitter.type === "soaker_hose" && "〰️"}
                                                    {emitter.type === "micro_spray" && "🌫️"}
                                                </Box>
                                                <Badge variant="subtle">
                                                    {emitter.type}
                                                </Badge>
                                            </HStack>

                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                colorPalette="red"
                                                onClick={() => removeEmitter(index)}
                                            >
                                                Remove
                                            </Button>
                                        </HStack>

                                        <Stack spacing={3}>
                                            <HStack spacing={3}>
                                                <Field.Root>
                                                    <Field.Label>Flow rate (l/h)</Field.Label>
                                                    <Input
                                                        type="number"
                                                        step="0.5"
                                                        value={emitter.flow_rate_lph}
                                                        onChange={(e) =>
                                                            updateEmitter(index, {
                                                                ...emitter,
                                                                flow_rate_lph: Number(
                                                                    e.target.value
                                                                ),
                                                            })
                                                        }
                                                    />
                                                </Field.Root>

                                                {emitter.type !== "soaker_hose" && (
                                                    <Field.Root>
                                                        <Field.Label>Count</Field.Label>
                                                        <Input
                                                            type="number"
                                                            min={1}
                                                            value={emitter.count}
                                                            onChange={(e) =>
                                                                updateEmitter(index, {
                                                                    ...emitter,
                                                                    count: Number(
                                                                        e.target.value
                                                                    ),
                                                                })
                                                            }
                                                        />
                                                    </Field.Root>
                                                )}
                                            </HStack>

                                            <Box>
                                                <Text
                                                    fontSize="xs"
                                                    color="fg.muted"
                                                    mb={1}
                                                >
                                                    Share of plant flow
                                                </Text>
                                                <Progress.Root
                                                    value={share}
                                                    size="sm"
                                                    colorPalette="teal"
                                                >
                                                    <Progress.Track>
                                                        <Progress.Range />
                                                    </Progress.Track>
                                                </Progress.Root>
                                                <Text
                                                    fontSize="xs"
                                                    color="fg.subtle"
                                                    mt={1}
                                                >
                                                    {flow.toFixed(1)} l/h ({share}%)
                                                </Text>
                                            </Box>
                                        </Stack>
                                    </Box>
                                )
                            })}
                        </SimpleGrid>

                        <HStack mt={6}>
                            <Button
                                colorPalette="teal"
                                onClick={() => setActivePlantIndex(null)}
                            >
                                Save plant
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={() => setActivePlantIndex(null)}
                            >
                                Cancel
                            </Button>
                        </HStack>
                    </Box>
                )}
            </Box>
            <Box
                bg="bg.panel"
                borderWidth="1px"
                borderColor="border"
                borderRadius="md"
                p={4}
                textAlign="left"
            >
                {/* -----------------------------
                    Configured plants overview
                    ----------------------------- */}

                <Heading size="sm" mb={4} color="teal.600">
                    Configured plants
                </Heading>

                <SimpleGrid columns={{ base: 1, md: 3 }} gap={3}>
                    {plants.map((plant, index) => {
                        const totalFlow = plant.emitters.reduce(
                            (s, e) => s + emitterFlow(e),
                            0
                        )

                        return (
                            <Box
                                key={index}
                                p={4}
                                bg="bg.panel"
                                borderRadius="lg"
                                borderWidth="1px"
                                borderColor="border.subtle"
                                boxShadow="sm"
                            >
                                <Stack justify="space-between">
                                    <Box mb={4}>
                                        <Text fontSize="xs" color="fg.muted">
                                            Plant
                                        </Text>
                                        <Text fontWeight="medium">
                                            🌱 {plant.name || "Unnamed plant"}
                                        </Text>
                                        <Text fontSize="xs" color="fg.subtle">
                                            {plant.emitters.length} emitters · {totalFlow.toFixed(1)} l/h
                                        </Text>

                                        <Text fontSize="sm" fontWeight="medium" mt={2}>
                                            {totalZoneFlow > 0
                                                ? (
                                                    (baseTargetVolumeLiters * totalFlow) /
                                                    totalZoneFlow
                                                ).toFixed(2)
                                                : "—"}{" "}
                                            L
                                        </Text>

                                        <Text fontSize="xs" color="fg.subtle">
                                            Base irrigation volume for this plant
                                        </Text>
                                    </Box>

                                    <HStack>
                                        {/* Red edit button on hover */}
                                        <Button
                                            size="xs"
                                            variant="ghost"
                                            onClick={() =>
                                                setActivePlantIndex(index)
                                            }
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            size="xs"
                                            variant="ghost"
                                            colorPalette="red"
                                            onClick={() => removePlant(index)}
                                        >
                                            Remove
                                        </Button>
                                    </HStack>
                                </Stack>
                            </Box>
                        )
                    })}

                    <Button variant="outline" onClick={startNewPlant}>
                        + Add plant
                    </Button>
                </SimpleGrid>

                <Separator my={6} />

                <Stack spacing={1}>
                    <Text fontSize="sm" color="fg.muted">
                        Total zone flow
                    </Text>

                    <Text fontSize="lg" fontWeight="semibold">
                        {plants
                            .reduce(
                                (sum, plant) =>
                                    sum +
                                    plant.emitters.reduce(
                                        (s, e) => s + emitterFlow(e),
                                        0
                                    ),
                                0
                            )
                            .toFixed(1)}{" "}
                        l/h
                    </Text>

                    <Text fontSize="xs" color="fg.subtle">
                        Sum of all emitter flows across all plants in this zone
                    </Text>
                </Stack>

            </Box>
        </Stack>
    )
}
