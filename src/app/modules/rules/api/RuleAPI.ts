import axios from "axios";

const API_URL = import.meta.env.VITE_APP_STREAM_API_URL;

export async function addRule(data: any) {
    const response = await axios.post(`${API_URL}/rules`, data);
    return response.data;
}

export async function updateRule(name: string, data: any) {
    const response = await axios.put(`${API_URL}/rules/${name}`, data);
    return response.data;
}

export async function getRuleList() {
    const response = await axios.get(`${API_URL}/rules`);
    return response.data;
}

export async function deleteRule(name: string) {
    const response = await axios.delete(`${API_URL}/rules/${name}`);
    return response.data;
}

export async function getRule(name: string) {
    const response = await axios.get(`${API_URL}/rules/${name}`);
    return response.data;
}

export async function getRuleStatus(name: string) {
    const response = await axios.get(`${API_URL}/rules/${name}/status`);
    return response.data;
}

export async function startRule(name: string) {
    const response = await axios.post(`${API_URL}/rules/${name}/start`);
    return response.data;
}

export async function stopRule(name: string) {
    const response = await axios.post(`${API_URL}/rules/${name}/stop`);
    return response.data;
}
