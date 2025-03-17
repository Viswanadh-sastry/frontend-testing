import { useQuery } from "@tanstack/react-query";
import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { getLORAAuth } from "../../../../auth/core/LORAHelpers";
import { deleteGatewayById, getGateway } from "../../../api/GatewayAPI";

type Props = {
  id: string | undefined;
};

const GatewayActionsCell: FC<Props> = ({ id }) => {
  const navigate = useNavigate();
  const filterGateway = {
    limit: 10,
    offset: 0,
    tenantId: getLORAAuth()?.tenant_id || "",
  };
  const gatewayListQuery = useQuery({
    queryKey: [`gatewayList`, filterGateway],
    queryFn: async () => getGateway(filterGateway),
    enabled: false,
  });

  const openEditGatewayPage = () => {
    navigate(`/gateways/${id}`);
  };

  const openDeleteGatewayPage = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Are you sure you want to delete this record?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      customClass: {
        confirmButton: "btn btn-danger",
        cancelButton: "btn btn-secondary",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        deleteGatewayById(String(id))
          .then(() => {
            toast.success("Gateway deleted successfully");
            gatewayListQuery.refetch();
          })
          .catch((error) => toast.error(error?.response?.data?.error || "Something went wrong"));
      }
    });
  };

  return (
    <>
      <button type="button" className="btn btn-light btn-light-primary btn-sm me-2" onClick={openEditGatewayPage}>
        Edit
      </button>
      <button type="button" className="btn btn-light btn-danger btn-sm" onClick={openDeleteGatewayPage}>
        Delete
      </button>
    </>
  );
};

export { GatewayActionsCell };
