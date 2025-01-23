import axios from "axios";

const API_URL = import.meta.env.VITE_APP_NOTIFICATION_API_URL;

export async function addNotification(data: any) {
    const response = await axios.post(`${API_URL}/notification`, data);
    return response.data;
}

export async function getNotificationByTimestamp(start: string, end: string) {
    const response = await axios.get(`${API_URL}/notification/start/${start}/end/${end}`);
    return response.data;
}

export async function getNotificationByCategory(category: string) {
    const response = await axios.get(`${API_URL}/notification/category/${category}`);
    return response.data;
}

export async function getNotificationByLabel(label: string) {
    const response = await axios.get(`${API_URL}/notification/label/${label}`);
    return response.data;
}

export async function getNotificationByStatus(status: string) {
    const response = await axios.get(`${API_URL}/notification/status/${status}`);
    return response.data;
}

export async function getNotificationBySubscription(name: string) {
    const response = await axios.get(`${API_URL}/notification/subscription/name/${name}`);
    return response.data;
}

export async function deleteNotification(age: string) {
    const response = await axios.delete(`${API_URL}/notification/age/${age}`);
    return response.data;
}