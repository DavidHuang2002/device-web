import axios from "axios";

// const API_BASE = "https://david-device-management.azurewebsites.net/api";

const API_BASE = "https://localhost:32768/api";

export default axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-type": "application/json"
  }
});