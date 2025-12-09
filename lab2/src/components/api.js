import axios from "axios";

const LAB1_BASE = "http://localhost:3000/api";
const LAB3_BASE = "http://localhost:4000/api";

export function getStations() {
  return axios.get(`${LAB1_BASE}/stations`);
}

export function addStation(payload) {
  return axios.post(`${LAB1_BASE}/stations`, payload);
}

export function updateStation(id, payload) {
  return axios.put(`${LAB1_BASE}/stations/${id}`, payload);
}

export function deleteStation(id) {
  return axios.delete(`${LAB1_BASE}/stations/${id}`);
}

export function calcAirIndexApi(payload) {
  return axios.post(`${LAB3_BASE}/air-index/calc`, payload);
}

export function historyAirIndexApi(stationId, limit = 20) {
  return axios.get(`${LAB3_BASE}/air-index/history`, {
    params: { stationId, limit },
  });
}

export function getLimits() {
  return axios.get(`${LAB3_BASE}/air-index/limits`);
}

export function updateLimits(body) {
  return axios.put(`${LAB3_BASE}/air-index/limits`, body);
}