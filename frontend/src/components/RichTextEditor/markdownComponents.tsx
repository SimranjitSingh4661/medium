import React from "react";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";
import { cn } from "@/lib/utils";

export const markdownClasses = {
  h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl [&:not(:first-child)]:mt-2",
  h2: "scroll-m-20 text-3xl font-semibold tracking-tight [&:not(:first-child)]:mt-2",
  h3: "scroll-m-20 text-2xl font-semibold tracking-tight [&:not(:first-child)]:mt-2",
  h4: "scroll-m-20 text-xl font-semibold tracking-tight [&:not(:first-child)]:mt-2",
  h5: "scroll-m-20 text-lg font-semibold tracking-tight [&:not(:first-child)]:mt-2",
  p: "[&:not(:first-child)]:mt-2 leading-1 text-sm",
  ul: "my-1 ml-6 text-sm list-disc [&:not(:first-child)]:mt-2 text-muted-foreground [&>li>strong]:text-white/90 [&>li>strong]:font-medium",
  ol: "my-1 ml-6 text-sm list-decimal text-muted-foreground [&>li>strong]:text-white/90 [&>li>strong]:font-medium",
  // code: "mt-4 relative rounded-md bg-muted p-2 font-mono text-sm font-semibold inline-block",
  a: "text-blue-500 hover:underline underline-offset-2",
  img: "my-2 rounded-md aspect-video",
  blockquote:
    "mt-2 pl-4 border-l-4 border-blue-500 py-2 bg-blue-500/10 text-blue-500 rounded-md rounded-l-none",
};

export const markdownComponents = {
  ...Object.fromEntries(
    Object.entries(markdownClasses).map((v) => [
      v[0],
      {
        props: { className: v[1] },
      },
    ])
  ),
  code: {
    component: CodeBlock,
  },
};

function CodeBlock(props: { children: string; className: string }) {
  const ref = React.useRef<HTMLPreElement>(null);

  React.useEffect(() => {
    if (ref.current) {
      // Highlight the code
      try {
        hljs.highlightAll();
      } catch (e) {
        console.error(e);
      }
      // Remove the data-highlighted attribute if it exists to rehighlight the code on change of content else it wont rehighlight
      if (ref.current.hasAttribute("data-highlighted")) {
        ref.current.removeAttribute("data-highlighted");
      }
    }
  }, [props.className]);

  return (
    <pre className="bg-accent relative mt-4 inline-block w-fit rounded-md p-2 text-sm">
      <code ref={ref} className={cn(props.className, "!bg-transparent !p-0")}>
        {props.children}
      </code>
    </pre>
  );
}
