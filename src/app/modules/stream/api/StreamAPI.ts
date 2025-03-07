import axios from "axios";
import { getVaultToken } from "../../auth/core/VaultHelpers";

const API_URL = import.meta.env.VITE_APP_STREAM_API_URL;

export async function addStream(data: any) {
    const response = await axios.post(`${API_URL}/streams`, data, {
        headers: {
            'Authorization': `Bearer ${getVaultToken()}`,
        }
    });
    return response.data;
}

export async function updateStream(name: string, data: any) {
    const response = await axios.put(`${API_URL}/streams/${name}`, data, {
        headers: {
            'Authorization': `Bearer ${getVaultToken()}`,
        }
    });
    return response.data;
}

export async function getStreamList() {
    const response = await axios.get(`${API_URL}/streams`, {
        headers: {
            'Authorization': `Bearer ${getVaultToken()}`,
        }
    });
    return response.data;
}

export async function deleteStream(name: string) {
    const response = await axios.delete(`${API_URL}/streams/${name}`, {
        headers: {
            'Authorization': `Bearer ${getVaultToken()}`,
        }
    });
    return response.data;
}

export async function getStream(name: string) {
    const response = await axios.get(`${API_URL}/streams/${name}`, {
        headers: {
            'Authorization': `Bearer ${getVaultToken()}`,
        }
    });
    return response.data;
}