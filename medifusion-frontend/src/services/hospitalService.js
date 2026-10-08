import api from "./api";

/**
 * Fetch all hospitals.
 * GET /hospitals
 */
export const getAllHospitals = async () => {
  const response = await api.get("/hospitals");
  return response.data;
};

/**
 * Fetch a single hospital by ID.
 * GET /hospitals/{id}
 */
export const getHospitalById = async (id) => {
  const response = await api.get(`/hospitals/${id}`);
  return response.data;
};

/**
 * Fetch hospitals filtered by city.
 * GET /hospitals/city/{city}
 */
export const getHospitalsByCity = async (city) => {
  const cleanCity = city.trim().replace(/\s+/g, " ");
  const response = await api.get(`/hospitals/city/${encodeURIComponent(cleanCity)}`);
  return response.data;
};

/**
 * Fetch hospitals filtered by specialization.
 * GET /hospitals/specialization/{specialization}
 */
export const getHospitalsBySpecialization = async (specialization) => {
  const cleanSpec = specialization.trim().replace(/\s+/g, " ");
  const response = await api.get(
    `/hospitals/specialization/${encodeURIComponent(cleanSpec)}`
  );
  return response.data;
};

/**
 * Search hospitals with flexible parameters (city, specialization, or both).
 * Cleans, trims, and normalizes queries automatically.
 */
export const searchHospitals = async (city = "", specialization = "") => {
  const trimmedCity = city.trim().replace(/\s+/g, " ");
  const trimmedSpec = specialization.trim().replace(/\s+/g, " ");

  // Both parameters provided
  if (trimmedCity && trimmedSpec) {
    const response = await api.get("/hospitals/search", {
      params: {
        city: trimmedCity,
        specialization: trimmedSpec,
      },
    });
    return response.data;
  }

  // Only city provided
  if (trimmedCity) {
    return await getHospitalsByCity(trimmedCity);
  }

  // Only specialization provided
  if (trimmedSpec) {
    return await getHospitalsBySpecialization(trimmedSpec);
  }

  // Neither provided -> return all
  return await getAllHospitals();
};