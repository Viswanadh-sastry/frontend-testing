import axios from "axios";
import * as vaultHelper from "../../auth/core/VaultHelpers";

const API_URL = import.meta.env.VITE_APP_VAULT_API_URL;

export async function getVaultToken(data: any) {
    const response = await axios.post(`${API_URL}/auth/userpass/login/${data.username}`, { password: data.password });
    return response.data;
}

export async function getJWTToken(username: string, token: string) {
    const response = await axios.get(`${API_URL}/identity/oidc/token/${username}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    });
    return response.data;
}

export async function addUpdateUser(username: string, data: any) {
    const response = await axios.post(`${API_URL}/auth/userpass/users/${username}`, data, {
        headers: {
            'Authorization': `Bearer ${vaultHelper.getVaultToken()}`,
        }
    });
    return response.data;
}

export async function getUsername(username: string) {
    const response = await axios.get(`${API_URL}/auth/userpass/users/${username}`, {
        headers: {
            'Authorization': `Bearer ${vaultHelper.getVaultToken()}`,
        }
    });
    return response.data;
}

export async function getUserList() {
    const response = await axios.get(`${API_URL}/auth/userpass/users`, {
        headers: {
            'Authorization': `Bearer ${vaultHelper.getVaultToken()}`,
        }
    });
    return response.data;
}

export async function deleteUser(username: string) {
    const response = await axios.delete(`${API_URL}/auth/userpass/users/${username}`, {
        headers: {
            'Authorization': `Bearer ${vaultHelper.getVaultToken()}`,
        }
    });
    return response.data;
}

export async function updateUserPassword(data: any) {
    const response = await axios.post(`${API_URL}/auth/userpass/users/${data.username}/password`, { password: data.password }, {
        headers: {
            'Authorization': `Bearer ${vaultHelper.getVaultToken()}`,
        }
    });
    return response.data;
}
