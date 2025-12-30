import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button, Stack, Box, Heading, Text } from '@chakra-ui/react'
import { fetchZoneById, deleteZone } from '../api/nodes.api'


function JsonBlock({ title, data }) {
    return (
        <Box mt={4}>
            <Heading size="sm" mb={2}>{title}</Heading>
            <Box
                as="pre"
                p={3}
                bg="gray.50"
                borderRadius="md"
                fontSize="sm"
                overflowX="auto"
                textAlign="left"
            >
                {JSON.stringify(data, null, 2)}
            </Box>
        </Box>
    )
}


export default function ZoneDetailPage() {
    const { nodeId, zoneId } = useParams();
    const [zone, setZone] = useState(null);

    useEffect(() => {
        fetchZoneById(nodeId, zoneId)
            .then((response) => {
                setZone(response.data)
            })
            .catch((error) => {
                console.error('Failed to fetch zone:', error)
            })
    }, [zoneId])

    if (!zone) {
        return (
            <Box p={4} >
                <Text>Loading zone details...</Text>
            </Box>
        )
    }

    return (
        <Box p={4}>
            <Heading>Zone {zone.id} Detail</Heading>
            <Heading size="md" mt={4}>Basic Info</Heading>
            <Text><strong>Name:</strong> {zone.name}</Text>
            <Text><strong>ID:</strong> {zone.id}</Text>
            <Text><strong>Relay Pin:</strong> {zone.relay_pin}</Text>
            <Text><strong>Irrigation Mode:</strong> {zone.irrigation_mode}</Text>

            <Button
                colorPalette="red"
                mb={4}
                onClick={() => {
                    if (!confirm('Are you sure you want to delete this zone?')) return

                    deleteZone(nodeId, zoneId)
                        .then(() => {
                            alert('Zone deleted successfully')
                            window.location.href = `/nodes/${nodeId}`
                        })
                        .catch((error) => {
                            console.error('Failed to delete zone:', error)
                            alert('Failed to delete zone')
                        })

                }}
            >
                Delete zone
            </Button>

            <JsonBlock title="Irrigation Configuration" data={zone.irrigation_configuration} />

            <JsonBlock title="Emitters Configuration" data={zone.emitters_configuration} />

            <JsonBlock title="Frequency Settings" data={zone.frequency_settings} />

            <JsonBlock title="Fallback Strategy" data={zone.fallback_strategy} />
        </Box>
    )
}