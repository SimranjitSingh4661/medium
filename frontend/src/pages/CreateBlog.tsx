import RichTextEditor from "@/components/RichTextEditor";
import { useParams } from "react-router-dom";

export default function Component() {
  const { id } = useParams();

  console.log("Router Parmas --->", id);
  return (
    <div className="w-full h-full min-h-[100svh] bg-[#d6e2ea]">
      <RichTextEditor id={id} />
    </div>
  );
}
