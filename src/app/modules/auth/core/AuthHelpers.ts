import { getJWTToken, getTokenByUsername } from '../../users/api/VaultAPI';
import { refresh } from "../core/_requests";
import { AuthModel } from './_models';
import { getCred } from "./CredentialHelpers";
import { getDAuth, getDomain } from "./DomainHelpers";
import { setVaultClientToken, setVaultToken } from "./VaultHelpers";

const AUTH_LOCAL_STORAGE_KEY = 'rapid-auth'
const USER_LOCAL_STORAGE_KEY = 'rapid-user'
const getAuth = (): AuthModel | undefined => {
  if (!localStorage) {
    return
  }

  const lsValue: string | null = localStorage.getItem(AUTH_LOCAL_STORAGE_KEY)
  if (!lsValue) {
    return
  }

  try {
    const auth: AuthModel = JSON.parse(lsValue) as AuthModel
    if (auth) {
      // You can easily check auth_token expiration also
      return auth
    }
  } catch (error) {
    console.error('AUTH LOCAL STORAGE PARSE ERROR', error)
  }
}

const setAuth = (auth: AuthModel) => {
  if (!localStorage) {
    return
  }

  try {
    const lsValue = JSON.stringify(auth)
    localStorage.setItem(AUTH_LOCAL_STORAGE_KEY, lsValue)
  } catch (error) {
    console.error('AUTH LOCAL STORAGE SAVE ERROR', error)
  }
}

const removeAuth = () => {
  if (!localStorage) {
    return
  }

  try {
    localStorage.removeItem(AUTH_LOCAL_STORAGE_KEY)
  } catch (error) {
    console.error('AUTH LOCAL STORAGE REMOVE ERROR', error)
  }
}

const getUser = (): any => {
  if (!localStorage) {
    return '';
  }

  const lsValue: string | null = localStorage.getItem(USER_LOCAL_STORAGE_KEY)
  if (!lsValue) {
    return '';
  }

  try {
    const user: any = JSON.parse(lsValue) as any
    if (user) {
      return user
    }
  } catch (error) {
    console.error('USER LOCAL STORAGE PARSE ERROR', error)
  }
}

const setUser = (user: any) => {
  if (!localStorage) {
    return
  }

  try {
    const lsValue = JSON.stringify(user)
    localStorage.setItem(USER_LOCAL_STORAGE_KEY, lsValue)
  } catch (error) {
    console.error('USER LOCAL STORAGE SAVE ERROR', error)
  }
}

const removeUser = () => {
  if (!localStorage) {
    return
  }

  try {
    localStorage.removeItem(USER_LOCAL_STORAGE_KEY)
  } catch (error) {
    console.error('USER LOCAL STORAGE REMOVE ERROR', error)
  }
}

export function setupAxios(axios: any) {
  axios.defaults.headers.Accept = 'application/json';
  axios.interceptors.request.use(
    (config: any) => {
      const auth = getAuth();
      const dAuth = getDAuth();

      // Enable Referrer-Policy and X-Content-Type-Options
      // config.headers["Referrer-Policy"] = "strict-origin-when-cross-origin";
      // config.headers["X-Content-Type-Options"] = "nosniff";

      // Use Content Security Policy (CSP)
      // config.headers['Content-Security-Policy'] = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';";

      if (config.url.includes('chirp.meridiandatalabs.com')) {
        return config;
      }
      if (dAuth && dAuth.access_token) {
        if (!config.headers.Authorization) {
          config.headers.Authorization = `Bearer ${dAuth.access_token}`
        }
      } else if (auth && auth.access_token) {
        if (!config.headers.Authorization) {
          config.headers.Authorization = `Bearer ${auth.access_token}`
        }
      }
      return config
    },
    (err: any) => Promise.reject(err)
  );

  // Response interceptor to handle 401 errors
  axios.interceptors.response.use(
    (response: any) => response,
    async (error: any) => {
      const originalRequest = error.config;
      // console.log('error interceptors', error, originalRequest, JSON.stringify(error));
      if (error && error.response && error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          if (isLORAUnauthorized(error)) {
            // reload the current page
            window.location.reload();
          }
          const { id } = getDomain();
          const { refresh_token = '' } = getAuth() || {};
          const newAuth = await refresh(refresh_token, id);
          setAuth(newAuth); // Save the new auth data, including access_token and refresh_token

          // Get the vault token and set it in the axios headers
          const { identity } = getCred() || {};
          const username = identity?.split("@")[0] || '';
          const vault = await getTokenByUsername(username);
          const vaultToken = await getJWTToken(username, vault.token);
          setVaultToken(vaultToken.data.token);
          setVaultClientToken(vault.token);

          if (!originalRequest.headers.Authorization) {
            originalRequest.headers.Authorization = `Bearer ${newAuth.access_token}`;
          }
          return axios(originalRequest); // Retry the original request
        } catch (refreshError) {
          // Handle refresh token failure, e.g., log out the user
          console.error('Failed to refresh token', refreshError);
          // Optionally, redirect to login page
          // window.location.href = '/auth/login';
        }
      }
      return Promise.reject(error);
    }
  );
}

const isLORAUnauthorized = (error: any) => {
  // Check url for LORA API
  if (error && error.config && error.config.url && error.config.url.includes('chirp.meridiandatalabs.com') && (!localStorage.getItem("lora_unauthorized") || localStorage.getItem("lora_unauthorized") === "false")) {
    localStorage.setItem("lora_unauthorized", "true");
    return true;
  }
  return false;
}

export { AUTH_LOCAL_STORAGE_KEY, getAuth, getUser, removeAuth, removeUser, setAuth, setUser };

