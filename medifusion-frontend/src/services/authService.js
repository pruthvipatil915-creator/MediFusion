import api from "./api";

// Login API
export const loginUser = (data) => {
  return api.post("/auth/login", data);
};

// Register API
export const registerUser = (data) => {
  return api.post("/auth/register", data);
};