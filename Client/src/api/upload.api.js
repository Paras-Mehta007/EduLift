import api from "./axios";

export const uploadDocuments = (formData) => {
  const docType = formData.get("type");
  formData.delete("type");
  
  return api.post("/upload/documents", formData, {
    params: { type: docType }
  }).then(res => res.data);
};

export const updatePortfolioLinks = (data) =>
  api.patch("/upload/portfolio", data).then(res => res.data);

export const getStudentResume = (userId) =>
  api.get(`/upload/resume/${userId}`).then(res => res.data);
