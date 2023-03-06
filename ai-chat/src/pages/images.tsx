import {
  Button,
  Text,
  Textarea,
  Stack,
  Box,
  Image,
  Center,
  PasswordInput,
} from "@mantine/core";
import { InferGetStaticPropsType } from "next";
import { useState } from "react";
import { useRouter } from "next/router";
import { Configuration, OpenAIApi } from "openai";
import AiAppLayout from "@/components/AiAppLayout";

export default function Images(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  const router = useRouter();
  const [response, setResponse] = useState("");
  const [message, setMessage] = useState("");
  const [isAnswering, setIsAnswering] = useState(false);
  const [money, setMoney] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const [password, setPassword] = useState("");
  const configuration = new Configuration({
    apiKey: props.openaiApiKey,
  });
  const openai = new OpenAIApi(configuration);

  return (
    <AiAppLayout title="Images">
      <Text size="xl" weight={400} align="center">
        Total money spend:{money / 100}$
      </Text>
      <Stack
        justify="space-around"
        spacing="lg"
        align="center"
        sx={{
          margin: "auto",
          width: "100%",
          maxWidth: "700px",
        }}
      >
        <Textarea
          sx={{
            width: "80%",
          }}
          radius="md"
          placeholder="Type your prompt here"
          disabled={isAnswering}
          label="Image prompt"
          variant="filled"
          value={message}
          onChange={(e) => {
            setMessage(e.currentTarget.value);
          }}
        />
        <PasswordInput
          sx={{
            width: "80%",
          }}
          radius="md"
          placeholder="Type password here"
          disabled={isAnswering}
          label="Password"
          variant="filled"
          value={password}
          onChange={(e) => {
            setPassword(e.currentTarget.value);
          }}
        />
        <Button
          size="lg"
          sx={{
            width: "250px",
            height: "50px",
            margin: "auto",
          }}
          color="cyan"
          radius="md"
          disabled={isAnswering}
          onClick={async () => {
            if (password === props.imagePassword) {
              setIsAnswering(true);
              try {
                const response = await openai.createImage({
                  prompt: message,
                  n: 1,
                  size: "1024x1024",
                });
                if (response.data.data[0].url) {
                  setImageUrl(response.data.data[0].url);
                  setMoney(money + 2);
                  setResponse("");
                  setIsAnswering(false);
                } else {
                  setResponse("Error");
                  setIsAnswering(false);
                }
              } catch (e) {
                setResponse("Error: " + e);
                setIsAnswering(false);
              }
            } else if (password === "") {
              setResponse("No password provided");
            } else {
              setResponse("Wrong password");
            }
          }}
        >
          Generate Image 🖼️
        </Button>
        <Text size="md" weight={700}>
          {response}
        </Text>
        <Center>
          <Image
            radius="md"
            src={imageUrl}
            width="100%"
            alt="With custom placeholder"
            withPlaceholder
            placeholder={
              <Text align="center">There will be generated Image</Text>
            }
          />
        </Center>
      </Stack>
    </AiAppLayout>
  );
}

export async function getStaticProps() {
  return {
    props: {
      openaiApiKey: process.env.OPENAI_API_KEY,
      imagePassword: process.env.IMAGE_PASSWORD,
    },
  };
}
