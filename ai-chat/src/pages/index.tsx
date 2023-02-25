import { Text } from "@mantine/core";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.push("/chat");
  }, []);
  return (
    <Text size="xl" weight={700}>
      index page
    </Text>
  );
}
