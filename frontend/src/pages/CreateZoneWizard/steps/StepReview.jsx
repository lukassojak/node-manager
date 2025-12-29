import { Box, Text } from "@chakra-ui/react"


export default function StepReview({ data }) {
    return (
        <Box
            as="pre"
            p={4}
            bg="gray.50"
            borderRadius="md"
            fontSize="sm"
            overflowX="auto"
            textAlign="left"
        >
            {JSON.stringify(data, null, 2)}
        </Box>
    )
}