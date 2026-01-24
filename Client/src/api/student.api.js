import api from "./axios";

export const getProfile = () =>
  api.get("/student/profile").then(res => res.data);

export const updateProfile = (data) =>
  api.put("/student/profile", data).then(res => res.data);
