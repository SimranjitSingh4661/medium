import { APIClient } from "./axios";
import { SIGN_IN, SIGN_UP, POST_BLOG } from "./endpoint";

type SignUpBody = {
  name: string;
  email: string;
  password: string;
};

export async function userSignUpApi(body: SignUpBody) {
  const response = await APIClient(false).post(SIGN_UP, body);
  return response.data;
}

type SignInBody = {
  email: string;
  password: string;
};

export async function userSignInApi(body: SignInBody) {
  const response = await APIClient(false).post(SIGN_IN, body);
  return response.data;
}

//Blog

type CreateBlogBody = {
  title: string;
  content: string;
};

export async function createBlogApi(body: CreateBlogBody) {
  const response = await APIClient().post(POST_BLOG, body);
  return response.data;
}
