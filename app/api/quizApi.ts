import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4555",
});

export default API;