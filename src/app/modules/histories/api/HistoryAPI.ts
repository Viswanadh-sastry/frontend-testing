import axios from "axios";

const API_URL = import.meta.env.VITE_APP_API_URL;

export async function getHistoryList(channelId: string, data: any) {
    const query = searchAsset(data);
    const response = await axios.get(`${API_URL}/channels/${channelId}/messages${query}`);
    return response.data;
}

export async function getHistoryListAll(channelId: string, data: any) {
    const query = searchAsset(data);
    const response = await axios.get(`${API_URL}/channels/${channelId}/messages${query}`);
    const totalRecords = response.data.total;
    for (let i = 100; i < totalRecords; i += 100) {
        const query = searchAsset({ ...data, offset: i });
        const result = await axios.get(`${API_URL}/channels/${channelId}/messages${query}`);
        response.data.messages.push(...result.data.messages);
    }
    return response.data;
}

export async function getChannelList(data: any) {
    const query = searchAsset(data);
    const response = await axios.get(`${API_URL}/channels${query}`);
    return response.data;
}

export async function getThingList(data: any) {
    const query = searchAsset(data);
    const response = await axios.get(`${API_URL}/things${query}`);
    return response.data;
}

export async function getGroupList(data: any) {
    const query = searchAsset(data);
    const response = await axios.get(`${API_URL}/groups${query}`);
    return response.data;
}

const searchAsset = (data: any) => {
    let query = "";
    if (data.limit) {
        query += `?limit=${data.limit}`;
    }
    if (data.offset) {
        query += `&offset=${data.offset}`;
    }

    if (data.publisher) {
        query += `&publisher=${data.publisher}`;
    }

    if (data.name.length > 0) {
        if (query) {
            query += `&name=${data.name}`;
        } else {
            query += `?name=${data.name}`;
        }
    }

    if (data.from) {
        if (query) {
            query += `&from=${data.from}`;
        } else {
            query += `?from=${data.from}`;
        }
    }

    if (data.to) {
        if (query) {
            query += `&to=${data.to}`;
        } else {
            query += `?to=${data.to}`;
        }
    }

    return query;
}