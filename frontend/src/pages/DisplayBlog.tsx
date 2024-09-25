import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "@/components/Header";
import ReactLoading from "react-loading";
import { getBlogByIdApi } from "@/api/getApi";
import Markdown from "markdown-to-jsx";
import { markdownComponents } from "@/components/RichTextEditor/markdownComponents";
import { decodeUserToken } from "@/utils/jwtHelper";
import { Button } from "@/components/ui/button";

export interface Blog {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  author: Author;
}

export interface Author {
  id: string;
  email: string;
  name: string;
  password: string;
  createdAt: string;
}

type UserData = {
  id: string;
  name: string;
  email: string;
};

export default function Component() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [blog, setBlog] = useState<Blog>();

  const [userData, setUserData] = useState<UserData>({
    id: "",
    name: "",
    email: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!!token) {
      setUserData(decodeUserToken(token));
    }
    if (!id) {
      throw new Error("Some");
    }
    (async () => {
      try {
        const res = await getBlogByIdApi(id);
        console.log("first", res);
        setBlog(res);
      } catch (error) {
        console.log("Error", error);
        navigate("/error");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  //console.log("Params", id, userData);

  const onCreateNewBlogPress = () => {
    navigate(`/create`);
  };

  const onUpdateBlogPress = () => {
    localStorage.setItem("blog", JSON.stringify(blog));
    navigate(`/create/id=${id}`);
  };

  if (loading) {
    return (
      <div className="flex flex-col h-screen w-screen justify-center items-center content-center bg-[#d6e2ea]">
        <ReactLoading width={60} height={60} type={"bars"} color={"black"} />
        <div className="font-extrabold text-2xl">loading...</div>
      </div>
    );
  }

  return (
    <div className="w-full  h-full min-h-[100svh] bg-[#d6e2ea] ">
      <Header btnText="Write new" onBtnPress={onCreateNewBlogPress} />
      <Blog
        title={blog?.title}
        content={blog?.content}
        name={blog?.author?.name}
        email={blog?.author?.email}
        onUpdateBlogPress={onUpdateBlogPress}
        isOwnBlog={blog?.author?.id === userData?.id}
      />
    </div>
  );
}

const Blog = ({
  name = "",
  email = "",
  title = "",
  content = "",
  isOwnBlog = false,
  onUpdateBlogPress = () => {},
}) => {
  return (
    <div className="px-40 mt-10">
      <h2 className="text-4xl font-bold leading-tight text-primary line-clamp-2 mb-4">
        {title}
      </h2>
      <div className="flex flex-row ">
        <div className="pb-24 w-[70%]">
          <div className="justify-content-between">
            <Markdown options={{ overrides: markdownComponents }}>
              {content}
            </Markdown>
          </div>
        </div>
        <div className="w-[30%] pl-10">
          <div className="w-full max-w-md p-4 mt-2 bg-[#f0f3f5] border  border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
                Author
              </h5>
            </div>
            <ul
              role="list"
              className="divide-y divide-gray-200 dark:divide-gray-700"
            >
              <li className="py-3 sm:py-4">
                <div className="flex items-center">
                  {!!name && (
                    <div className="flex-shrink-0 bg-[#e4ebf0] h-10 w-10 items-center justify-center content-center flex rounded-full">
                      <span className="font-medium text-gray-600 dark:text-gray-300">
                        {name?.[0]?.toLocaleUpperCase() + name?.[1]}
                      </span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0 ms-4">
                    {!!name && (
                      <p className="text-sm font-medium text-gray-900 truncate dark:text-white capitalize">
                        {name}
                      </p>
                    )}
                    {!!email && (
                      <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                        {email}
                      </p>
                    )}
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div className="mt-6">
            {isOwnBlog && (
              <Button
                type="submit"
                className="w-full"
                variant={"default"}
                onClick={onUpdateBlogPress}
              >
                {"Update Blog"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
