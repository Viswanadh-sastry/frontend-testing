import axios from "axios";
import { getLORAAuth } from "../../auth/core/LORAHelpers";

const API_URL = import.meta.env.VITE_APP_LORA_API_URL;

export async function addApplication(data: any) {
    const response = await axios.post(`${API_URL}/applications`, data, {
        headers: {
            'Grpc-Metadata-Authorization': `Bearer ${getLORAAuth()?.access_token}`,
        }
    });
    return response.data;
}

export async function updateApplication(id: string, data: any) {
    const response = await axios.put(`${API_URL}/applications/${id}`, data, {
        headers: {
            'Grpc-Metadata-Authorization': `Bearer ${getLORAAuth()?.access_token}`,
        }
    });
    return response.data;
}

export async function getApplicationById(id: string) {
    const response = await axios.get(`${API_URL}/applications/${id}`, {
        headers: {
            'Grpc-Metadata-Authorization': `Bearer ${getLORAAuth()?.access_token}`,
        }
    });
    return response.data;
}

export async function getApplication(data: any) {
    const query = searchApplication(data);
    const response = await axios.get(`${API_URL}/applications${query}`, {
        headers: {
            'Grpc-Metadata-Authorization': `Bearer ${getLORAAuth()?.access_token}`,
        }
    });
    return response.data;
}

export async function deleteApplicationById(id: string) {
    const response = await axios.delete(`${API_URL}/applications/${id}`, {
        headers: {
            'Grpc-Metadata-Authorization': `Bearer ${getLORAAuth()?.access_token}`,
        }
    });
    return response.data;
}

const searchApplication = (data: any) => {
    let query = "";
    if (data.limit) {
        query += `?limit=${data.limit}`;
    }
    if (data.offset) {
        query += `&offset=${data.offset}`;
    }
    if (data.tenantId) {
        query += `&tenantId=${data.tenantId}`;
    }
    return query;
}