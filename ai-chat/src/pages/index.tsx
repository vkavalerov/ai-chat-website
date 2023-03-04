import { Button, Stack, Text } from "@mantine/core";
import { useRouter } from "next/router";
import AiAppLayout from "@/components/AiAppLayout";

export default function Home() {
  const router = useRouter();
  return (
    <AiAppLayout title="About">
      <Stack
        justify="center"
        spacing="xl"
        align="center"
        sx={{
          height: "100%",
        }}
      >
        <Text size="xl" weight={700}>
          Hi, You are on my AI Playground Website!
        </Text>
        <Text size="xl" weight={700}>
          Have fun 😊
        </Text>
      </Stack>
    </AiAppLayout>
  );
}
