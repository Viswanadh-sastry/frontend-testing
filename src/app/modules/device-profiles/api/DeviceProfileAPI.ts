import axios from "axios";
import { getLORAAuth } from "../../auth/core/LORAHelpers";

const API_URL = import.meta.env.VITE_APP_LORA_API_URL;

export async function addDeviceProfile(data: any) {
    const response = await axios.post(`${API_URL}/device-profiles`, data, {
        headers: {
            'Grpc-Metadata-Authorization': `Bearer ${getLORAAuth()?.access_token}`,
        }
    });
    return response.data;
}

export async function updateDeviceProfile(id: string, data: any) {
    const response = await axios.put(`${API_URL}/device-profiles/${id}`, data, {
        headers: {
            'Grpc-Metadata-Authorization': `Bearer ${getLORAAuth()?.access_token}`,
        }
    });
    return response.data;
}

export async function getDeviceProfileById(id: string) {
    const response = await axios.get(`${API_URL}/device-profiles/${id}`, {
        headers: {
            'Grpc-Metadata-Authorization': `Bearer ${getLORAAuth()?.access_token}`,
        }
    });
    return response.data;
}

export async function getDeviceProfile(data: any) {
    const query = searchDeviceProfile(data);
    const response = await axios.get(`${API_URL}/device-profiles${query}`, {
        headers: {
            'Grpc-Metadata-Authorization': `Bearer ${getLORAAuth()?.access_token}`,
        }
    });
    return response.data;
}

export async function deleteDeviceProfileById(id: string) {
    const response = await axios.delete(`${API_URL}/device-profiles/${id}`, {
        headers: {
            'Grpc-Metadata-Authorization': `Bearer ${getLORAAuth()?.access_token}`,
        }
    });
    return response.data;
}

export async function getTenantList(data: any) {
    const query = searchTenant(data);
    const response = await axios.get(`${API_URL}/tenants${query}`, {
        headers: {
            'Grpc-Metadata-Authorization': `Bearer ${getLORAAuth()?.access_token}`,
        }
    });
    return response.data;
}

const searchDeviceProfile = (data: any) => {
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

const searchTenant = (data: any) => {
    let query = "";
    if (data.limit) {
        query += `?limit=${data.limit}`;
    }
    if (data.offset) {
        query += `&offset=${data.offset}`;
    }
    return query;
}