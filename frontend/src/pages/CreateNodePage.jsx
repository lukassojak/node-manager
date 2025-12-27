import { useState } from 'react'
import { useNavigate } from "react-router-dom"
import { Box, Heading, Input, Button, Stack } from "@chakra-ui/react"
import { createNode } from "../api/nodes.api"


export default function CreateNodePage() {
    const navigate = useNavigate()
    const [name, setName] = useState("")
    const [location, setLocation] = useState("")

    const handleSubmit = () => {
        const payload = {
            name,
            location,
            hardware: {
                input_pins: { pins: [] },
                output_pins: { pins: [] },
            },
            irrigation_limits: {
                min_percent: 30,
                max_percent: 200,
                main_valve_max_flow: null,
            },
            automation: {
                enabled: true,
                scheduled_hour: 6,
                scheduled_minute: 0,
                weather_cache_interval_minutes: 30,
                weather_cache_expiry_hours: 2,
            },
            batch_strategy: {
                concurrent_irrigation: false,
                flow_control: true,
                max_concurrent_zones: null,
                max_total_irrigation_time_minutes: null,
            },
            logging: {
                enabled: true,
                log_level: "DEBUG",
            },
        }

        createNode(payload)
            .then((response) => {
                navigate(`/nodes/${response.data.id}`)
            })
            .catch((error) => {
                console.error("Failed to create node", error)
            })
    }

    return (
        <Box p={6}>
            <Heading mb={4}>Create Node</Heading>

            <Stack spacing={3}>
                <Input
                    placeholder="Node name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <Input
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                />

                <Button
                    colorScheme="teal"
                    onClick={handleSubmit}
                    isDisabled={!name.trim()}
                >
                    Create
                </Button>
            </Stack>
        </Box>
    )

}

