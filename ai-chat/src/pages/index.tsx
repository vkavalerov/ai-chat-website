import { Button, Title, Text, Container } from "@mantine/core";
import { useRouter } from "next/router";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { InferGetStaticPropsType } from "next";
import AiAppLayout from "@/components/AiAppLayout";

export default function Home({
  basePath,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const supabaseClient = useSupabaseClient();
  const user = useUser();
  const router = useRouter();
  if (!user) {
    return (
      <Container
        size={420}
        my={100}
        sx={{
          margin: "auto",
          width: "100%",
          height: "100%",
        }}
      >
        <Title size="xl" weight={700} align="center">
          Hi, You are on my AI Playground Website!
        </Title>
        <Auth
          supabaseClient={supabaseClient}
          redirectTo={basePath}
          appearance={{ theme: ThemeSupa }}
          providers={["google"]}
        />
      </Container>
    );
  } else {
    router.push("/account");
  }
}

export async function getStaticProps() {
  var basePath = "";
  if (process.env.CF_PAGES_URL !== undefined) {
    basePath = process.env.CF_PAGES_URL;
  } else {
    console.log("No CF_PAGES_URL found");
  }
  return {
    props: { basePath: basePath }, // will be passed to the page component as props
  };
  // ...
}
