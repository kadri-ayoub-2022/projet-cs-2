import axios from "axios";

const Axios = axios.create({
  baseURL: "http://localhost:7777",
});

export default Axios;