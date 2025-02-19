import axios from "axios";
import { getLORAAuth } from "../../auth/core/LORAHelpers";

const API_URL = import.meta.env.VITE_APP_LORA_API_URL;

export async function addIntegration(data: any) {
    const response = await axios.post(`${API_URL}/integrations`, data, {
        headers: {
            'Grpc-Metadata-Authorization': `Bearer ${getLORAAuth()?.access_token}`,
        }
    });
    return response.data;
}

export async function updateIntegration(id: string, data: any) {
    const response = await axios.put(`${API_URL}/integrations/${id}`, data, {
        headers: {
            'Grpc-Metadata-Authorization': `Bearer ${getLORAAuth()?.access_token}`,
        }
    });
    return response.data;
}

export async function getIntegrationById(id: string) {
    const response = await axios.get(`${API_URL}/integrations/${id}`, {
        headers: {
            'Grpc-Metadata-Authorization': `Bearer ${getLORAAuth()?.access_token}`,
        }
    });
    return response.data;
}

export async function getIntegration(data: any) {
    const response = await axios.get(`${API_URL}/applications/${data.applicationId}/integrations/${data.kind}`, {
        headers: {
            'Grpc-Metadata-Authorization': `Bearer ${getLORAAuth()?.access_token}`,
        }
    });
    return response.data;
}

export async function getIntegrationList(data: any) {
    // const query = searchIntegration(data);
    const response = await axios.get(`${API_URL}/applications/${data.applicationId}/integrations`, {
        headers: {
            'Grpc-Metadata-Authorization': `Bearer ${getLORAAuth()?.access_token}`,
        }
    });
    return response.data;
}

export async function deleteIntegration(data: any) {
    const response = await axios.delete(`${API_URL}/applications/${data.applicationId}/integrations/${data.kind}`, {
        headers: {
            'Grpc-Metadata-Authorization': `Bearer ${getLORAAuth()?.access_token}`,
        }
    });
    return response.data;
}

// const searchIntegration = (data: any) => {
//     let query = "";
//     if (data.limit) {
//         query += `?limit=${data.limit}`;
//     }
//     if (data.offset) {
//         query += `&offset=${data.offset}`;
//     }
//     if (data.applicationId) {
//         query += `&applicationId=${data.applicationId}`;
//     }
//     return query;
// }