import { Paper, Text, Button } from "@mantine/core";
import { useRouter } from "next/router";

interface DiscussionProps {
  title: string;
  id: number;
}

export default function Discussion(props: DiscussionProps) {
  const router = useRouter();
  return (
    <Paper
      shadow="xl"
      p="md"
      radius="md"
      withBorder
      sx={{
        width: "90%",
      }}
    >
      <Text size="xl" weight={600}>
        {props.title}
      </Text>
      <Button
        size="lg"
        sx={{
          width: "250px",
          height: "50px",
        }}
        color="cyan"
        radius="md"
        onClick={() => {
          router.push({
            pathname: "/chat",
            query: { id: props.id },
          });
        }}
      >
        Open
      </Button>
    </Paper>
  );
}
