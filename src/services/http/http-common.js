import axios from "axios";

export default axios.create({
  baseURL: "https://acomplex-tf-api.herokuapp.com",
  headers: { "Content-type": "application/json" },
});