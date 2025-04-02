import axios from "axios";
import { getLORAAuth } from "../../auth/core/LORAHelpers";

const API_URL = import.meta.env.VITE_APP_LORA_API_URL;

export async function addIntegration(data: any) {
    const payload = {
        integration: {
            encoding: data.encoding,
            eventEndpointUrl: data.eventEndpointUrl,
            headers: data.headers,
        },
    };
    const response = await axios.post(`${API_URL}/applications/${data.applicationId}/integrations/${data.kind}`, payload, {
        headers: {
            'Grpc-Metadata-Authorization': `Bearer ${getLORAAuth()?.access_token}`,
        }
    });
    return response.data;
}

export async function updateIntegration(data: any) {
    const payload = {
        integration: {
            encoding: data.encoding,
            eventEndpointUrl: data.eventEndpointUrl,
            headers: data.headers,
        },
    };
    const response = await axios.put(`${API_URL}/applications/${data.applicationId}/integrations/${data.kind}`, payload, {
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

export async function getIntegrationList(applicationId: string) {
    const response = await axios.get(`${API_URL}/applications/${applicationId}/integrations`, {
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
