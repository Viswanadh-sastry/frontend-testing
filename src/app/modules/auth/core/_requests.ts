import axios from "axios";
import { AuthModel, UserModel } from "./_models";

const API_URL = import.meta.env.VITE_APP_API_URL;

export const GET_USER_DETAILS = `${API_URL}/users/profile`;
export const REFRESH_URL = `${API_URL}/users/tokens/refresh`;
export const LOGIN_URL = `${API_URL}/users/tokens/issue`;
export const REGISTER_URL = `${API_URL}/users`;
export const REQUEST_PASSWORD_URL = `${API_URL}/forgot_password`;

export async function login(identity: string, secret: string) {
  const response = await axios.post<AuthModel>(LOGIN_URL, {
    identity,
    secret,
  });
  return response.data;
}

export async function loginWithDomain(identity: string, secret: string, domain_id: string) {
  const response = await axios.post<AuthModel>(LOGIN_URL, {
    identity,
    secret,
    domain_id,
  });
  return response.data;
}

export async function register(
  name: string,
  identity: string,
  secret: string,
) {
  const response = await axios.post(REGISTER_URL, {
    credentials: {
      identity: identity,
      secret: secret
    },
    name: name
  });
  return response.data;
}

export async function refresh(refresh_token: string, domain_id: string) {
  const response = await axios.post<AuthModel>(REFRESH_URL, {
    refresh_token,
    domain_id,
  });
  return response.data;
}

export async function requestPassword(email: string) {
  const response = await axios.post<{ result: boolean }>(REQUEST_PASSWORD_URL, {
    email,
  });
  return response.data;
}

export async function getUserDetails() {
  const response = await axios.get<UserModel>(GET_USER_DETAILS);
  return response.data;
}

// EdgeX 3.1.1 authentication API

export const AUTH_URL = `${API_URL}`;

export async function authenticate(username: string, password: string) {
  const response = await axios.post<any>(`${AUTH_URL}/v1/auth/userpass/login/${username}`, {
    password
  });
  return response.data;
}

export async function validateToken(username: string, token: string) {
  const response = await axios.get<any>(`${AUTH_URL}/v1/identity/oidc/token/${username}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
}
