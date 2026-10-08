import api from "./api";

export const getUserProfile = async () => {
  const response = await api.get("/user/profile");
  return response.data;
};

export const updateUserProfile = async (profileData) => {
  const response = await api.put("/user/profile", profileData);
  return response.data;
};

export const changeUserPassword = async (passwordData) => {
  const response = await api.put("/user/change-password", passwordData);
  return response.data;
};

export const deleteUserAccount = async () => {
  const response = await api.delete("/user/delete");
  return response.data;
};

export default {
  getUserProfile,
  updateUserProfile,
  changeUserPassword,
  deleteUserAccount,
};
