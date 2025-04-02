import { useQuery } from "@tanstack/react-query";
import { FC, useEffect } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../../app/modules/auth";
import { toAbsoluteUrl } from "../../../helpers";
import { removeRole } from "../../../../app/modules/auth/core/RoleHelpers";
import * as domainHelper from "../../../../app/modules/auth/core/DomainHelpers";
import * as credHelper from "../../../../app/modules/auth/core/CredentialHelpers";
import * as vaultHelper from "../../../../app/modules/auth/core/VaultHelpers";
import { getProfile } from "../../../../app/modules/profile/api/ProfileAPI";
import { setUser } from "../../../../app/modules/auth/core/AuthHelpers";

const HeaderUserMenu: FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const profileQuery = useQuery({
    queryKey: [`profile`],
    queryFn: async () => getProfile().catch((error) => toast.error(error?.response?.data?.message || "Something went wrong")),
    enabled: true,
  });
  const profile = profileQuery.data;

  useEffect(() => {
    if (profileQuery.data) {
      setUser(profileQuery.data);
      // roleHelper.setRole(profileQuery.data.role || "");
    }
  }, [profileQuery.data]);

  const logoutUser = () => {
    logout();
    domainHelper.removeDAuth();
    domainHelper.removeDomain();
    removeRole();
    credHelper.removeCred();
    vaultHelper.removeVaultToken();
    vaultHelper.removeVaultClientToken();
    // loraHelper.removeLORAAuth();
    navigate("/auth/login");
  };

  return (
    <div className="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg menu-state-primary fw-bold py-4 fs-6 w-275px" data-kt-menu="true">
      <div className="menu-item px-3">
        <div className="menu-content d-flex align-items-center px-3">
          <div className="symbol symbol-50px me-5">
            <img alt="Logo" src={toAbsoluteUrl("media/avatars/blank.png")} />
          </div>

          <div className="d-flex flex-column">
            <div className="fw-bolder d-flex align-items-center fs-5">
              {currentUser?.name || profile?.name}
              {/* <span className="badge badge-light-success fw-bolder fs-8 px-2 py-1 ms-2">Pro</span> */}
            </div>
            <div className="fw-bold text-muted fs-7">{currentUser?.role || profile?.role}</div>
          </div>
        </div>
      </div>

      <div className="separator my-2"></div>

      <div className="menu-item px-5">
        <Link to={currentUser?.name ? "/profile" : "/domain/profile"} className="menu-link px-5">
          My Profile
        </Link>
      </div>

      <div className="separator my-2"></div>

      <div className="menu-item px-5">
        <Link to={currentUser?.name ? "/builder" : "/domain/builder"} className="menu-link px-5">
          Layout Builder
        </Link>
      </div>

      <div className="menu-item px-5">
        <a onClick={logoutUser} className="menu-link px-5">
          Sign Out
        </a>
      </div>
    </div>
  );
};

export { HeaderUserMenu };
