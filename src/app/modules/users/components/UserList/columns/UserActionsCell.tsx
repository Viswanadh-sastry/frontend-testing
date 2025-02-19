import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getRolePermission, MODULENAME } from "../../../../auth/core/RoleHelpers";

type Props = {
  id: string | undefined;
};

const UserActionsCell: FC<Props> = ({ id }) => {
  const navigate = useNavigate();
  const [rolePermission, setRolePermission] = useState<any>(null);

  useEffect(() => {
    const fetchRolePermission = async () => {
      const permission = await getRolePermission(MODULENAME.USERSLIST);
      setRolePermission(permission);
    };
    fetchRolePermission();
  }, []);

  const openEditUserPage = () => {
    navigate(`/users/${id}`);
  };

  return (
    <>
      {rolePermission?.view && (
        <button type="button" className="btn btn-light btn-light-primary btn-sm" onClick={openEditUserPage}>
          View
        </button>
      )}
    </>
  );
};

export { UserActionsCell };
