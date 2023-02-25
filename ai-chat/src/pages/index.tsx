import { Button, Text } from "@mantine/core";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  return (
    <>
      <Text size="xl" weight={700}>
        Hi, you are on AI test page.
      </Text>
      <Button onClick={() => router.push("/chat")}>Chat with AI</Button>
      <Button onClick={() => router.push("/images")}>Images</Button>
    </>
  );
}
