import axios from "axios";

const API_URL = import.meta.env.VITE_APP_API_URL;

export async function getChannelUserList(id: string, data: any) {
    const query = searchChannelUser(data);
    const response = await axios.get(`${API_URL}/channels/${id}/users${query}`);
    return response.data;
}

export async function getAddUserList(domainId: string, data: any) {
    const query = searchChannelUser(data);
    const response = await axios.get(`${API_URL}/domains/${domainId}/users${query}`);
    return response.data;
}

export async function getAddUserListAll(domainId: string, data: any) {
    const query = searchChannelUser(data);
    const response = await axios.get(`${API_URL}/domains/${domainId}/users${query}`);
    const totalRecords = response.data.total;
    for (let i = 100; i < totalRecords; i += 100) {
        const query = searchChannelUser({ ...data, offset: i });
        const result = await axios.get(`${API_URL}/domains/${domainId}/users${query}`);
        response.data.users.push(...result.data.users);
    }
    return response.data;
}

export async function createChannelUser(id: string, data: any) {
    const response = await axios.post(`${API_URL}/channels/${id}/users/assign`, data);
    return response.data;
}

export async function unAssignChannelUser(id: string, data: any) {
    const response = await axios.post(`${API_URL}/channels/${id}/users/unassign`, data);
    return response.data;
}

const searchChannelUser = (data: any) => {
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
    if (data.metadata) {
        if (query) {
            query += `&metadata=${data.metadata}`;
        } else {
            query += `?metadata=${data.metadata}`;
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