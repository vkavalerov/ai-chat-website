import { Text } from "@mantine/core";
import { InferGetStaticPropsType } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Home({
  basePath,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter();
  console.log("basePath: " + basePath);
  return (
    <Text size="xl" weight={700}>
      index page
    </Text>
  );
}

export async function getStaticProps() {
  var basePath = "";
  if (process.env.CF_PAGES_URL !== undefined) {
    basePath = process.env.CF_PAGES_URL;
  } else {
    console.log("No CF_PAGES_URL found");
  }
  return {
    props: { basePath: basePath }, // will be passed to the page component as props
  };
  // ...
}
