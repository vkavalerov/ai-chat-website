import {
  AppShell,
  Navbar,
  Header,
  Text,
  MediaQuery,
  Center,
  Footer,
  Burger,
  Group,
  Stack,
  Button,
} from "@mantine/core";
import Head from "next/head";
import { useMantineTheme } from "@mantine/core";
import { useEffect, useState } from "react";
import {
  IconMessageCircle,
  IconPhoto,
  IconInfoCircle,
} from "@tabler/icons-react";
import { useRouter } from "next/router";
import { useUser } from "@supabase/auth-helpers-react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

interface AiAppLayoutProps {
  children: React.ReactNode;
  title?: string;
  guest?: boolean;
}

export default function AiAppLayout(props: AiAppLayoutProps) {
  const user = useUser();
  useEffect(() => {
    if (!props.guest) {
      if (!user) {
        router.push("/");
      }
    }
  });
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const router = useRouter();
  const today = new Date();
  return (
    <>
      <Head>
        <title>{props.title || "AI Playground"}</title>
      </Head>
      <AppShell
        styles={{
          main: {
            background:
              theme.colorScheme === "dark"
                ? theme.colors.dark[8]
                : theme.colors.gray[0],
          },
        }}
        navbarOffsetBreakpoint="sm"
        asideOffsetBreakpoint="sm"
        navbar={
          <Navbar
            p="md"
            hiddenBreakpoint="sm"
            hidden={!opened}
            width={{ sm: 200, lg: 300 }}
          >
            <Navbar.Section grow>
              <Stack spacing="md">
                <Button
                  leftIcon={
                    <IconMessageCircle
                      style={{
                        color: router.pathname === "/chat" ? "#58B5CC" : "#000",
                      }}
                    />
                  }
                  size="md"
                  radius="md"
                  variant="default"
                  onClick={() => {
                    setOpened(false);
                    router.push("/chat");
                  }}
                >
                  <Text
                    sx={{
                      color: router.pathname === "/chat" ? "#58B5CC" : "#000",
                    }}
                  >
                    Chat
                  </Text>
                </Button>
                <Button
                  leftIcon={
                    <IconMessageCircle
                      style={{
                        color:
                          router.pathname === "/discussions"
                            ? "#58B5CC"
                            : "#000",
                      }}
                    />
                  }
                  size="md"
                  radius="md"
                  variant="default"
                  onClick={() => {
                    setOpened(false);
                    router.push("/discussions");
                  }}
                >
                  <Text
                    sx={{
                      color:
                        router.pathname === "/discussions" ? "#58B5CC" : "#000",
                    }}
                  >
                    Discussions
                  </Text>
                </Button>
                <Button
                  leftIcon={
                    <IconPhoto
                      style={{
                        color:
                          router.pathname === "/images" ? "#58B5CC" : "#000",
                      }}
                    />
                  }
                  size="md"
                  radius="md"
                  variant="default"
                  onClick={() => {
                    setOpened(false);
                    router.push("/images");
                  }}
                >
                  <Text
                    sx={{
                      color: router.pathname === "/images" ? "#58B5CC" : "#000",
                    }}
                  >
                    Images
                  </Text>
                </Button>
                <Button
                  leftIcon={
                    <IconInfoCircle
                      style={{
                        color:
                          router.pathname === "/about" ? "#58B5CC" : "#000",
                      }}
                    />
                  }
                  size="md"
                  radius="md"
                  variant="default"
                  onClick={() => {
                    setOpened(false);
                    router.push("/about");
                  }}
                >
                  <Text
                    sx={{
                      color: router.pathname === "/about" ? "#58B5CC" : "#000",
                    }}
                  >
                    About
                  </Text>
                </Button>
              </Stack>
            </Navbar.Section>
            <Navbar.Section>
              <Button
                sx={{
                  width: "100%",
                }}
                size="md"
                radius="md"
                variant="default"
                onClick={() => {
                  setOpened(false);
                  router.push("/account");
                }}
              >
                <Text
                  sx={{
                    color: router.pathname === "/account" ? "#58B5CC" : "#000",
                  }}
                >
                  Your Account
                </Text>
              </Button>
            </Navbar.Section>
          </Navbar>
        }
        footer={
          <Footer height={60} p="md">
            <Center>
              <Text>Vladimir Kavalerov {today.getFullYear()} &copy;</Text>
            </Center>
          </Footer>
        }
        header={
          <Header height={60}>
            <Group sx={{ height: "100%" }} px={30}>
              <MediaQuery largerThan="sm" styles={{ display: "none" }}>
                <Burger
                  opened={opened}
                  onClick={() => setOpened((o) => !o)}
                  size="sm"
                  color={theme.colors.gray[6]}
                  mr="xl"
                />
              </MediaQuery>
              <Group spacing="xs">
                <Text size="xl">AI Playground</Text>
                {props.title ? (
                  <Text size="xl" color={"dimmed"}>
                    /
                  </Text>
                ) : null}
                <Text size="xl">{props.title}</Text>
              </Group>
            </Group>
          </Header>
        }
      >
        {props.children}
      </AppShell>
    </>
  );
}
