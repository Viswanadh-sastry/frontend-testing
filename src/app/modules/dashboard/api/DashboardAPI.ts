import axios from "axios";

const API_URL = import.meta.env.VITE_APP_API_URL;

export async function getDashboardList(data: any) {
    const query = searchDashboard(data);
    const response = await axios.get(`${API_URL}/dashboards/list${query}`);
    return response.data;
}

export async function getDashboard(id: string) {
    const response = await axios.get(`${API_URL}/dashboards/${id}`);
    return response.data;
}

export async function createDashboard(data: any) {
    const response = await axios.post(`${API_URL}/dashboards`, data);
    return response.data;
}

export async function updateDashboard(data: any) {
    const response = await axios.patch(`${API_URL}/dashboards`, data);
    return response.data;
}

export async function deleteDashboard(id: string) {
    const response = await axios.delete(`${API_URL}/dashboards/${id}`);
    return response.data;
}

const searchDashboard = (data: any) => {
    let query = "";
    query += `?limit=${data.limit}`;
    query += `&page=${data.page+1}`;
    if (data.name) {
        if (query) {
            query += `&name=${data.name}`;
        } else {
            query += `?name=${data.name}`;
        }
    }
    // if (data.metadata) {
    //     if (query) {
    //         query += `&metadata=${data.metadata}`;
    //     } else {
    //         query += `?metadata=${data.metadata}`;
    //     }
    // }
    // if (query) {
    //     query += `&status=${data.status}`;
    // } else {
    //     query += `?status=${data.status}`;
    // }
    return query;
}