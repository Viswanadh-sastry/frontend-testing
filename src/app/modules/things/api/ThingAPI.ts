import axios from "axios";
import { getVaultToken } from "../../auth/core/VaultHelpers";

const API_URL = import.meta.env.VITE_APP_API_URL;
const EDGEX_API_URL = import.meta.env.VITE_APP_EDGEX_API_URL;

// Helper: URL-safe encoding
const encode = (val: string) => encodeURIComponent(val);

// Unified query string builder including optional sort_by
const searchThing = (data: any): string => {
  const params: Record<string, any> = {
    limit: data.limit,
    offset: data.offset,
    name: data.name,
    metadata: data.metadata,
    tags: data.tags,
    status: data.status,
    sort_by: data.sort_by, // backend sorting param
  };

  const queryString = Object.entries(params)
    .filter(([_, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${k}=${encode(String(v))}`)
    .join("&");

  return queryString ? `?${queryString}` : "";
};

//#region Thing API

export async function getThingList(data: any) {
    const query = searchThing(data);
    const response = await axios.get(`${API_URL}/things${query}`);
    return response.data;
}

export async function getThingListAll(data: any) {
  const baseParams = { ...data, limit: 100 };
  const initialQuery = searchThing({ ...baseParams, offset: 0 });
  const response = await axios.get(`${API_URL}/things${initialQuery}`);
  const totalRecords = response.data.total;
  const allThings = [...(response.data.things || [])];

  for (let i = 100; i < totalRecords; i += 100) {
    const paginatedQuery = searchThing({ ...baseParams, offset: i });
    const result = await axios.get(`${API_URL}/things${paginatedQuery}`);
    allThings.push(...(result.data.things || []));
  }

  allThings.sort((a: any, b: any) => a.name.localeCompare(b.name));

  return { ...response.data, things: allThings };
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

export async function deleteThing(id: string) {
    const response = await axios.delete(`${API_URL}/things/${id}`);
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

//#endregion

//#region EdgeX Device Profile

export async function createDeviceProfile(data: any) {
    const response = await axios.post(`${EDGEX_API_URL}/deviceprofile/uploadfile`, data, {
        headers: {
            'Authorization': `Bearer ${getVaultToken()}`,
        }
    });
    return response.data;
}

export async function updateDeviceProfile(data: any) {
    const response = await axios.put(`${EDGEX_API_URL}/deviceprofile/uploadfile`, data, {
        headers: {
            'Authorization': `Bearer ${getVaultToken()}`,
        }
    });
    return response.data;
}

export async function getDeviceProfileByName(name: string) {
    const response = await axios.get(`${EDGEX_API_URL}/deviceprofile/name/${name}`, {
        headers: {
            'Authorization': `Bearer ${getVaultToken()}`,
        }
    });
    return response.data;
}

export async function getDeviceProfileList() {
    const response = await axios.get(`${EDGEX_API_URL}/deviceprofile/all`, {
        headers: {
            'Authorization': `Bearer ${getVaultToken()}`,
        }
    });
    return response.data;
}

export async function deleteDeviceProfileByName(name: string) {
    const response = await axios.delete(`${EDGEX_API_URL}/deviceprofile/name/${name}`, {
        headers: {
            'Authorization': `Bearer ${getVaultToken()}`,
        }
    });
    return response.data;
}
//#endregion Device Profile

//#region Device Service
export async function getDeviceServiceList() {
    const response = await axios.get(`${EDGEX_API_URL}/deviceservice/all`, {
        headers: {
            'Authorization': `Bearer ${getVaultToken()}`,
        }
    });
    return response.data;
}

export async function getDeviceServiceByName(name: string) {
    const response = await axios.get(`${EDGEX_API_URL}/deviceservice/name/${name}`, {
        headers: {
            'Authorization': `Bearer ${getVaultToken()}`,
        }
    });
    return response.data;
}
//#endregion Device Service

//#region Device
export async function createDevice(data: any) {
    const response = await axios.post(`${EDGEX_API_URL}/device`, data, {
        headers: {
            'Authorization': `Bearer ${getVaultToken()}`,
        }
    });
    return response.data;
}

export async function updateDevice(data: any) {
    const response = await axios.patch(`${EDGEX_API_URL}/device`, data, {
        headers: {
            'Authorization': `Bearer ${getVaultToken()}`,
        }
    });
    return response.data;
}

export async function getDeviceByProfileName(name: string) {
    const response = await axios.get(`${EDGEX_API_URL}/device/profile/name/${name}`, {
        headers: {
            'Authorization': `Bearer ${getVaultToken()}`,
        }
    });
    return response.data;
}

export async function getDeviceByServiceName(name: string) {
    const response = await axios.get(`${EDGEX_API_URL}/device/service/name/${name}`, {
        headers: {
            'Authorization': `Bearer ${getVaultToken()}`,
        }
    });
    return response.data;
}

export async function getDeviceByName(name: string) {
    const response = await axios.get(`${EDGEX_API_URL}/device/name/${name}`, {
        headers: {
            'Authorization': `Bearer ${getVaultToken()}`,
        }
    });
    return response.data;
}

export async function getDeviceList() {
    const response = await axios.get(`${EDGEX_API_URL}/device/all`, {
        headers: {
            'Authorization': `Bearer ${getVaultToken()}`,
        }
    });
    return response.data;
}

export async function deleteDeviceByName(name: string) {
    const response = await axios.delete(`${EDGEX_API_URL}/device/name/${name}`, {
        headers: {
            'Authorization': `Bearer ${getVaultToken()}`,
        }
    });
    return response.data;
}
//#endregion Device
