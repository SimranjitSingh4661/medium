import { useState, useRef, Fragment, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Markdown from "markdown-to-jsx";
import { markdownComponents } from "./markdownComponents";
import { FormattingOptions } from "./FormattingOptions";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { CodeIcon, CopySlashIcon, ScanEyeIcon } from "lucide-react";
import toast from "react-hot-toast";
import { z } from "zod";
import Header from "../Header";
import { createBlogApi } from "@/api/postApi";
import { updateBlogApi } from "@/api/putApi";
import { useNavigate } from "react-router-dom";

const FORM_HEIGHT = "h-[600px] max-h-[600px]";

interface RichTextEditorProps {
  id?: string;
}

const FORMVALUE_LENGTH_CHECK = z.object({
  blogForm: z.string().max(2000) as z.ZodType<string>,
});

const FORMTITLE_LENGTH_CHECK = z.object({
  blogTitle: z.string().max(150) as z.ZodType<string>,
});

function RichTextEditor({ id = "" }: RichTextEditorProps) {
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const navigate = useNavigate();

  const [mdxView, setMdxView] = useState<"split" | "edit" | "preview">("split");
  const [formError, setFormError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [formValue, setFormValue] = useState<string>("");
  const [formTitle, setFormTitle] = useState<string>("");

  useEffect(() => {
    if (!!id) {
      const blog = localStorage.getItem("blog");
      const parsedBlog = JSON.parse(blog || "");
      setFormTitle(parsedBlog?.title);
      setFormValue(parsedBlog?.content);
    }
  }, [id]);

  const onTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { success } = FORMVALUE_LENGTH_CHECK.safeParse({
      blogForm: e.target.value,
    });

    if (success) {
      setFormError(false);
      setFormValue(e.target.value);
    } else {
      setFormError(true);
      toast.error("Only 2000 words allowed", {
        duration: 2000,
      });
    }
  };

  const onTitleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { success } = FORMTITLE_LENGTH_CHECK.safeParse({
      blogTitle: e.target.value,
    });

    if (success) {
      setFormError(false);
      setFormTitle(e.target.value);
    } else {
      setFormError(true);
      toast.error("Only 150 words allowed", {
        duration: 2000,
      });
    }
  };

  const onFormPublishPress = async () => {
    setLoading(true);
    try {
      if (!!id) {
        //Update blog api
        await updateBlogApi({
          published: false,
          title: formTitle,
          content: formValue,
          blogId: id?.replace("id=", ""),
        });
        navigate(-1);
        localStorage.removeItem("blog");
      } else {
        //Create new blog api
        await createBlogApi({
          title: formTitle,
          content: formValue,
        });
        navigate(-1);
      }
    } catch (error) {
      console.log("Errror", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Fragment>
      <Header
        loading={loading}
        btnDisabled={formError}
        onBtnPress={onFormPublishPress}
        btnText={!!id ? "Update" : "Publish"}
      />
      <div className="mx-28 mt-10">
        <div className="grid w-full items-center gap-1.5 ">
          <Label htmlFor="email">Blog Title</Label>
          <Input
            type="text"
            id="blogTitle"
            name="blogTitle"
            placeholder="Enter form title here..."
            value={formTitle}
            onChange={onTitleTextChange}
            className={cn(
              "focus-visible:!border-border w-full resize-none overflow-y-auto border-none mb-6 p-4 focus-visible:!ring-0"
            )}
          />
        </div>

        <div className="rounded-md border bg-[#b3bdc4] border-cyan-600 ">
          <FormattingOptions textareaRef={descriptionRef}>
            <div className="rounded-md border">
              <Button
                className="h-7 rounded-none px-1.5"
                onClick={() => setMdxView("edit")}
                title="View Editor"
                variant={mdxView === "edit" ? "secondary" : "ghost"}
              >
                <CodeIcon size={14} />
              </Button>
              <Button
                className="h-7 rounded-none px-1.5"
                onClick={() => setMdxView("preview")}
                title="View Preview"
                variant={mdxView === "preview" ? "secondary" : "ghost"}
              >
                <ScanEyeIcon size={14} />
              </Button>
              <Button
                className="h-7 rounded-none px-1.5"
                onClick={() => setMdxView("split")}
                title="Split Editor/Preview"
                variant={mdxView === "split" ? "secondary" : "ghost"}
              >
                <CopySlashIcon size={14} />
              </Button>
            </div>
          </FormattingOptions>
          <ResizablePanelGroup
            className="flex flex-row items-center"
            direction="horizontal"
          >
            <ResizablePanel
              className={cn(mdxView === "preview" ? "hidden" : "block")}
              defaultSize={50}
              minSize={25}
            >
              <Textarea
                value={formValue}
                ref={descriptionRef}
                name="blogForm"
                onChange={onTextChange}
                placeholder="Start writing your blog here..."
                className={cn(
                  "focus-visible:!border-border  w-full resize-none overflow-y-auto border-none p-4 focus-visible:!ring-0",
                  FORM_HEIGHT
                )}
              />
            </ResizablePanel>
            {mdxView === "split" ? <ResizableHandle withHandle /> : null}
            <ResizablePanel
              className={cn(mdxView === "edit" ? "hidden" : "block border-l")}
              defaultSize={50}
              minSize={25}
            >
              <div
                className={cn(
                  "w-full resize-none overflow-y-auto whitespace-pre-wrap bg-transparent p-4 bg-white",
                  FORM_HEIGHT
                )}
              >
                <Markdown options={{ overrides: markdownComponents }}>
                  {formValue}
                </Markdown>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    </Fragment>
  );
}

export default RichTextEditor;
