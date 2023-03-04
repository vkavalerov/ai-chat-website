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
      sx={
        props.type === "assistant"
          ? {
              backgroundColor: "#e6f7ff",
              width: "50%",
              marginRight: "auto",
              marginLeft: "20%",
            }
          : props.type === "user"
          ? {
              width: "50%",
              textAlign: "right",
              marginLeft: "auto",
              marginRight: "20%",
            }
          : props.type === "system"
          ? {
              // make background color of green
              backgroundColor: "#f0f0f0",
              width: "50%",
              marginLeft: "auto",
              marginRight: "auto",
              marginBottom: "10px",
            }
          : {}
      }
    >
      <Container>
        <Text size="xl" weight={800}>
          {props.title}
        </Text>
        <Text>{props.text}</Text>
        {props.children}
      </Container>
    </Paper>
  );
}
