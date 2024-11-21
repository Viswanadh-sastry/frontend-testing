import axios from "axios";

const API_URL = import.meta.env.VITE_APP_API_URL;

export async function getUserList(data?: any) {
    const query = searchUser(data);
    const response = await axios.get(`${API_URL}/users${query}`);
    // sort users by name
    response.data.users?.sort((a: any, b: any) => a.name.localeCompare(b.name));
    return response.data;
}

export async function getUserListAll(data?: any) {
    const query = searchUser(data);
    const response = await axios.get(`${API_URL}/users${query}`);
    const totalRecords = response.data.total;
    for (let i = 100; i < totalRecords; i += 100) {
        const query = searchUser({ ...data, offset: i });
        const result = await axios.get(`${API_URL}/users${query}`);
        response.data.users.push(...result.data.users);
    }
    // sort users by name
    response.data.users?.sort((a: any, b: any) => a.name.localeCompare(b.name));
    return response.data;
}

export async function createUser(data: any) {
    const response = await axios.post(`${API_URL}/users`, data);
    return response.data;
}

export async function getUser(id: string) {
    const response = await axios.get(`${API_URL}/users/${id}`);
    return response.data;
}

export async function disableUser(id: string) {
    const response = await axios.post(`${API_URL}/users/${id}/disable`);
    return response.data;
}

export async function enableUser(id: string) {
    const response = await axios.post(`${API_URL}/users/${id}/enable`);
    return response.data;
}

export async function updateUserIdentity(id: string, identity: string) {
    const response = await axios.patch(`${API_URL}/users/${id}/identity`, { identity });
    return response.data;
}

export async function updateUser(id: string, user: any) {
    const response = await axios.patch(`${API_URL}/users/${id}`, user);
    return response.data;
}

export async function updateUserRole(id: string, role: string) {
    const response = await axios.patch(`${API_URL}/users/${id}/role`, { role });
    return response.data;
}

export async function updateUserTags(id: string, tags: string[]) {
    const response = await axios.patch(`${API_URL}/users/${id}/tags`, { tags });
    return response.data;
}

const searchUser = (data: any) => {
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
    if (data.identity) {
        if (query) {
            query += `&identity=${data.identity}`;
        } else {
            query += `?identity=${data.identity}`;
        }
    }
    if (data.metadata) {
        if (query) {
            query += `&metadata=${data.metadata}`;
        } else {
            query += `?metadata=${data.metadata}`;
        }
    }
    if (data.tags) {
        if (query) {
            query += `&tags=${data.tags}`;
        } else {
            query += `?tags=${data.tags}`;
        }
    }
    if (query) {
        query += `&status=${data.status}`;
    } else {
        query += `?status=${data.status}`;
    }
    return query;
}
