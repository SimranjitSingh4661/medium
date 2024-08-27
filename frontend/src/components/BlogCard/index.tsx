import { useState, forwardRef } from "react";
import { BookmarkIcon, MoreHorizontal } from "lucide-react";
import { formatRelative, format } from "date-fns";
import { enUS } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import Markdown from "markdown-to-jsx";
import { markdownComponents } from "../RichTextEditor/markdownComponents";

function formatBlogDate(date: string | Date) {
  const relativeDate = formatRelative(date, new Date(), { locale: enUS });

  if (relativeDate.includes("day ago")) {
    return format(date, "MMM d yyyy", { locale: enUS });
  }

  return relativeDate;
}

const BlogCard = forwardRef(({ item }: { item: any }, ref: any) => {
  const navigate = useNavigate();

  const [saved, setSaved] = useState(false);

  const onCardPress = () => {
    navigate(`/${item?.id}`);
  };

  const blogBody = (
    <div
      onClick={onCardPress}
      className="max-w-2xl mx-auto hover:shadow-md transition-shadow duration-200 bg-[#e4ebf0] rounded-xl hover:cursor-pointer group"
    >
      <div className="p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="hover:cursor-pointer relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
            <span className="font-medium text-gray-600 dark:text-gray-300">
              {item?.author?.name?.[0]?.toLocaleUpperCase() +
                item?.author?.name?.[1]}
            </span>
          </div>
          <p className="text-lg  font-medium capitalize text-muted-foreground">
            {item?.author?.name}
          </p>
        </div>
        <h2 className="text-2xl font-bold leading-tight text-primary line-clamp-2 mb-4">
          {item?.title}
        </h2>
        {/* <p className="text-muted-foreground mb-6 text-wrap break-words line-clamp-4">
          {item?.content}
        </p> */}
        <div className="text-wrap break-words h-[190px] overflow-hidden">
          <Markdown options={{ overrides: markdownComponents }}>
            {item?.content}
          </Markdown>
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground mt-4">
          <div className="flex items-center space-x-4">
            <span className="font-medium">
              {formatBlogDate(item?.createdAt)}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onCardPress}
              className="p-2 hover:bg-muted rounded-full transition-colors duration-200 hidden group-hover:block"
            >
              <span className="underline text-blue-600">View More</span>
            </button>
            <button
              onClick={() => setSaved(!saved)}
              className="p-2 hover:bg-muted rounded-full transition-colors duration-200"
            >
              <BookmarkIcon
                className="w-5 h-5"
                fill={saved ? "#64748b" : "white"}
              />
            </button>
            <button className="p-2 hover:bg-muted rounded-full transition-colors duration-200">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return !!ref ? (
    <article ref={ref}>{blogBody}</article>
  ) : (
    <article>{blogBody}</article>
  );
});

export default BlogCard;
