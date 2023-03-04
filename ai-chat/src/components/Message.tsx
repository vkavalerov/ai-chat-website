import { Container, Paper, Text } from "@mantine/core";

interface MessageProps {
  title: string;
  text?: string;
  children?: React.ReactNode;
  type: string;
}
export default function Message(props: MessageProps) {
  return (
    <Paper
      shadow="xl"
      p="md"
      radius="md"
      withBorder
      sx={
        props.type === "assistant"
          ? {
              backgroundColor: "#e6f7ff",
              width: "320px",
              marginRight: "auto",
              marginLeft: "5%",
            }
          : props.type === "user"
          ? {
              width: "280px",
              textAlign: "right",
              marginLeft: "auto",
              marginRight: "5%",
            }
          : props.type === "system"
          ? {
              // make background color of green
              backgroundColor: "#f0f0f0",
              width: "340px",
              marginLeft: "auto",
              marginRight: "auto",
              marginBottom: "10px",
            }
          : {}
      }
    >
      <Container>
        <Text size="lg" weight={800}>
          {props.title}
        </Text>
        <Text size="sm" weight={400}>
          {props.text}
        </Text>
        {props.children}
      </Container>
    </Paper>
  );
}
