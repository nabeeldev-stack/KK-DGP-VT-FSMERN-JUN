import axiosInstance from "./axiosInstance";

export const login = async (email, password) => {
    const { data } = await axiosInstance.post("/users/login", { email, password });
    return data;
};

export const register = async (username, email, password) => {
    const { data } = await axiosInstance.post("/users/register", { username, email, password });
    return data;
};

export const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
};