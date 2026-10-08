import api from "./api";

export const getSymptoms = async () => {

    const response = await api.get("/symptoms");

    return response.data;

};