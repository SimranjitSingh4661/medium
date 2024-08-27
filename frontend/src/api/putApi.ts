import { APIClient } from "./axios";
import { UPDATE_BLOG } from "./endpoint";

type UpdateBlogBody = {
  title: string;
  blogId: string;
  content: string;
  published: boolean;
};

export async function updateBlogApi(body: UpdateBlogBody) {
  const response = await APIClient().put(UPDATE_BLOG, body);
  return response.data;
}
