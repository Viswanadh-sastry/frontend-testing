import axios from "axios";

const API_URL = import.meta.env.VITE_APP_API_URL;

export async function getDashboardList(userId: string) {
    const response = await axios.get(`${API_URL}/users/dashboards/${userId}`);
    return response.data;
}

export async function updateDashboard(userId: string, data: any) {
    if (data.length === 0) {
        data = [{ id: "", name: "", description: "", layout: "", data: { widgets: [] } }];
    }
    const response = await axios.patch(`${API_URL}/users/${userId}/dashboards`, { dashboards: data });
    return response.data;
}
