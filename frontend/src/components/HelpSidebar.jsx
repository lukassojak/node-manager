import { Stack, Box, Heading } from "@chakra-ui/react"

export default function HelpSidebar({
    title = "Need Help?",
    sticky = false,
    scrollRef,
    children,
}) {
    return (
        <Stack
            spacing={4}
            bg="bg.panel"
            borderWidth="1px"
            borderColor="bg.panel"
            borderRadius="md"
            p={4}
            h="fit-content"
            position={sticky ? "sticky" : "static"}
            top={sticky ? "24px" : undefined}
        >
            <Heading size="md" textAlign="left">
                {title}
            </Heading>

            <Box
                ref={scrollRef}
                maxH="calc(100vh - 160px)"
                overflowY="auto"
                pr={2}
            >
                <Stack spacing={6}>
                    {children}
                </Stack>
            </Box>
        </Stack>
    )
}
