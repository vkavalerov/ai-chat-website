import { Button, Text, Textarea, Stack, Box, Image } from "@mantine/core";
import { InferGetStaticPropsType } from "next";
import { useState } from "react";
import { Configuration, OpenAIApi } from "openai";

export default function Images(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  const [response, setResponse] = useState("");
  const [message, setMessage] = useState("");
  const [isAnswering, setIsAnswering] = useState(false);
  const [money, setMoney] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
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
          placeholder="Type your message here"
          disabled={isAnswering}
          label="Message"
          variant="filled"
          value={message}
          onChange={(e) => {
            setMessage(e.currentTarget.value);
          }}
        />
        <Button
          disabled={isAnswering}
          onClick={async () => {
            setIsAnswering(true);
            try {
              console.log(message);
              const response = await openai.createImage({
                prompt: message,
                n: 1,
                size: "1024x1024",
              });
              console.log(response);
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
          }}
        >
          Press this to AI😎
        </Button>
        <Text size="md" weight={700}>
          {response}
        </Text>
        <Image radius="md" src={imageUrl} width={1024} height={1024} />
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
