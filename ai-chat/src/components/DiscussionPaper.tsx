import { Paper, Text, Button, Group, ActionIcon } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

interface DiscussionProps {
  title: string;
  id: number;
  created_at: string;
}

export default function DiscussionPaper(props: DiscussionProps) {
  const router = useRouter();
  const supabaseClient = useSupabaseClient();
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
        <Group position="left">
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
          <ActionIcon
            sx={{
              width: "30px",
              height: "30px",
            }}
            size="md"
            radius="md"
            variant="filled"
            color="red"
            onClick={() => {
              supabaseClient
                .from("discussions")
                .delete()
                .eq("id", props.id)
                .then((res) => {
                  if (res.error) throw res.error;
                  router.reload();
                });
            }}
          >
            <IconTrash />
          </ActionIcon>
        </Group>
        <Text size="md" weight={300}>
          Created at {props.created_at}
        </Text>
      </Group>
    </Paper>
  );
}
