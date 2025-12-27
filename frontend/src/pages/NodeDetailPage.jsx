import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Stack, Box, Heading, Text } from '@chakra-ui/react';
import { fetchNodeById } from '../api/nodes.api';


export default function NodeDetailPage() {
    const { nodeId } = useParams();
    const [node, setNode] = useState(null);

    useEffect(() => {
        fetchNodeById(nodeId)
            .then((response) => {
                setNode(response.data)
            })
            .catch((error) => {
                console.error("Failed to fetch node:", error)
            })
    }, [nodeId])

    if (!node) {
        return (
            <Box p={6}>
                <Text>Loading node...</Text>
            </Box>
        )
    }


    return (
        <Box p={6}>
            <Heading mb={2}>Node {node.name}</Heading>
            <Text mb={4}>Node ID: {nodeId}</Text>
            <Text mb={4}>Location: {node.location}</Text>

            <Link to={`/nodes/${node.id}/zones/new`}>
                <Button colorScheme="teal" mb={4}>
                    Create new zone
                </Button>
            </Link>

            <Heading size="md" mb={2}>Zones</Heading>

            {node.zones.length === 0 && (
                <Text>Node has no zones defined.</Text>
            )}

            <Stack spacing={2}>
                {node.zones.map((zone) => (
                    <Box
                        key={zone.id}
                        p={3}
                        borderWidth="1px"
                        borderRadius="md"
                    >
                        <Link to={`/nodes/${node.id}/zones/${zone.id}`} style={{ textDecoration: 'underline', color: 'blue' }}>
                            {zone.name}
                        </Link>
                        <Text>Zone ID: {zone.id}</Text>
                        <Text>Relay pin: {zone.relay_pin}</Text>
                    </Box>
                ))}
            </Stack>
        </Box>
    )
}