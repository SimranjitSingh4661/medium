import { RefObject } from "react";
import { Button } from "../ui/button";
import {
  BoldIcon,
  CodeIcon,
  ImagePlusIcon,
  ItalicIcon,
  LinkIcon,
  ListIcon,
  ListOrderedIcon,
  QuoteIcon,
  StrikethroughIcon,
} from "lucide-react";

export function FormattingOptions({
  textareaRef,
  children,
}: {
  textareaRef: RefObject<HTMLTextAreaElement>;
  children?: React.ReactNode;
}) {
  const handleClick = (chars: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // console.log(textarea.selectionEnd);
    const selectionStart = textarea.selectionStart;
    const selectionEnd = textarea.selectionEnd + chars.length;

    // eslint-disable-next-line @typescript-eslint/unbound-method
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLTextAreaElement.prototype,
      "value",
    )?.set;

    if (!nativeInputValueSetter) return;

    const beforeStart = textarea.value.slice(0, textarea.selectionStart);
    const afterStart = textarea.value.slice(textarea.selectionStart);

    nativeInputValueSetter.call(
      textarea,
      `${beforeStart}${chars}${afterStart}`,
    );

    const beforeEnd = textarea.value.slice(0, selectionEnd);
    const afterEnd = textarea.value.slice(selectionEnd);
    // console.log(beforeEnd, afterEnd);

    nativeInputValueSetter.call(textarea, `${beforeEnd}${chars}${afterEnd}`);

    textarea.setSelectionRange(
      selectionStart + chars.length,
      selectionEnd,
    );

    textarea.dispatchEvent(new Event("change", { bubbles: true }));
    textarea.focus()
  };

  const handleAddText = (text: string, selectedText = '', eText = '') => {
    // Add text a single time only
    const textarea = textareaRef.current;
    if (!textarea) return;

    const selectionStart = textarea.selectionStart;
    const selectionEnd = textarea.selectionEnd;

    // eslint-disable-next-line @typescript-eslint/unbound-method
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLTextAreaElement.prototype,
      "value",
    )?.set;

    if (!nativeInputValueSetter) return;

    const beforeText = textarea.value.slice(0, selectionStart);
    const afterText = textarea.value.slice(selectionEnd);

    nativeInputValueSetter.call(textarea, `${beforeText}${text}${selectedText}${eText}${afterText}`);

    textarea.setSelectionRange(
      selectionStart + text.length,
      selectionStart + text.length + selectedText.length,
    );
    textarea.dispatchEvent(new Event("change", { bubbles: true }));
    textarea.focus()
  };

  const handleAddCodeBlock = (chars: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // eslint-disable-next-line @typescript-eslint/unbound-method
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLTextAreaElement.prototype,
      "value",
    )?.set;

    if (!nativeInputValueSetter) return;

    const selectionStart = textarea.selectionStart;
    const selectionEnd = textarea.selectionEnd;

    const beforeText = textarea.value.slice(0, selectionStart);
    let selectedText = textarea.value.slice(selectionStart, selectionEnd);
    const afterText = textarea.value.slice(selectionEnd);

    if (!selectedText) {
      selectedText = "console.log('Hello World')";
    }

    const newText = `${beforeText}\n${chars}js\n${selectedText}\n${chars}\n${afterText}`;
    nativeInputValueSetter.call(textarea, newText);

    const newSelectionStart = selectionStart + chars.length + 4; // After first "```" and newline
    const newSelectionEnd = newSelectionStart + selectedText.length;

    textarea.setSelectionRange(newSelectionStart, newSelectionEnd);
    textarea.dispatchEvent(new Event("change", { bubbles: true }));
    textarea.focus()
  };

  return (
    <div className="flex flex-wrap items-center justify-between rounded-b-none rounded-t-md border-b bg-transparent p-2">
      <div className="flex flex-row flex-wrap items-center sm:gap-2">
        <div className="sm:rounded-md sm:border">
          <Button
            aria-label="Add H1"
            className="h-7 rounded-none px-1.5 text-xs leading-none"
            onClick={() => handleAddText("# ", "Heading One")}
            title="Add H1"
            variant="ghost"
          >
            H1
          </Button>
          <Button
            aria-label="Add H2"
            className="h-7 rounded-none px-1.5 text-xs leading-none"
            onClick={() => handleAddText("## ", "Heading Two")}
            title="Add H2"
            variant="ghost"
          >
            H2
          </Button>
          <Button
            aria-label="Add H3"
            className="h-7 rounded-none px-1.5 text-xs leading-none"
            onClick={() => handleAddText("### ", "Heading Three")}
            title="Add H3"
            variant="ghost"
          >
            H3
          </Button>
          <Button
            aria-label="Add H4"
            className="h-7 rounded-none px-1.5 text-xs leading-none"
            onClick={() => handleAddText("#### ", "Heading Three")}
            title="Add H4"
            variant="ghost"
          >
            H4
          </Button>
          <Button
            aria-label="Add H5"
            className="h-7 rounded-none px-1.5 text-xs leading-none"
            onClick={() => handleAddText("##### ", "Heading Five")}
            title="Add H5"
            variant="ghost"
          >
            H5
          </Button>
        </div>
        <div className="sm:rounded-md sm:border">
          <Button
            aria-label="Add bold"
            className="h-7 rounded-none px-1.5"
            onClick={() => handleClick("**")}
            title="Toggle bold"
            variant="ghost"
          >
            <BoldIcon size={14} />
          </Button>
          <Button
            aria-label="Add italic"
            className="h-7 rounded-none px-1.5"
            onClick={() => handleClick("_")}
            title="Toggle italic"
            variant="ghost"
          >
            <ItalicIcon size={14} />
          </Button>
          <Button
            aria-label="Add strikethrough"
            className="h-7 rounded-none px-1.5"
            onClick={() => handleClick("~~")}
            title="Toggle strikethrough"
            variant="ghost"
          >
            <StrikethroughIcon size={14} />
          </Button>
          <Button
            aria-label="List Ordered"
            className="h-7 rounded-none px-1.5"
            onClick={() => handleAddText("1. ", "List Item 1")}
            title="List Ordered"
            variant="ghost"
          >
            <ListOrderedIcon size={14} />
          </Button>
          <Button
            aria-label="List Underordered"
            className="h-7 rounded-none px-1.5"
            onClick={() => handleAddText("- ", "List Item 1")}
            title="List Underordered"
            variant="ghost"
          >
            <ListIcon size={14} />
          </Button>
        </div>
        <div className="sm:rounded-md sm:border">
          <Button
            aria-label="Add Link"
            className="h-7 rounded-none px-1.5"
            onClick={() => handleAddText("[Sellhub](", "https://sellhub.cx", ")")}
            title="Add link"
            variant="ghost"
          >
            <LinkIcon size={14} />
          </Button>
          <Button
            aria-label="Insert code block"
            className="h-7 rounded-none px-1.5"
            onClick={() => handleAddCodeBlock("```")}
            title="Insert code block"
            variant="ghost"
          >
            <CodeIcon size={14} />
          </Button>
          <Button
            aria-label="Insert Image"
            className="h-7 rounded-none px-1.5"
            onClick={() =>
              handleAddText("![image](/images/no_image_placeholder.png)")
            }
            title="Insert Image"
            variant="ghost"
          >
            <ImagePlusIcon size={14} />
          </Button>
          <Button
            aria-label="Insert Quote"
            className="h-7 rounded-none px-1.5"
            onClick={() => handleAddText('> ', "This is a quote", '\n> -Author')}
            title="Insert Quote"
            variant="ghost"
          >
            <QuoteIcon size={14} />
          </Button>
        </div>
      </div>
      <div className="flex flex-row flex-wrap items-center sm:gap-2">
        {children}
      </div>
    </div>
  );
}
