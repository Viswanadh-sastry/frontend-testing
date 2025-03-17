import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../../../auth/core/Auth";
import * as credHelper from "../../../../auth/core/CredentialHelpers";
import * as domainHelper from "../../../../auth/core/DomainHelpers";
import { getUserDetails, loginWithDomain } from "../../../../auth/core/_requests";
import * as roleHelper from "../../../../auth/core/RoleHelpers";

type Props = {
  domainId: string;
  domainName: string;
  permission: string;
};

const UserActionsCell: FC<Props> = ({ domainId, domainName, permission }) => {
  const navigate = useNavigate();
  const { saveAuth, setCurrentUser } = useAuth();

  const selectDomainToLogin = async () => {
    if (!domainId) {
      toast.info("Please select a organization");
      return;
    }
    const { identity, secret } = credHelper.getCred() || {};
    if (!identity || !secret) {
      toast.error("No identity or secret found");
      return;
    }
    loginWithDomain(identity, secret, domainId)
      .then(async (auth) => {
        if (!auth.access_token) {
          throw new Error("No access token found");
        }

        roleHelper.setRole(permission || "");

        // credHelper.removeCred();
        domainHelper.removeDAuth();
        domainHelper.setDomain({ id: domainId, name: domainName });

        saveAuth(auth);
        const user = await getUserDetails();

        setCurrentUser(user);
        navigate("/");
        window.location.reload();
      })
      .catch((error) => {
        toast.error(error?.response?.data?.error || "Something went wrong");
        saveAuth(undefined);
      });
  };

  return (
    <>
      <button type="button" className="btn btn-light btn-light-primary btn-sm" onClick={selectDomainToLogin}>
        Select
      </button>
    </>
  );
};

export { UserActionsCell };
