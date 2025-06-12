import axios from "axios";

const API_URL = import.meta.env.VITE_APP_API_URL;

export async function getChannelList(data: any) {
    const query = searchChannel(data);
    const response = await axios.get(`${API_URL}/channels${query}`);
    return response.data;
}

export async function getChannelListAll(data: any) {
    const query = searchChannel({ ...data, limit: 100 });
    const response = await axios.get(`${API_URL}/channels${query}`);
    const totalRecords = response.data.total;
    for (let i = 100; i < totalRecords; i += 100) {
        const query = searchChannel({ ...data, offset: i });
        const result = await axios.get(`${API_URL}/channels${query}`);
        response.data.groups.push(...result.data.groups);
    }
  return response.data;
}

export async function createChannel(data: any) {
    const response = await axios.post(`${API_URL}/channels`, data);
    return response.data;
}

export async function getChannel(id: string) {
    const response = await axios.get(`${API_URL}/channels/${id}`);
    return response.data;
}

export async function getChannelPermissions(id: string) {
    const response = await axios.get(`${API_URL}/channels/${id}/permissions`);
    return response.data;
}

export async function disableChannel(id: string) {
    const response = await axios.post(`${API_URL}/channels/${id}/disable`);
    return response.data;
}

export async function enableChannel(id: string) {
    const response = await axios.post(`${API_URL}/channels/${id}/enable`);
    return response.data;
}

export async function deleteChannel(id: string) {
    const response = await axios.delete(`${API_URL}/channels/${id}`);
    return response.data;
}

export async function updateThingIdentity(id: string, identity: string) {
    const response = await axios.patch(`${API_URL}/channels/${id}/identity`, { identity });
    return response.data;
}

export async function updateChannel(id: string, thing: any) {
    const response = await axios.put(`${API_URL}/channels/${id}`, thing);
    return response.data;
}

const searchChannel = (data: any) => {
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
    if (data.status) {
        if (query) {
            query += `&status=${data.status}`;
        } else {
            query += `?status=${data.status}`;
        }
    }
    if (data.sort_by) {
        if (query) {
            query += `&sort_by=${data.sort_by}`;
        } else {
            query += `?sort_by=${data.sort_by}`;
        }
    }
    return query;
};
