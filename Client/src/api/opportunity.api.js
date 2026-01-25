import api from "./axios";

export const getStudentFeed = () =>
  api.get("/opportunities/student-feed").then(res => res.data);

export const applyToOpportunity = (id) =>
  api.post(`/applications/${id}`).then(res => res.data);

export const checkIfApplied = (opportunityId) =>
  api.get(`/applications/check/${opportunityId}`).then(res => res.data);

export const getStudentApplications = () =>
  api.get("/applications/student/applications").then(res => res.data);

export const getRecruiterApplicants = () =>
  api.get("/applications/recruiter/applicants").then(res => res.data);

export const updateApplicationStatus = (applicationId, status) =>
  api.patch(`/applications/${applicationId}`, { status }).then(res => res.data);
