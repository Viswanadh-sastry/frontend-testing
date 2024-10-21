import axios from "axios";

const API_URL = import.meta.env.VITE_APP_API_URL;

export async function getThingList(data: any) {
    const query = searchThing(data);
    const response = await axios.get(`${API_URL}/things${query}`);
    return response.data;
}

export async function getThingListAll(data: any) {
    const query = searchThing(data);
    const response = await axios.get(`${API_URL}/things${query}`);
    const totalRecords = response.data.total;
    for (let i = 100; i < totalRecords; i += 100) {
        const query = searchThing({ ...data, offset: i });
        const result = await axios.get(`${API_URL}/things${query}`);
        response.data.things.push(...result.data.things);
    }
    return response.data;
}

export async function createThing(data: any) {
    const response = await axios.post(`${API_URL}/things`, data);
    return response.data;
}

export async function getThing(id: string) {
    const response = await axios.get(`${API_URL}/things/${id}`);
    return response.data;
}

export async function getThingPermissions(id: string) {
    const response = await axios.get(`${API_URL}/things/${id}/permissions`);
    return response.data;
}

export async function disableThing(id: string) {
    const response = await axios.post(`${API_URL}/things/${id}/disable`);
    return response.data;
}

export async function enableThing(id: string) {
    const response = await axios.post(`${API_URL}/things/${id}/enable`);
    return response.data;
}

export async function updateThingIdentity(id: string, identity: string) {
    const response = await axios.patch(`${API_URL}/things/${id}/identity`, { identity });
    return response.data;
}

export async function updateThingTags(id: string, tags: string[]) {
    const response = await axios.patch(`${API_URL}/things/${id}/tags`, { tags });
    return response.data;
}

export async function updateThing(id: string, thing: any) {
    const response = await axios.patch(`${API_URL}/things/${id}`, thing);
    return response.data;
}


export async function updateThingSecret(id: string, secretData: any) {
    const response = await axios.patch(`${API_URL}/things/${id}/secret`, secretData);
    return response.data;
}

const searchThing = (data: any) => {
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