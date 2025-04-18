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

export async function createKeysById(id: string, data: any) {
    const response = await axios.post(`${API_URL}/devices/${id}/keys`, data, {
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

export async function resetKeyRotation() {
    const response = await axios.post(`${API_URL}/downlink/reset-keyrotation`, {}, {
        headers: {
            'Grpc-Metadata-Authorization': `Bearer ${getLORAAuth()?.access_token}`,
        }
    });
    return response.data;
}

export async function updateFrequency(data: any) {
    const response = await axios.post(`${API_URL}/downlink/update-frequency`, data, {
        headers: {
            'Grpc-Metadata-Authorization': `Bearer ${getLORAAuth()?.access_token}`,
        }
    });
    return response.data;
}

export async function rebootDevice(data: any) {
    const response = await axios.post(`${API_URL}/downlink/device-reboot`, data, {
        headers: {
            'Grpc-Metadata-Authorization': `Bearer ${getLORAAuth()?.access_token}`,
        }
    });
    return response.data;
}

export async function deviceStatus(data: any) {
    const response = await axios.post(`${API_URL}/downlink/device-status`, data, {
        headers: {
            'Grpc-Metadata-Authorization': `Bearer ${getLORAAuth()?.access_token}`,
        }
    });
    return response.data;
}

export async function logLevel(data: any) {
    const response = await axios.post(`${API_URL}/downlink/log-level`, data, {
        headers: {
            'Grpc-Metadata-Authorization': `Bearer ${getLORAAuth()?.access_token}`,
        }
    });
    return response.data;
}

export async function syncTime(data: any) {
    const response = await axios.post(`${API_URL}/downlink/time-sync`, data, {
        headers: {
            'Grpc-Metadata-Authorization': `Bearer ${getLORAAuth()?.access_token}`,
        }
    });
    return response.data;
}

export async function resetDevice(data: any) {
    const response = await axios.post(`${API_URL}/downlink/reset-device`, data, {
        headers: {
            'Grpc-Metadata-Authorization': `Bearer ${getLORAAuth()?.access_token}`,
        }
    });
    return response.data;
}

export async function getLinkMetrics(id: string, data: any) {
    const query = searchMetrics(data);
    const response = await axios.get(`${API_URL}/devices/${id}/link-metrics${query}`, {
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

const searchMetrics = (data: any) => {
    let query = "";
    if (data.start) {
        query += `?start=${data.start}`;
    }
    if (data.end) {
        query += `&end=${data.end}`;
    }
    if (data.aggregation) {
        query += `&aggregation=${data.aggregation}`;
    }
    return query;
}