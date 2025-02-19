import axios from "axios";
import { getLORAAuth } from "../../auth/core/LORAHelpers";

const API_URL = import.meta.env.VITE_APP_LORA_API_URL;

export async function addGateway(data: any) {
    const response = await axios.post(`${API_URL}/gateways`, data, {
        headers: {
            'Grpc-Metadata-Authorization': `Bearer ${getLORAAuth()?.access_token}`,
        }
    });
    return response.data;
}

export async function updateGateway(id: string, data: any) {
    const response = await axios.put(`${API_URL}/gateways/${id}`, data, {
        headers: {
            'Grpc-Metadata-Authorization': `Bearer ${getLORAAuth()?.access_token}`,
        }
    });
    return response.data;
}

export async function getGatewayById(id: string) {
    const response = await axios.get(`${API_URL}/gateways/${id}`, {
        headers: {
            'Grpc-Metadata-Authorization': `Bearer ${getLORAAuth()?.access_token}`,
        }
    });
    return response.data;
}

export async function getGateway(data: any) {
    const query = searchGateway(data);
    const response = await axios.get(`${API_URL}/gateways${query}`, {
        headers: {
            'Grpc-Metadata-Authorization': `Bearer ${getLORAAuth()?.access_token}`,
        }
    });
    return response.data;
}

export async function deleteGatewayById(id: string) {
    const response = await axios.delete(`${API_URL}/gateways/${id}`, {
        headers: {
            'Grpc-Metadata-Authorization': `Bearer ${getLORAAuth()?.access_token}`,
        }
    });
    return response.data;
}

const searchGateway = (data: any) => {
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