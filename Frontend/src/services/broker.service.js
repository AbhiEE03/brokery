import api from "./api";


export const getBrokerDashboard = () =>
  api.get("/broker/dashboard");
export const getClients = () => api.get("/broker/clients");
