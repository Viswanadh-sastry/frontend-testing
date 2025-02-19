import axios from "axios";

const API_URL = import.meta.env.VITE_APP_API_URL;

export async function getThingUsersList(id: string, data: any) {
    const query = searchThingUser(data);
    const response = await axios.get(`${API_URL}/things/${id}/users${query}`);
    return response.data;
}

export async function createThingUser(id: string, data: any) {
    const response = await axios.post(`${API_URL}/things/${id}/users/share`, data);
    return response.data;
}

export async function getThingUser(id: string) {
    const response = await axios.get(`${API_URL}/groups/${id}`);
    return response.data;
}

const searchThingUser = (data: any) => {
    let query = "";
    if (data.limit) {
        query += `?limit=${data.limit}`;
    }
    if (data.offset) {
        query += `&offset=${data.offset}`;
    }
    if (data.name) {
        if (query) {
            query += `&name=${data.name}`;
        } else {
            query += `?name=${data.name}`;
        }
    }
    if (query) {
        query += `&status=${data.status}`;
    } else {
        query += `?status=${data.status}`;
    }
    if (data.permission) {
        if (query) {
            query += `&permission=${data.permission}`;
        } else {
            query += `?permission=${data.permission}`;
        }
    }
    return query;
}