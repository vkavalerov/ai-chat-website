import { Button, Stack, Text } from "@mantine/core";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  return (
    <>
      <Stack
        justify="center"
        spacing="xl"
        align="center"
        sx={{
          height: "100vh",
        }}
      >
        <Text size="xl" weight={700}>
          Hi, You are on my AI Playground Website!
        </Text>
        <Text size="xl" weight={700}>
          Have fun 😊
        </Text>
        <Button
          size="md"
          sx={{
            width: "150px",
          }}
          onClick={() => router.push("/chat")}
        >
          Chat with AI
        </Button>
        <Button
          size="md"
          sx={{
            width: "150px",
          }}
          onClick={() => router.push("/images")}
        >
          Images
        </Button>
      </Stack>
    </>
  );
}
