import axios from "axios";

const API_BASE_URL = (import.meta.env.VITE_API_URL || "https://kk-dgp-vt-fsmern-jun.onrender.com").replace(/\/$/, "");

const API = axios.create({
    baseURL: `${API_BASE_URL}/api`,
});

export default API;