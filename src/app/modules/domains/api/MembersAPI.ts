import axios from "axios";

const API_URL = import.meta.env.VITE_APP_API_URL;

export async function getMemberList(domainId: string, data: any) {
    const query = searchMember(data);
    const response = await axios.get(`${API_URL}/domains/${domainId}/users?limit=${data.limit}&offset=${data.offset}${query}`);
    return response.data;
}

export async function getMemberListAll(domainId: string, data: any) {
    const query = searchMember(data);
    const response = await axios.get(`${API_URL}/domains/${domainId}/users?limit=${data.limit}&offset=${data.offset}${query}`);
    const totalRecords = response.data.total;
    for (let i = 100; i < totalRecords; i += 100) {
        const query = searchMember({ ...data, offset: i });
        const result = await axios.get(`${API_URL}/domains/${domainId}/users?limit=${data.limit}&offset=${data.offset}${query}`);
        response.data.users.push(...result.data.users);
    }
    // sort users by name
    response.data.users?.sort((a: any, b: any) => a.name.localeCompare(b.name));
    return response.data;
}

export async function getMember(domainId: string, userId: string) {
    const response = await axios.get(`${API_URL}/domains/${domainId}/users/${userId}`);
    return response.data;
}

export async function createMember(domainId: string, data: any) {
    const response = await axios.post(`${API_URL}/domains/${domainId}/users/assign`, data);
    return response.data;
}

const searchMember = (data: any) => {
    let query = "";
    if (data.metadata) {
        query += `&metadata=${data.metadata}`;
    }
    if (data.status) {
        query += `&status=${data.status}`;
    }
    return query;
}
