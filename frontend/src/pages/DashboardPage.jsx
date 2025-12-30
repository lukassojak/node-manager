import { useEffect, useState } from "react"
import {
    Box,
    Heading,
    Text,
    Button,
    Stack,
    HStack,
    SimpleGrid,
} from "@chakra-ui/react"
import { Link } from "react-router-dom"
import { fetchNodes } from "../api/nodes.api"

export default function DashboardPage() {
    const [nodes, setNodes] = useState([])

    useEffect(() => {
        fetchNodes()
            .then((response) => setNodes(response.data))
            .catch((error) => console.error("Error fetching nodes:", error))
    }, [])

    return (
        <Box p={6}>
            {/* Page header */}
            <HStack justify="space-between" mb={6}>
                <Heading size="lg" color="fg">
                    Node Manager Dashboard
                </Heading>

                <Button
                    as={Link}
                    to="/nodes/new"
                    colorPalette="teal"
                >
                    Create new node
                </Button>
            </HStack>

            {/* Info text */}
            <Text mb={4} fontSize="sm" color="fg.muted">
                {nodes.length} configured node{nodes.length !== 1 && "s"}
            </Text>

            {/* Empty state */}
            {nodes.length === 0 && (
                <Box
                    bg="bg.subtle"
                    borderWidth="1px"
                    borderColor="border.subtle"
                    borderRadius="md"
                    p={6}
                >
                    <Text color="fg.muted">
                        No nodes found. Create your first node to get started.
                    </Text>
                </Box>
            )}

            {/* Nodes grid */}
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                {nodes.map((node) => (
                    <Box
                        key={node.id}
                        as={Link}
                        to={`/nodes/${node.id}`}
                        bg="bg.panel"
                        borderWidth="1px"
                        borderColor="border"
                        borderRadius="md"
                        p={4}
                        boxShadow="sm"
                        _hover={{
                            transform: "scale(1.015)",
                            boxShadow: "md",
                        }}
                        transition="transform 0.15s ease-out, box-shadow 0.15s ease-out"
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
                                    🔌
                                </Box>
                            </Box>
                            <Box flex="1">
                                <Stack spacing={1}>
                                    <Heading size="md" color="fg">
                                        Node #{node.id}
                                    </Heading>
                                    <Text fontSize="sm" color="fg.muted" fontWeight="semibold">
                                        {node.name}
                                    </Text>
                                    <Text fontSize="xs" color="fg.subtle">
                                        Last updated: {node.last_updated || "N/A"}
                                    </Text>

                                    {node.location && (
                                        <Text fontSize="sm" color="fg.muted">
                                            Location: {node.location}
                                        </Text>
                                    )}

                                    <Text fontSize="sm" color="fg.muted">
                                        Zones: {node.zones ? node.zones.length : 0}
                                    </Text>
                                </Stack>
                            </Box>
                        </HStack>
                    </Box>
                ))}
            </SimpleGrid>
        </Box>
    )
}
