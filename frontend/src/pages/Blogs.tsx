import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import BlogCard from "@/components/BlogCard";
import ReactLoading from "react-loading";
import { PAGE_SIZE } from "@/constants";
import { getAllBlogsApi } from "@/api/getApi";

export interface BlogsTypes {
  content: string;
  title: string;
  id: string;
  author: Author;
}

export interface Author {
  id: string;
  name: string;
  email: string;
}

export default function Component() {
  const navigate = useNavigate();
  const intObserver = useRef<any>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasNextPage, setHasNextPage] = useState<boolean>(true);
  const [isMoreLoading, setIsMoreLoading] = useState<boolean>(false);
  const [blogs, setBlogs] = useState<BlogsTypes[]>([]);

  const fetchPosts = async (signal: any) => {
    if (!hasNextPage) return;
    setIsMoreLoading(currentPage > 1);

    try {
      const response = await getAllBlogsApi(currentPage, PAGE_SIZE, { signal });
      setBlogs((prevPosts) => [...prevPosts, ...response.allBlogs]);
      setHasNextPage(response.hasNextPage);
      setLoading(false);
    } catch (error: any) {
      console.error("Error fetching posts:", error);
      if (signal.aborted) {
        return;
      }
      setError(error);
      setLoading(false);
    } finally {
      setIsMoreLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    fetchPosts(signal);

    return () => controller.abort();
  }, [currentPage]);

  const lastPostRef = useCallback(
    (post: any) => {
      if (loading || isMoreLoading) return;

      if (intObserver.current) intObserver.current.disconnect();

      intObserver.current = new IntersectionObserver((posts) => {
        if (posts[0].isIntersecting && hasNextPage) {
          setCurrentPage((prevPage) => prevPage + 1);
        }
      });

      if (post) intObserver.current.observe(post);
    },
    [loading, isMoreLoading, hasNextPage]
  );

  const onCreateNewBlogPress = () => {
    navigate(`/create`);
  };

  if (loading && blogs.length === 0) {
    return (
      <div className="flex flex-col h-screen w-screen justify-center items-center content-center bg-[#d6e2ea]">
        <ReactLoading width={60} height={60} type={"bars"} color={"black"} />
        <div className="font-extrabold text-2xl">loading...</div>
      </div>
    );
  }

  if (!!error) {
    return <div>Error </div>;
  }

  return (
    <div className="w-full  h-full min-h-[100svh] bg-[#d6e2ea] ">
      <Header btnText="Write new" onBtnPress={onCreateNewBlogPress} />
      <div className="h-full flex flex-col gap-8">
        {blogs?.map((item, idx) => {
          if (blogs?.length === idx + 1) {
          }
          return <BlogCard ref={lastPostRef} item={item} key={item.id} />;
        })}
      </div>
      <div className="flex items-center justify-center py-14">
        {isMoreLoading && (
          <ReactLoading width={30} height={30} type={"bars"} color={"black"} />
        )}
      </div>
    </div>
  );
}
