import axios from "axios";

const API_URL = import.meta.env.VITE_APP_VAULT_API_URL;
const USER_URL = import.meta.env.VITE_APP_USER_API_URL;

export async function getVaultToken(data: any) {
    const response = await axios.post(`${API_URL}/auth/userpass/login/${data.username}`, { password: data.password });
    return response.data;
}

export async function getVToken(data: any, rootToken: string) {
    const response = await axios.post(`${API_URL}/auth/userpass/login/${data.username}`, { password: data.password }, {
        headers: {
            'Authorization': `Bearer ${rootToken}`,
        }
    });
    return response.data;
}

export async function getJWTToken(username: string, client_token: string) {
    const response = await axios.get(`${API_URL}/identity/oidc/token/${username}`, {
        headers: {
            'Authorization': `Bearer ${client_token}`,
        }
    });
    return response.data;
}

// export async function addUpdateUser(username: string, data: any) {
//     const response = await axios.post(`${API_URL}/auth/userpass/users/${username}`, data, {
//         headers: {
//             'Authorization': `Bearer ${vaultHelper.getVaultClientToken()}`,
//         }
//     });
//     return response.data;
// }

// export async function getUsername(username: string) {
//     const response = await axios.get(`${API_URL}/auth/userpass/users/${username}`, {
//         headers: {
//             'Authorization': `Bearer ${vaultHelper.getVaultToken()}`,
//         }
//     });
//     return response.data;
// }

// export async function getUserList() {
//     const response = await axios.get(`${API_URL}/auth/userpass/users`, {
//         headers: {
//             'Authorization': `Bearer ${vaultHelper.getVaultToken()}`,
//         }
//     });
//     return response.data;
// }

// export async function deleteUser(username: string) {
//     const response = await axios.delete(`${API_URL}/auth/userpass/users/${username}`, {
//         headers: {
//             'Authorization': `Bearer ${vaultHelper.getVaultToken()}`,
//         }
//     });
//     return response.data;
// }

export async function updateUserPassword(data: any, rootToken: string) {
    const response = await axios.post(`${API_URL}/auth/userpass/users/${data.username}/password`, { password: data.password }, {
        headers: {
            'Authorization': `Bearer ${rootToken}`,
        }
    });
    return response.data;
}

export async function getRootToken() {
    const response = await axios.get(`${USER_URL}/root/tokens`, {
        headers: {
            'Authorization': 'none',
        }
    });
    return response.data;
}

export async function getGeneratePassword(username: string) {
    const response = await axios.get(`${USER_URL}/root/generate-password/${username}`, {
        headers: {
            'Authorization': 'none',
        }
    });
    return response.data;
}


