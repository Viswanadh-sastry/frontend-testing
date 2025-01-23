import axios from "axios";

const API_URL = import.meta.env.VITE_APP_STREAM_API_URL;

export async function addStream(data: any) {
    const response = await axios.post(`${API_URL}/streams`, data);
    return response.data;
}

export async function getStreamList() {
    const response = await axios.get(`${API_URL}/streams`);
    return response.data;
}

export async function deleteStream(name: string) {
    const response = await axios.delete(`${API_URL}/streams/${name}`);
    return response.data;
}

export async function getStream(name: string) {
    const response = await axios.get(`${API_URL}/streams/${name}`);
    return response.data;
}