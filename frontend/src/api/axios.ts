import Axios from "axios";
import { HOST } from "./endpoint";
import toast from "react-hot-toast";

const defaultOptions = (withAuth: boolean) => {
  const token = localStorage.getItem("token");
  console.log("Token there", token);
  //get auth token
  return {
    headers: {
      "Content-Type": "application/json",
      "Accept-Type": "application/json",
      Authorization: withAuth ? `Bearer ${token}` : "",
    },
  };
};

export const APIClient = (withAuth = true) => {
  const axios = Axios.create({
    baseURL: HOST,
    ...defaultOptions(withAuth),
  });
  axios.interceptors.response.use(
    (response) => response,
    (err) => {
      console.log(
        "[AXIOS ERROR INTECEPTOR]",
        err.response?.data?.message || err?.message
      );
      if (err?.response?.data?.code === 401 || err?.response?.status === 401) {
        // If JWT Expires
        toast.error(
          "Please sign in " + err.response?.data?.message || err?.message
        );
        localStorage.clear();
      }
      if (err?.response?.data?.code === 502) {
        throw {
          err,
          errorMessage: err.response?.data?.message || err?.message,
        };
      }
      throw {
        err,
        errorMessage: err.response?.data?.message || err?.message,
      };
    }
  );
  return axios;
};
