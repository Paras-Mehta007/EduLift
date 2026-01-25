import api from "./axios";

// Student endpoints
export const applyForFinancialAid = (data) =>
  api.post("/financial-aid/apply", data).then(res => res.data);

export const getStudentFinancialAidApplications = () =>
  api.get("/financial-aid/student/applications").then(res => res.data);

export const deleteFinancialAidApplication = (applicationId) =>
  api.delete(`/financial-aid/${applicationId}`).then(res => res.data);

// Recruiter endpoints
export const getRecruiterFinancialAidApplications = (status = null) =>
  api.get("/financial-aid/recruiter/applications", {
    params: status ? { status } : {},
  }).then(res => res.data);

export const updateFinancialAidStatus = (applicationId, data) =>
  api.patch(`/financial-aid/${applicationId}/status`, data).then(res => res.data);

// Common endpoints
export const getFinancialAidApplicationById = (applicationId) =>
  api.get(`/financial-aid/${applicationId}`).then(res => res.data);
