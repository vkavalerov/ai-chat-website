import {
  Button,
  Text,
  TextInput,
  Textarea,
  Stack,
  Box,
  Slider,
  Container,
} from "@mantine/core";
import { InferGetStaticPropsType } from "next";
import { useState } from "react";
import { useRouter } from "next/router";
import { Configuration, OpenAIApi, ChatCompletionRequestMessage } from "openai";
import Message from "../components/Message";
import AiAppLayout from "@/components/AiAppLayout";

export default function Chat(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([
    { role: "system", content: "You are a helpful assistant." },
  ]);
  const [temperature, setTemperature] = useState(70);
  const [isAnswering, setIsAnswering] = useState(false);
  const [usedTokens, setUsedTokens] = useState(0);
  let key = 0;
  const configuration = new Configuration({
    apiKey: props.openaiApiKey,
  });
  const openai = new OpenAIApi(configuration);

  return (
    <AiAppLayout title="Chat">
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
          weight={400}
          align="center"
          sx={{
            marginBottom: "10px",
          }}
        >
          Total tokens used: {usedTokens}, {(usedTokens / 1000) * 0.002}$
        </Text>
        <Text size="lg" weight={300} align="center">
          Temperature
        </Text>
        <Text
          size="sm"
          weight={200}
          align="center"
          sx={{
            margin: "auto",
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
            margin: "auto",
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
                  value={message.content}
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
                text={message.content}
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
              const response = await openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: [
                  ...messages,
                  {
                    role: "user",
                    content: message,
                  },
                ],
              });
              if (response.data.choices[0]) {
                setUsedTokens(usedTokens + response.data.usage!.total_tokens);
                setMessages([
                  ...messages,
                  {
                    role: "user",
                    content: message,
                  },
                  {
                    role: "assistant",
                    content: response.data.choices[0].message!.content,
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
          Answer me!🤓
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
