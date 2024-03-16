import {
  Button,
  Text,
  TextInput,
  Textarea,
  Stack,
  Box,
  Slider,
  ActionIcon,
} from "@mantine/core";
import { InferGetStaticPropsType } from "next";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import OpenAI from "openai";
import { IconArrowNarrowLeft } from "@tabler/icons-react";
import Message from "../components/Message";
import AiAppLayout from "@/components/AiAppLayout";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { Database } from "../lib/database.types";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";

const PRICE_PER_1K_TOKENS = 0;

export default function Chat(
  props: InferGetStaticPropsType<typeof getStaticProps>,
) {
  const router = useRouter();
  const supabaseClient = useSupabaseClient<Database>();
  const [discussionId, setdiscussionId] = useState("");
  const [messages, setMessages] = useState<
    { role: string; content: string | null }[]
  >([{ role: "system", content: "You are a helpful assistant." }]);
  useEffect(() => {
    if (user && router.query.id) {
      setdiscussionId(router.query.id as string);
      const fetchMessages = async () => {
        const response = await supabaseClient
          .from("discussions")
          .select("*")
          .eq("id", router.query.id);
        if (response.error) throw response.error;
        const outputDiscussion = [];
        console.log(response.data[0].discussion.data);
        const discussions = response.data[0].discussion.data;
        for (const discussion of discussions) {
          outputDiscussion.push({
            role: discussion.role,
            content: discussion.content,
          });
        }
        return outputDiscussion;
      };
      fetchMessages().then((messages) => {
        setMessages(messages);
      });
    }
  }, [supabaseClient]);
  const [message, setMessage] = useState("");
  const [temperature, setTemperature] = useState(70);
  const [isAnswering, setIsAnswering] = useState(false);
  const [usedTokens, setUsedTokens] = useState(0);
  let key = 0;
  const openai = new OpenAI({
    apiKey: props.openaiApiKey,
    dangerouslyAllowBrowser: true,
  });
  const user = useUser();

  return (
    <AiAppLayout title="Chat">
      <ActionIcon
        size="lg"
        radius="md"
        variant="default"
        onClick={() => {
          router.push("/discussions");
        }}
      >
        <IconArrowNarrowLeft />
      </ActionIcon>
      <Stack
        spacing="xs"
        sx={{
          margin: "auto",
          width: "100%",
          maxWidth: "700px",
        }}
      >
        <Text
          size="xl"
          w={400}
          align="center"
          sx={{
            marginBottom: "10px",
          }}
        >
          Total tokens used: {usedTokens},{" "}
          {(usedTokens / 1000) * PRICE_PER_1K_TOKENS}$
        </Text>
        <Text size="lg" weight={300} align="center">
          Temperature
        </Text>
        <Text
          size="sm"
          weight={200}
          align="center"
          sx={{
            marginTop: "-15px",
            width: "100%",
          }}
        >
          Controls randomness: Lowering results in less random completions. As
          the temperature approaches zero, the model will become deterministic
          and repetitive.
        </Text>
        <Slider
          value={temperature}
          disabled={isAnswering}
          color="cyan"
          onChange={(value) => {
            setTemperature(value);
          }}
          sx={{
            width: "100%",
            marginTop: "-10px",
          }}
          radius="md"
          marks={[
            { value: 20, label: "20%" },
            { value: 40, label: "40%" },
            { value: 60, label: "60%" },
            { value: 80, label: "80%" },
          ]}
        />
        <Box
          sx={{
            height: "20px",
            width: "100%",
          }}
        ></Box>
      </Stack>
      <Stack
        justify="space-around"
        spacing="xl"
        sx={{
          margin: "auto",
          width: "100%",
          maxWidth: "700px",
        }}
      >
        {messages.map((message, index) => {
          if (message.role === "system") {
            return (
              <Message
                key={key++}
                title="What do you want me to be?"
                type="system"
              >
                <TextInput
                  color="cyan"
                  disabled={isAnswering}
                  value={message.content!}
                  onChange={(e) => {
                    const newMessages = [...messages];
                    newMessages[index].content = e.currentTarget.value;
                    setMessages(newMessages);
                  }}
                />
              </Message>
            );
          } else {
            return (
              <Message
                key={key++}
                title={message.role === "user" ? "You" : "AI"}
                type={message.role}
                text={message.content!}
              />
            );
          }
        })}
        <Message key={key++} title="You" type="user">
          <Textarea
            color="cyan"
            disabled={isAnswering}
            value={message}
            onChange={(e) => {
              setMessage(e.currentTarget.value);
            }}
            sx={{
              width: "100%",
            }}
            placeholder="Type your message here"
          />
        </Message>
        <Button
          size="lg"
          sx={{
            width: "250px",
            height: "50px",
            margin: "auto",
          }}
          color="cyan"
          radius="md"
          loading={isAnswering}
          onClick={async () => {
            setIsAnswering(true);
            try {
              const response = await openai.chat.completions.create({
                messages: [
                  ...(messages as ChatCompletionMessageParam[]),
                  {
                    role: "user",
                    content: message,
                  },
                ],
                model: "gpt-3.5-turbo",
              });
              console.log(response.usage!.total_tokens);
              if (response.choices[0]) {
                setUsedTokens(usedTokens + response.usage!.total_tokens);
                if (!discussionId) {
                  const supabaseResponse = await supabaseClient
                    .from("discussions")
                    .insert({
                      user_id: user!.id,
                      discussion: {
                        data: [
                          ...messages,
                          {
                            role: "user",
                            content: message,
                          },
                          {
                            role: "assistant",
                            content: response.choices[0].message!.content,
                          },
                        ],
                      },
                    })
                    .select("id");
                  if (supabaseResponse.error) {
                    throw new Error("Error while saving discussion");
                  }
                  setdiscussionId(supabaseResponse.data![0].id);
                } else {
                  const supabaseResponse = await supabaseClient
                    .from("discussions")
                    .update({
                      discussion: {
                        data: [
                          ...messages,
                          {
                            role: "user",
                            content: message,
                          },
                          {
                            role: "assistant",
                            content: response.choices[0].message!.content,
                          },
                        ],
                      },
                    })
                    .eq("id", discussionId);
                  if (supabaseResponse.error) {
                    throw new Error("Error while saving discussion");
                  }
                }

                setMessages([
                  ...messages,
                  {
                    role: "user",
                    content: message,
                  },
                  {
                    role: "assistant",
                    content: response.choices[0].message!.content,
                  },
                ]);
                setMessage("");
                setIsAnswering(false);
              } else {
                setIsAnswering(false);
                setMessage("");
              }
            } catch (e) {
              setIsAnswering(false);
              setMessage("");
            }
          }}
        >
          <Text weight="600">Answer me!🤔</Text>
        </Button>
      </Stack>
    </AiAppLayout>
  );
}

export async function getStaticProps() {
  return {
    props: {
      openaiApiKey: process.env.OPENAI_API_KEY,
    },
  };
}
