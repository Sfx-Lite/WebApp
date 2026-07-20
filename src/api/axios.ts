import axios from "axios";

export default axios.create({
  baseURL: "https://dev-api-sfx-lite.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});
