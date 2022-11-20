import axios from "axios";

export default axios.create({
  baseURL: "https://acomplex-tf-api.herokuapp.com",
  //baseURL: "http://127.0.0.1:5000",
  headers: { "Content-type": "application/json" },
});