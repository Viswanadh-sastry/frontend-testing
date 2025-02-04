
import axios from "axios";

const API_URL = import.meta.env.VITE_APP_API_URL;

export async function getGroupList(data: any) {
    const query = searchGroup(data);
    const response = await axios.get(`${API_URL}/groups${query}`);
    // sort groups by name
    response.data.groups?.sort((a: any, b: any) => a.name.localeCompare(b.name));
    return response.data;
}

export async function getGroupListAll(data: any) {
    const query = searchGroup({ ...data, limit: 100 });
    const response = await axios.get(`${API_URL}/groups${query}`);
    const totalRecords = response.data.total;
    for (let i = 100; i < totalRecords; i += 100) {
        const query = searchGroup({ ...data, offset: i });
        const result = await axios.get(`${API_URL}/groups${query}`);
        response.data.groups.push(...result.data.groups);
    }
    // sort groups by name
    response.data.groups?.sort((a: any, b: any) => a.name.localeCompare(b.name));
    return response.data;
}

export async function createGroup(data: any) {
    const response = await axios.post(`${API_URL}/groups`, data);
    return response.data;
}

export async function getGroup(id: string) {
    const response = await axios.get(`${API_URL}/groups/${id}`);
    return response.data;
}

export async function getGroupPermissions(id: string) {
    const response = await axios.get(`${API_URL}/groups/${id}/permissions`);
    return response.data;
}

export async function disableGroup(id: string) {
    const response = await axios.post(`${API_URL}/groups/${id}/disable`);
    return response.data;
}

export async function enableGroup(id: string) {
    const response = await axios.post(`${API_URL}/groups/${id}/enable`);
    return response.data;
}

export async function deleteGroup(id: string) {
    const response = await axios.delete(`${API_URL}/groups/${id}`);
    return response.data;
}

export async function updateGroup(id: string, group: any) {
    const response = await axios.put(`${API_URL}/groups/${id}`, group);
    return response.data;
}

const searchGroup = (data: any) => {
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
    if (data.parentID) {
        if (query) {
            query += `&parentID=${data.parentID}`;
        } else {
            query += `?parentID=${data.parentID}`;
        }
    }
    if (data.tree) {
        if (query) {
            query += `&tree=${data.tree}`;
        } else {
            query += `?tree=${data.tree}`;
        }
    }
    if (query) {
        query += `&status=${data.status}`;
    } else {
        query += `?status=${data.status}`;
    }
    return query;
}
