import axios from "axios";
import { getLORAAuth } from "../../auth/core/LORAHelpers";

const API_URL = import.meta.env.VITE_APP_LORA_API_URL;

export async function addDevice(data: any) {
    const response = await axios.post(`${API_URL}/devices`, data, {
        headers: {
            'Grpc-Metadata-Authorization': `Bearer ${getLORAAuth()?.access_token}`,
        }
    });
    return response.data;
}

export async function updateDevice(id: string, data: any) {
    const response = await axios.put(`${API_URL}/devices/${id}`, data, {
        headers: {
            'Grpc-Metadata-Authorization': `Bearer ${getLORAAuth()?.access_token}`,
        }
    });
    return response.data;
}

export async function getDeviceById(id: string) {
    const response = await axios.get(`${API_URL}/devices/${id}`, {
        headers: {
            'Grpc-Metadata-Authorization': `Bearer ${getLORAAuth()?.access_token}`,
        }
    });
    return response.data;
}

export async function getDevice(data: any) {
    const query = searchDevice(data);
    const response = await axios.get(`${API_URL}/devices${query}`, {
        headers: {
            'Grpc-Metadata-Authorization': `Bearer ${getLORAAuth()?.access_token}`,
        }
    });
    return response.data;
}

export async function deleteDeviceById(id: string) {
    const response = await axios.delete(`${API_URL}/devices/${id}`, {
        headers: {
            'Grpc-Metadata-Authorization': `Bearer ${getLORAAuth()?.access_token}`,
        }
    });
    return response.data;
}

export async function getKeysById(id: string) {
    const response = await axios.get(`${API_URL}/devices/${id}/keys`, {
        headers: {
            'Grpc-Metadata-Authorization': `Bearer ${getLORAAuth()?.access_token}`,
        }
    });
    return response.data;
}

export async function deleteKeysById(id: string) {
    const response = await axios.delete(`${API_URL}/devices/${id}/keys`, {
        headers: {
            'Grpc-Metadata-Authorization': `Bearer ${getLORAAuth()?.access_token}`,
        }
    });
    return response.data;
}

const searchDevice = (data: any) => {
    let query = "";
    if (data.limit) {
        query += `?limit=${data.limit}`;
    }
    if (data.offset) {
        query += `&offset=${data.offset}`;
    }
    if (data.applicationId) {
        query += `&applicationId=${data.applicationId}`;
    }
    return query;
}