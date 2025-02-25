import axios from "axios";

const Axios = axios.create({
  baseURL: "https://localhost:3000/api/v1",
  withCredentials: true,
});

export {Axios};
