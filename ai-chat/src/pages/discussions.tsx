import { Button, Paper, Stack } from "@mantine/core";
import { useRouter } from "next/router";
import AiAppLayout from "../components/AiAppLayout";
import DiscussionPaper from "../components/DiscussionPaper";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { Key, useEffect, useState } from "react";

interface DiscussionProps {
  id: number;
  title: string;
  created_at: string;
}

export default function Discussions() {
  const router = useRouter();
  const supabaseClient = useSupabaseClient();
  const user = useUser();
  const [discussions, setDiscussions] = useState<DiscussionProps[]>();
  useEffect(() => {
    if (user) {
      const fetchdiscussions = async (): Promise<DiscussionProps[]> => {
        const loadedDiscussions = await supabaseClient
          .from("discussions")
          .select("*")
          .eq("user_id", user!.id)
          .order("created_at", { ascending: false });
        if (loadedDiscussions.error) throw loadedDiscussions.error;
        const discussions = [];
        for (const discussion of loadedDiscussions.data) {
          discussions.push({
            id: discussion.id,
            title: discussion.discussion.data[1].content,
            created_at: discussion.created_at_simple,
          });
        }
        return discussions;
      };
      fetchdiscussions().then((discussions) => {
        setDiscussions(discussions);
      });
    }
  }, [supabaseClient]);
  return (
    <AiAppLayout title="Discussions">
      <Stack
        justify="center"
        spacing="xs"
        align="center"
        sx={{
          height: "100%",
          margin: "auto",
          width: "100%",
          maxWidth: "700px",
        }}
      >
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
            });
          }}
        >
          New Discussion
        </Button>
        {discussions?.map((discussion) => (
          <DiscussionPaper
            key={discussion.id}
            id={discussion.id}
            title={discussion.title}
            created_at={discussion.created_at}
          />
        ))}
      </Stack>
    </AiAppLayout>
  );
}
