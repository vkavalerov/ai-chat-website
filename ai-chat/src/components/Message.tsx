import {
  Container,
  Paper,
  Text,
  TypographyStylesProvider,
  Code,
} from "@mantine/core";

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
              backgroundColor: "#def0f5",
              width: "90%",
              marginRight: "auto",
              marginLeft: "5%",
            }
          : props.type === "user"
          ? {
              width: "60%",
              marginLeft: "auto",
              marginRight: "5%",
            }
          : props.type === "system"
          ? {
              backgroundColor: "#def0f5",
              width: "340px",
              marginLeft: "auto",
              marginRight: "auto",
              marginBottom: "10px",
            }
          : {}
      }
    >
      <Container>
        <Text size="xl" weight={600}>
          {props.title}
        </Text>
        <Text
          size="sm"
          weight={300}
          sx={{
            wordBreak: "break-word",
            whiteSpace: "pre-wrap",
          }}
        >
          <TypographyStylesProvider>
            {props.text !== undefined
              ? highlightTextWithinTripleBackticks(props.text!)
              : ""}
          </TypographyStylesProvider>
        </Text>
        {props.children}
      </Container>
    </Paper>
  );
}

function highlightTextWithinTripleBackticks(input: string): React.ReactNode {
  const regex = /```(.+?)```|`(.+?)`/gs;
  const output = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(input)) !== null) {
    output.push(input.substring(lastIndex, match.index));

    if (match[1]) {
      output.push(<Code block>{match[1]}</Code>);
    } else {
      output.push(<Code>{match[2]}</Code>);
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < input.length) {
    output.push(input.substring(lastIndex));
  }

  return output;
}
