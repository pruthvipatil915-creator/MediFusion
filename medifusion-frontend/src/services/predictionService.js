import api from "./api";

export const predictDisease = async (symptoms) => {

    const response = await api.post("/ai/predict", {
        symptoms: symptoms
    });

    return response.data;
};

export const predictDiabetes = async (diabetesData) => {

    const response = await api.post("/ai/predict/diabetes", diabetesData);

    return response.data;
};

export const predictHeart = async (heartData) => {

    const response = await api.post("/ai/predict/heart", heartData);

    return response.data;
};