import { useEffect, useState } from 'react'
import { Button, Heading, Box, Text, Stack } from '@chakra-ui/react'
import { fetchNodes } from '../api/nodes.api'
import { Link } from 'react-router-dom'



export default function DashboardPage() {
    const [nodes, setNodes] = useState([])

    useEffect(() => {
        fetchNodes()
            .then((response) => {
                setNodes(response.data)
            })
            .catch((error) => {
                console.error("Error fetching nodes:", error)
            })
    }, [])

    return (
        <Box p={6}>
            <Heading mb={4}>Node Manager Dashboard</Heading>

            <Link to="/nodes/new">
                <Button colorScheme="teal" mb={4}>
                    Create new node
                </Button>
            </Link>

            {nodes.length === 0 && (
                <Text>No nodes found.</Text>
            )}

            <Stack spacing={3}>
                {nodes.map((node) => (
                    <Box key={node.id} p={4} borderWidth="1px" borderRadius="md">
                        <Text fontWeight="bold">
                            <Link to={`/nodes/${node.id}`} style={{ textDecoration: 'underline', color: 'blue' }}>
                                {node.name}
                            </Link>
                        </Text>
                        {node.location && <Text>Location: {node.location}</Text>}
                    </Box>
                ))}
            </Stack>
        </Box>
    )
}