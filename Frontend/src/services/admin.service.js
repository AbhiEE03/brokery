import api from "./api";


export const getAdminDashboard = () =>
  api.get("/admin/dashboard");
export const getAdminProperties = () => api.get("/admin/properties");
export const deleteProperty = (id) => api.delete(`/admin/properties/${id}`);
