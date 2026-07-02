import axios from "axios";

const DEFAULT_API_BASE_URL = "https://kk-dgp-vt-fsmern-jun.onrender.com";

export const API_BASE_URL = (() => {
    const rawUrl = (import.meta.env.VITE_API_URL || DEFAULT_API_BASE_URL).trim();
    const normalized = rawUrl.replace(/\/+$/, "");

    try {
        const parsed = new URL(normalized);
        if (!["http:", "https:"].includes(parsed.protocol)) {
            throw new Error("Invalid protocol");
        }
        return `${parsed.origin}${parsed.pathname.replace(/\/+$/, "")}`;
    } catch (error) {
        console.warn("Invalid VITE_API_URL value; falling back to default API base URL.", rawUrl);
        return DEFAULT_API_BASE_URL;
    }
})();

const API = axios.create({
    baseURL: `${API_BASE_URL}/api`,
});

export default API;