import api from "./api";

export const getPredictionHistory = async () => {
  const response = await api.get("/history");
  return response.data;
};