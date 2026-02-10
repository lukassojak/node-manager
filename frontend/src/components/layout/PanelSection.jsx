import { Box, Heading, Text, Stack } from "@chakra-ui/react"

export default function PanelSection({
    title,
    description,
    children,
}) {
    return (
        <Box
            bg="bg.panel"
            borderWidth="1px"
            borderColor="border"
            borderRadius="md"
            p={4}
            textAlign="left"
        >
            {(title || description) && (
                <Stack mb={4}>
                    {title && (
                        <Heading size="sm" color="teal.600">
                            {title}
                        </Heading>
                    )}

                    {description && (
                        <Text fontSize="sm" color="fg.muted">
                            {description}
                        </Text>
                    )}
                </Stack>
            )}

            {children}
        </Box>
    )
}
