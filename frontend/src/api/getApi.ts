import { APIClient } from "./axios";
import { GET_ALL_BLOG, GET_BLOG_BY_ID } from "./endpoint";

export async function getAllBlogsApi(
  page: number,
  pageSize: number,
  options = {}
) {
  let queryParams = {
    page,
    pageSize,
  };
  //@ts-ignore
  const urlParams = new URLSearchParams(queryParams);
  const params = urlParams.toString();
  const response = await APIClient().get(`${GET_ALL_BLOG}?${params}`, options);

  return response.data;
}

export async function getBlogByIdApi(id: string) {
  const response = await APIClient().get(`${GET_BLOG_BY_ID}/${id}`);
  return response.data;
}
