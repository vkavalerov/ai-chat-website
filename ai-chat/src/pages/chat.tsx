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
  const [message, setMessage] = useState("");
  const [temperature, setTemperature] = useState(50);
  const [isAnswering, setIsAnswering] = useState(false);
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
          disabled={isAnswering}
          label="Message"
          variant="filled"
          value={message}
          minRows={20}
          onChange={(e) => {
            setMessage(e.currentTarget.value);
          }}
        />
        <Button
          disabled={isAnswering}
          onClick={() => {
            setIsAnswering(true);
            aiResponse(message, openai, temperature).then((res) => {
              setMessage(message + "\n" + res.replaceAll("\n", "") + "\n");
              setIsAnswering(false);
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
      model: "text-curie-001",
      prompt: message,
      temperature: temperature / 100,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
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
