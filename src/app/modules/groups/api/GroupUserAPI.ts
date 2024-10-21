
import axios from "axios";

const API_URL = import.meta.env.VITE_APP_API_URL;

export async function getGroupUsersList(id: string, data: any) {
    const query = searchGroupUser(data);
    const response = await axios.get(`${API_URL}/groups/${id}/users${query}`);
    return response.data;
}

export async function getAddUsersList(domainId: string, data: any) {
    const query = searchGroupUser(data);
    const response = await axios.get(`${API_URL}/domains/${domainId}/users${query}`);
    return response.data;
}

export async function getAddUsersListAll(domainId: string, data: any) {
    const query = searchGroupUser(data);
    const response = await axios.get(`${API_URL}/domains/${domainId}/users${query}`);
    const totalRecords = response.data.total;
    for (let i = 100; i < totalRecords; i += 100) {
        const query = searchGroupUser({ ...data, offset: i });
        const result = await axios.get(`${API_URL}/domains/${domainId}/users${query}`);
        response.data.users.push(...result.data.users);
    }
    return response.data;
}

export async function createGroupUser(id: string, data: any) {
    const response = await axios.post(`${API_URL}/groups/${id}/users/assign`, data);
    return response.data;
}

export async function unAssignGroupUser(id: string, data: any) {
    const response = await axios.post(`${API_URL}/groups/${id}/users/unassign`, data);
    return response.data;
}

const searchGroupUser = (data: any) => {
    let query = "";
    if (data.limit) {
        query += `?limit=${data.limit}`;
    }
    if (data.offset) {
        query += `&offset=${data.offset}`;
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
