import axios from "axios";
import { getVaultToken } from "../../auth/core/VaultHelpers";

const API_URL = import.meta.env.VITE_APP_NOTIFICATION_API_URL;

export async function getSubscriptionByName(name: string) {
    const response = await axios.get(`${API_URL}/subscription/name/${name}`, {
        headers: {
            'Authorization': `Bearer ${getVaultToken()}`,
        }
    });
    return response.data;
}

export async function deleteSubscription(name: string) {
    const response = await axios.delete(`${API_URL}/subscription/name/${name}`, {
        headers: {
            'Authorization': `Bearer ${getVaultToken()}`,
        }
    });
    return response.data;
}

export async function addSubscription(data: any) {
    const response = await axios.post(`${API_URL}/subscription`, data, {
        headers: {
            'Authorization': `Bearer ${getVaultToken()}`,
        }
    });
    return response.data;
}

export async function updateSubscription(data: any) {
    const response = await axios.patch(`${API_URL}/subscription`, data, {
        headers: {
            'Authorization': `Bearer ${getVaultToken()}`,
        }
    });
    return response.data;
}

export async function getSubscriptionList(data: any = null) {
    const query = searchSubscription(data);
    const response = await axios.get(`${API_URL}/subscription/all${query}`, {
        headers: {
            'Authorization': `Bearer ${getVaultToken()}`,
        }
    });
    return response.data;
}

export async function getSubscriptionByCategory(category: string) {
    const response = await axios.get(`${API_URL}/subscription/category/${category}`, {
        headers: {
            'Authorization': `Bearer ${getVaultToken()}`,
        }
    });
    return response.data;
}

export async function getSubscriptionByReceiver(receiver: string) {
    const response = await axios.get(`${API_URL}/subscription/receiver/${receiver}`, {
        headers: {
            'Authorization': `Bearer ${getVaultToken()}`,
        }
    });
    return response.data;
}

const searchSubscription = (data: any) => {
    let query = "";
    if (data?.limit) {
        query += `?limit=${data.limit}`;
    }
    if (data?.offset) {
        query += `&offset=${data.offset}`;
    }
    return query;
}