import api from "./api";

// Get all doctors
export const getAllDoctors = async () => {
  const response = await api.get("/doctors");
  return response.data;
};

// Search doctors by city and specialization
export const searchDoctors = async (city = "", specialization = "") => {
  const response = await api.get("/doctors/search", {
    params: {
      city,
      specialization,
    },
  });

  return response.data;
};