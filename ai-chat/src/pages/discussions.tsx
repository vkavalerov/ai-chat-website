import { Stack } from "@mantine/core";
import { useRouter } from "next/router";
import AiAppLayout from "../components/AiAppLayout";
import DiscussionPaper from "../components/DiscussionPaper";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { Key, useEffect, useState } from "react";

interface DiscussionProps {
  id: number;
  title: string;
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
          .eq("user_id", user!.id);
        if (loadedDiscussions.error) throw loadedDiscussions.error;
        const discussions = [];
        for (const discussion of loadedDiscussions.data) {
          discussions.push({
            id: discussion.id,
            title: discussion.discussion.data[1].content,
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
        spacing="xl"
        align="center"
        sx={{
          height: "100%",
          margin: "auto",
          width: "100%",
          maxWidth: "700px",
        }}
      >
        {discussions?.map((discussion) => (
          <DiscussionPaper
            key={discussion.id}
            id={discussion.id}
            title={discussion.title}
          />
        ))}
      </Stack>
    </AiAppLayout>
  );
}
