import { useEffect, useState } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import {
    Button,
    Stack,
    Box,
    Heading,
    Text,
    HStack,
    SimpleGrid,
    DataList,
    Badge
} from "@chakra-ui/react"
import { fetchNodeById, deleteNode } from "../api/nodes.api"
import { LimitedCorrectionIndicator } from "../components/CorrectionIndicator"


export default function NodeDetailPage() {
    const { nodeId } = useParams()
    const navigate = useNavigate()
    const [node, setNode] = useState(null)

    useEffect(() => {
        fetchNodeById(nodeId)
            .then((response) => setNode(response.data))
            .catch((error) => console.error("Failed to fetch node:", error))
    }, [nodeId])

    if (!node) {
        return (
            <Box p={6}>
                <Text color="fg.muted">Loading node…</Text>
            </Box>
        )
    }

    return (
        <Box p={6}>
            {/* Page header */}
            <HStack justify="space-between" mb={6}>
                <Stack spacing={2} align="flex-start">
                    <Heading size="lg" color="fg">
                        Node #{node.id}
                    </Heading>
                    <Text fontSize="sm" color="fg.muted" fontWeight="semibold">
                        {node.name || "Unnamed Node"}
                    </Text>
                </Stack>

                <HStack spacing={2}>
                    <Button
                        as={Link}
                        to={`/nodes/${node.id}/zones/new`}
                        colorPalette="teal"
                    >
                        Create new zone
                    </Button>

                    <Button
                        colorPalette="red"
                        onClick={() => {
                            if (!confirm("Are you sure you want to delete this node and all its zones?")) return
                            deleteNode(node.id)
                                .then(() => navigate("/"))
                                .catch(() => alert("Failed to delete node"))
                        }}
                    >
                        Delete node
                    </Button>

                    <Button
                        as={Link}
                        to="/"
                    >
                        &larr; Back to Dashboard
                    </Button>
                </HStack>
            </HStack>

            {/* Node summary */}
            <Box
                bg="bg.panel"
                borderWidth="1px"
                borderColor="border"
                borderRadius="md"
                p={4}
                mb={6}
                textAlign="left"
            >
                <Stack spacing={2}>
                    <HStack spacing={2}>
                        <Text fontSize="sm" color="fg.muted">
                            Node ID
                        </Text>
                        <Text fontSize="sm">{node.id}</Text>
                    </HStack>
                    <HStack spacing={2}>
                        {node.location && (
                            <>
                                <Text fontSize="sm" color="fg.muted">
                                    Location
                                </Text>
                                <Text fontSize="sm">{node.location}</Text>
                            </>
                        )}
                    </HStack>
                    <HStack spacing={2}>
                        <Text fontSize="sm" color="fg.muted">
                            Last updated
                        </Text>
                        <Text fontSize="sm">{new Date(node.last_updated).toLocaleString() || "N/A"}</Text>
                    </HStack>
                </Stack>
            </Box>


            <Box
                bg="bg.panel"
                borderWidth="1px"
                borderColor="border"
                borderRadius="md"
                p={4}
                mb={6}
                textAlign="left"
            >
                <Heading size="sm" mb={3}>
                    Configuration Overview
                </Heading>

                <SimpleGrid columns={{ base: 1, md: 2 }} gap={3}>
                    <DataList.Root orientation="horizontal" spacing={6}>
                        <DataList.Item>
                            <DataList.ItemLabel>Automation</DataList.ItemLabel>
                            <DataList.ItemValue>
                                {/* Use badge colors for enabled/disabled */}
                                {node.automation.enabled ? (
                                    <Badge colorPalette="green">Enabled</Badge>
                                ) : (
                                    <Badge colorPalette="red">Disabled</Badge>
                                )}
                            </DataList.ItemValue>
                        </DataList.Item>
                        <DataList.Item>
                            <DataList.ItemLabel>Scheduled Time</DataList.ItemLabel>
                            <DataList.ItemValue>
                                {node.automation.enabled
                                    ? `${String(node.automation.scheduled_hour).padStart(2, '0')}:${String(node.automation.scheduled_minute).padStart(2, '0')}`
                                    : "N/A"}
                            </DataList.ItemValue>
                        </DataList.Item>
                        <DataList.Item>
                            <DataList.ItemLabel>Batch Strategy</DataList.ItemLabel>
                            <DataList.ItemValue>
                                {node.batch_strategy.concurrent_irrigation
                                    ? "Concurrent irrigation"
                                    : "Sequential irrigation"}
                            </DataList.ItemValue>
                        </DataList.Item>
                        <DataList.Item>
                            <DataList.ItemLabel>Flow Control</DataList.ItemLabel>
                            <DataList.ItemValue>
                                {node.batch_strategy.flow_control ? "Enabled" : "Disabled"}
                            </DataList.ItemValue>
                        </DataList.Item>
                        {/*
                        <DataList.Item>
                            <DataList.ItemLabel>Input Pins</DataList.ItemLabel>
                            <DataList.ItemValue>{node.hardware.input_pins.length}</DataList.ItemValue>
                        </DataList.Item>
                        <DataList.Item>
                            <DataList.ItemLabel>Output Pins</DataList.ItemLabel>
                            <DataList.ItemValue>{node.hardware.output_pins.length}</DataList.ItemValue>
                        </DataList.Item>
                        */}
                    </DataList.Root>
                </SimpleGrid>
            </Box>

            {/* Zones */}
            <Box>
                <Heading size="md" mb={4} color="fg">
                    Zones
                </Heading>

                {/* Info text */}
                <Text mb={4} fontSize="sm" color="fg.muted">
                    {node.zones.length} configured zone{node.zones.length !== 1 && "s"}
                </Text>

                {node.zones.length === 0 && (
                    <Box
                        bg="bg.subtle"
                        borderWidth="1px"
                        borderColor="border.subtle"
                        borderRadius="md"
                        p={4}
                    >
                        <Text color="fg.muted">
                            Node has no zones defined.
                        </Text>
                    </Box>
                )}

                <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
                    {node.zones.map((zone) => (
                        <Box
                            key={zone.id}
                            as={Link}
                            to={`/nodes/${node.id}/zones/${zone.id}`}
                            bg="bg.panel"
                            borderWidth="1px"
                            borderColor="border"
                            borderRadius="md"
                            p={4}
                            boxShadow="sm"
                            transition="all 0.15s ease-out"
                            _hover={{
                                transform: "scale(1.02)",
                                boxShadow: "md",
                            }}
                            textAlign="left"
                        >
                            <HStack align="stretch" spacing={4}>
                                <Box
                                    w="40px"
                                    display="flex"
                                    alignItems="flex-start"
                                    justifyContent="center"
                                >
                                    <Box
                                        w="32px"
                                        h="32px"
                                        borderRadius="md"
                                        bg="bg.subtle"
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                        fontSize="lg"
                                    >
                                        🌱
                                    </Box>
                                </Box>
                                <Box flex="1">
                                    <Stack spacing={2} textAlign="left">
                                        {/* Zone identity */}
                                        <Heading size="md" color="fg">
                                            Zone #{zone.id}
                                        </Heading>

                                        <Text fontSize="sm" color="fg.muted" fontWeight="semibold">
                                            {zone.name}
                                        </Text>

                                        {/* Status row */}
                                        <HStack spacing={3} mt={2}>
                                            <Badge
                                                colorPalette={
                                                    zone.enabled ? "green" : "red"
                                                }
                                            >
                                                {zone.enabled ? "Enabled" : "Disabled"}
                                            </Badge>

                                            {/* Even area / per plant mode */}
                                            <Badge colorPalette="teal">
                                                {zone.irrigation_mode === "even_area"
                                                    ? "Even Area"
                                                    : "Per Plant"}
                                            </Badge>
                                        </HStack>

                                        {/* Technical info */}
                                        <Text fontSize="sm" color="fg.muted" mt={2}>
                                            Valve pin: {zone.relay_pin}
                                        </Text>
                                    </Stack>
                                </Box>
                                <Box w="120px">
                                    <Stack spacing={2} align="center">
                                        <LimitedCorrectionIndicator
                                            label="Solar"
                                            value={zone.local_correction_factors.solar}
                                        />
                                        <LimitedCorrectionIndicator
                                            label="Rain"
                                            value={zone.local_correction_factors.rain}
                                        />
                                        <LimitedCorrectionIndicator
                                            label="Temp"
                                            value={zone.local_correction_factors.temperature}
                                        />
                                    </Stack>
                                </Box>
                            </HStack>
                        </Box>
                    ))}
                </SimpleGrid>
            </Box>
        </Box>
    )
}
