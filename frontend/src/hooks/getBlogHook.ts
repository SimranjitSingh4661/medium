import { getAllBlogsApi } from "@/api/getApi";
import { useState, useEffect } from "react";

export default function useBlogHook() {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await getAllBlogsApi();
        console.log("res", res);
        setBlogs({});
        setLoading(false);
      } catch (error: any) {
        console.log("error", error);
        setLoading(false);
        setError(error);
      }
    })();
  }, []);

  return { loading, blogs, error };
}
