import axios from "axios";

const API_URL = import.meta.env.VITE_APP_API_URL;

export async function getUserList(data?: any) {
    const query = searchUser(data);
    const response = await axios.get(`${API_URL}/users${query}`);
    return response.data;
}

export async function getUserListAll(data?: any) {
  const query = searchUser({ ...data, limit: 100 });
  const response = await axios.get(`${API_URL}/users${query}`);
  const totalRecords = response.data.total;
  for (let i = 100; i < totalRecords; i += 100) {
    const query = searchUser({ ...data, offset: i });
    const result = await axios.get(`${API_URL}/users${query}`);
    response.data.users.push(...result.data.users);
  }

  // ❌ Removed client-side sorting to respect backend sort_by
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
  const params: Record<string, any> = {
    limit: data.limit,
    offset: data.offset,
    name: data.name,
    identity: data.identity,
    metadata: data.metadata,
    tags: data.tags,
    status: data.status,
    sort_by: data.sort_by, // ✅ Sorting support
  };

  const queryString = Object.entries(params)
    .filter(([_, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join("&");

  return queryString ? `?${queryString}` : "";
};
