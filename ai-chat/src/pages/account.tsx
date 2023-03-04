import { Button, Stack, Text } from "@mantine/core";
import { useRouter } from "next/router";
import AiAppLayout from "@/components/AiAppLayout";

export default function Account() {
  const router = useRouter();
  return (
    <AiAppLayout title="Account">
      <Stack
        justify="center"
        spacing="xl"
        align="center"
        sx={{
          height: "100%",
        }}
      >
        <Text size="xl" weight={700}>
          There will be account management here...
        </Text>
        <Text size="xl" weight={500}>
          Still in progress...
        </Text>
      </Stack>
    </AiAppLayout>
  );
}
