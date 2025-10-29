import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

export const getStations   = () => api.get("/api/stations");
export const addStation    = (data) => api.post(`/api/stations`, data);
export const updateStation = (id, data) => api.put(`/api/stations/${id}`, data);
export const deleteStation = (id) => api.delete(`/api/stations/${id}`);