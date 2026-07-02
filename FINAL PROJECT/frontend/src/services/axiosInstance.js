import axios from "axios";

const API_BASE_URL = (import.meta.env.VITE_API_URL || "https://kk-dgp-vt-fsmern-jun.onrender.com").replace(/\/$/, "");

const axiosInstance = axios.create({
    baseURL: `${API_BASE_URL}`,
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem("refreshToken");
                if (!refreshToken) {
                    localStorage.clear();
                    window.location.href = "/login";
                    return Promise.reject(error);
                }

                const { data } = await axios.post(
                    `${API_BASE_URL}/api/users/refresh`,
                    { refreshToken }
                );

                if (data.accessToken) {
                    localStorage.setItem("accessToken", data.accessToken);
                }
                if (data.refreshToken) {
                    localStorage.setItem("refreshToken", data.refreshToken);
                }

                originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                localStorage.clear();
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;