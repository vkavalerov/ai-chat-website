import {
  Button,
  Text,
  Textarea,
  Container,
  Stack,
  Center,
  Box,
} from "@mantine/core";
import { InferGetStaticPropsType } from "next";
import { useState } from "react";
import { Configuration, OpenAIApi } from "openai";

export default function Chat(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  const [response, setResponse] = useState("");
  const [message, setMessage] = useState("Human: ");
  const configuration = new Configuration({
    apiKey: props.openaiApiKey,
  });
  const openai = new OpenAIApi(configuration);

  return (
    <>
      <Container size="md">
        <Stack
          sx={(theme) => ({
            justifyContent: "center",
          })}
        >
          <Text size="xl" weight={700} align="center">
            Chat with AI (version 0.0.1)
          </Text>
          <Textarea
            placeholder="Type your message here"
            label="Message"
            variant="filled"
            value={message}
            minRows={20}
            onChange={(e) => {
              setMessage(e.currentTarget.value);
            }}
          />
          <Button
            onClick={() => {
              aiResponse(message, openai).then((res) => {
                setMessage(message + "\n" + res + "\nHuman: ");
              });
            }}
          >
            pls answer
          </Button>
          <Text size="md" weight={700}>
            {response}
          </Text>
        </Stack>
      </Container>
    </>
  );
}

async function aiResponse(message: string, openai: OpenAIApi): Promise<string> {
  try {
    console.log(message);
    const response = await openai.createCompletion({
      model: "text-ada-001",
      prompt: message,
      temperature: 0.7,
      max_tokens: 1000,
      top_p: 1,
      frequency_penalty: 0.0,
      presence_penalty: 0.6,
      stop: [" Human:", " AI:"],
    });
    console.log(response);
    if (response.data.choices[0].text) {
      return response.data.choices[0].text;
    } else {
      return "Error: No response";
    }
  } catch (e) {
    console.log(e);
    return "Error: " + e;
  }
}

export async function getStaticProps() {
  return {
    props: {
      openaiApiKey: process.env.OPENAI_API_KEY,
    },
  };
}
