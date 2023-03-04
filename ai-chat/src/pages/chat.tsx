import {
  Button,
  Text,
  TextInput,
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
  const configuration = new Configuration({
    apiKey: props.openaiApiKey,
  });
  const openai = new OpenAIApi(configuration);

  return (
    <>
      <Box
        sx={{
          height: "50px",
          width: "100%",
        }}
      ></Box>
      <Text size="xl" weight={800} align="center">
        Chat with AI (version 0.0.3)
      </Text>
      <Box
        sx={{
          height: "30px",
          width: "100%",
        }}
      ></Box>
      <Text size="lg" weight={300} align="center">
        Temperature
      </Text>
      <Text
        size="sm"
        weight={200}
        align="center"
        sx={{
          margin: "auto",
          width: "40%",
        }}
      >
        Controls randomness: Lowering results in less random completions. As the
        temperature approaches zero, the model will become deterministic and
        repetitive.
      </Text>
      <Slider
        value={temperature}
        disabled={isAnswering}
        onChange={(value) => {
          setTemperature(value);
        }}
        sx={{
          width: "50%",
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
      <Text
        size="lg"
        weight={300}
        align="center"
        sx={{
          marginBottom: "30px",
        }}
      >
        Total tokens used: {usedTokens}, {(usedTokens / 1000) * 0.002}$
      </Text>
      <Stack
        justify="space-around"
        spacing="xl"
        sx={{
          width: "100%",
        }}
      >
        {messages.map((message, index) => {
          if (message.role === "system") {
            return (
              <Message title="What do you want me to be?" type="system">
                <TextInput
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
                title={message.role === "user" ? "You" : "AI"}
                type={message.role}
                text={message.content}
              />
            );
          }
        })}
        <Message title="You" type="user">
          <TextInput
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
          sx={{
            width: "250px",
            height: "50px",
            margin: "auto",
          }}
          radius="md"
          disabled={isAnswering}
          onClick={async () => {
            setIsAnswering(true);
            try {
              console.log(messages);
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
              console.log(response);
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
              console.log(e);
              setIsAnswering(false);
              setMessage("");
            }
          }}
        >
          Press this to AI😎
        </Button>
        <Button
          sx={{
            width: "160px",
            marginLeft: "auto",
            marginRight: "auto",
            marginBottom: "50px",
          }}
          radius="md"
          variant="outline"
          onClick={() => {
            router.push("/");
          }}
        >
          Go to Home Page
        </Button>
      </Stack>
    </>
  );
}

export async function getStaticProps() {
  return {
    props: {
      openaiApiKey: process.env.OPENAI_API_KEY,
    },
  };
}
