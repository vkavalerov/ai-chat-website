import { Button, Text, Textarea, Container } from "@mantine/core";
import { InferGetStaticPropsType } from "next";
import { useState } from "react";
import { useRouter } from "next/router";
import { Configuration, OpenAIApi } from "openai";

export default function Chat(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  const [response, setResponse] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const configuration = new Configuration({
    apiKey: props.openaiApiKey,
  });
  const openai = new OpenAIApi(configuration);

  return (
    <>
      <Container size="xs">
        <Textarea
          placeholder="Type your message here"
          label="Message"
          onChange={(e) => {
            setMessage(e.currentTarget.value);
          }}
        />
        <Button
          onClick={() => {
            aiResponse(message, openai).then((res) => {
              setResponse(res);
            });
          }}
        >
          pls answer
        </Button>
        <Text size="xl" weight={700}>
          {response}
        </Text>
      </Container>
    </>
  );
}

async function aiResponse(message: string, openai: OpenAIApi): Promise<string> {
  try {
    console.log(message);
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: message,
      temperature: 0.6,
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
