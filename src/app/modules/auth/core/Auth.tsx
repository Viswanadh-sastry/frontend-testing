/* eslint-disable react-refresh/only-export-components */
import { FC, useState, useEffect, createContext, useContext, Dispatch, SetStateAction } from "react";
import { LayoutSplashScreen } from "../../../../_metronic/layout/core";
import { AuthModel, UserModel } from "./_models";
import * as authHelper from "./AuthHelpers";
import { getUserDetails } from "./_requests";
import { WithChildren } from "../../../../_metronic/helpers";
import { UnauthorizedLORAModal } from "../components/UnauthorizedLORAModal";

type AuthContextProps = {
  auth: AuthModel | undefined;
  saveAuth: (auth: AuthModel | undefined) => void;
  currentUser: UserModel | undefined;
  setCurrentUser: Dispatch<SetStateAction<UserModel | undefined>>;
  logout: () => void;
};

const initAuthContextPropsState = {
  auth: authHelper.getAuth(),
  saveAuth: () => {},
  currentUser: undefined,
  setCurrentUser: () => {},
  logout: () => {},
};

const AuthContext = createContext<AuthContextProps>(initAuthContextPropsState);

const useAuth = () => {
  return useContext(AuthContext);
};

const AuthProvider: FC<WithChildren> = ({ children }) => {
  const [isLORAUnauthorized, setIsLORAUnauthorized] = useState(false);
  const [auth, setAuth] = useState<AuthModel | undefined>(authHelper.getAuth());
  const [currentUser, setCurrentUser] = useState<UserModel | undefined>();

  useEffect(() => {
    if (localStorage.getItem("lora_unauthorized") === "true") {
      setIsLORAUnauthorized(true);
    } else {
      setIsLORAUnauthorized(false);
    }
  }, [localStorage.getItem("lora_unauthorized") === "true" || localStorage.getItem("lora_unauthorized") === "false"]);

  const saveAuth = (auth: AuthModel | undefined) => {
    setAuth(auth);
    if (auth) {
      authHelper.setAuth(auth);
    } else {
      authHelper.removeAuth();
      authHelper.removeUser();
    }
  };

  const logout = () => {
    saveAuth(undefined);
    setCurrentUser(undefined);
  };

  return (
    <AuthContext.Provider value={{ auth, saveAuth, currentUser, setCurrentUser, logout }}>
      {children}
      {isLORAUnauthorized && <UnauthorizedLORAModal />}
    </AuthContext.Provider>
  );
};

const AuthInit: FC<WithChildren> = ({ children }) => {
  const { auth, currentUser, logout, setCurrentUser } = useAuth();
  const [showSplashScreen, setShowSplashScreen] = useState(true);

  // We should request user by authToken (IN OUR EXAMPLE IT'S API_TOKEN) before rendering the application
  useEffect(() => {
    const requestUser = async () => {
      try {
        if (!currentUser) {
          const data = await getUserDetails();
          if (data) {
            setCurrentUser(data);
          }
        }
      } catch (error) {
        console.error(error);
        if (currentUser) {
          logout();
        }
      } finally {
        setShowSplashScreen(false);
      }
    };

    if (auth && auth.access_token) {
      requestUser();
    } else {
      logout();
      setShowSplashScreen(false);
    }
  }, [auth, currentUser, logout, setCurrentUser]);

  return showSplashScreen ? <LayoutSplashScreen /> : <>{children}</>;
};

export { AuthProvider, AuthInit, useAuth };
