import axios from "axios";

const API_URL = import.meta.env.VITE_APP_NOTIFICATION_API_URL;

export async function getSubscriptionByName(name: string) {
    const response = await axios.get(`${API_URL}/subscription/name/${name}`);
    return response.data;
}

export async function deleteSubscription(name: string) {
    const response = await axios.delete(`${API_URL}/subscription/name/${name}`);
    return response.data;
}

export async function addSubscription(data: any) {
    const response = await axios.post(`${API_URL}/subscription`, data);
    return response.data;
}

export async function updateSubscription(data: any) {
    const response = await axios.patch(`${API_URL}/subscription`, data);
    return response.data;
}

export async function getSubscriptionList() {
    const response = await axios.get(`${API_URL}/subscription/all`);
    return response.data;
}

export async function getSubscriptionByCategory(category: string) {
    const response = await axios.get(`${API_URL}/subscription/category/${category}`);
    return response.data;
}

export async function getSubscriptionByReceiver(receiver: string) {
    const response = await axios.get(`${API_URL}/subscription/receiver/${receiver}`);
    return response.data;
}