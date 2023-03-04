import {
  Button,
  Text,
  Textarea,
  Stack,
  Box,
  Image,
  Center,
  TextInput,
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
      <Box
        sx={{
          height: "50px",
          width: "100%",
        }}
      ></Box>
      <Text size="xl" weight={800} align="center">
        Image Generator (version 0.0.1)
      </Text>
      <Box
        sx={{
          height: "50px",
          width: "100%",
        }}
      ></Box>
      <Text size="lg" weight={300} align="center">
        Total money spend:{money / 100}$
      </Text>
      <Stack justify="space-around" spacing="xl" align="center">
        <Textarea
          sx={{
            width: "80%",
          }}
          placeholder="Type your prompt here"
          disabled={isAnswering}
          label="Image prompt"
          variant="filled"
          value={message}
          onChange={(e) => {
            setMessage(e.currentTarget.value);
          }}
        />
        <TextInput
          sx={{
            width: "80%",
          }}
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
          disabled={isAnswering}
          onClick={async () => {
            if (password === props.imagePassword) {
              setIsAnswering(true);
              try {
                console.log(message);
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
                console.log(e);
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
          Generate Image
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
        <Button
          onClick={() => {
            router.push("/");
          }}
        >
          Go to Home Page
        </Button>
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
