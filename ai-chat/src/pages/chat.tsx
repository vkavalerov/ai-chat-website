import {
  Button,
  Text,
  Textarea,
  Container,
  Stack,
  Center,
  Box,
  Slider,
} from "@mantine/core";
import { InferGetStaticPropsType } from "next";
import { useState } from "react";
import { Configuration, OpenAIApi } from "openai";

export default function Chat(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  const [response, setResponse] = useState("");
  const [message, setMessage] = useState("Human: ");
  const [temperature, setTemperature] = useState(50);
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
        Chat with AI (version 0.0.2)
      </Text>
      <Box
        sx={{
          height: "30px",
          width: "100%",
        }}
      ></Box>
      <Text size="md" weight={300} align="center">
        Temperature
      </Text>
      <Slider
        value={temperature}
        onChange={(value) => {
          setTemperature(value);
        }}
        sx={{
          width: "40%",
          margin: "auto",
        }}
        radius="md"
        marks={[
          { value: 20, label: "20%" },
          { value: 50, label: "50%" },
          { value: 80, label: "80%" },
        ]}
      />
      <Box
        sx={{
          height: "30px",
          width: "100%",
        }}
      ></Box>
      <Stack justify="space-around" spacing="xl" align="center">
        <Textarea
          sx={{
            width: "40%",
          }}
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
            aiResponse(message, openai, temperature).then((res) => {
              setMessage(
                message + "\nAI: " + res.replaceAll("\n", " ") + "\nHuman: "
              );
            });
          }}
        >
          Press this to AI😎
        </Button>
        <Text size="md" weight={700}>
          {response}
        </Text>
      </Stack>
    </>
  );
}

async function aiResponse(
  message: string,
  openai: OpenAIApi,
  temperature: number
): Promise<string> {
  try {
    console.log(message);
    const response = await openai.createCompletion({
      model: "text-ada-001",
      prompt: message,
      temperature: temperature / 100,
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
