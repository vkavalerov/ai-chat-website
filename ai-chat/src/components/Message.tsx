import { Container, Paper, Text } from "@mantine/core";

interface MessageProps {
  title: string;
  text?: string;
  children?: React.ReactNode;
  isAnswer: boolean;
}
export default function Message(props: MessageProps) {
  return (
    <Paper
      shadow="xl"
      p="md"
      radius="md"
      sx={
        props.isAnswer
          ? {
              backgroundColor: "#e6f7ff",
              width: "50%",
              marginRight: "auto",
              marginLeft: "20%",
            }
          : {
              backgroundColor: "#f0f0f0",
              width: "50%",
              marginLeft: "auto",
              marginRight: "20%",
            }
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
