import api from "./api";

export const getLeads = () => api.get("/leads");

export const updateLeadStatus = (id, status) =>
  api.patch(`/leads/${id}`, { status });
