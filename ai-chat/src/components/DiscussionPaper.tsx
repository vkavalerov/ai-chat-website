import { Paper, Text, Button, Group } from "@mantine/core";
import { useRouter } from "next/router";

interface DiscussionProps {
  title: string;
  id: number;
  created_at: string;
}

export default function DiscussionPaper(props: DiscussionProps) {
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
      <Text size="lg" weight={300} truncate>
        {props.title}
      </Text>
      <Group position="apart">
        <Button
          size="md"
          sx={{
            width: "100px",
            height: "30px",
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
        <Text size="md" weight={300}>
          Created at {props.created_at}
        </Text>
      </Group>
    </Paper>
  );
}
