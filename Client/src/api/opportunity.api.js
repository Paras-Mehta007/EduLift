import api from "./axios";

export const getStudentFeed = () =>
  api.get("/opportunities/student-feed").then(res => res.data);

export const applyToOpportunity = (id) =>
  api.post(`/applications/${id}`).then(res => res.data);
