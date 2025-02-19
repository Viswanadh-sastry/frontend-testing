import { useQuery } from "@tanstack/react-query";
import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { getLORAAuth } from "../../../../auth/core/LORAHelpers";
import { deleteDeviceProfileById, getDeviceProfile } from "../../../api/DeviceProfileAPI";

type Props = {
  id: string | undefined;
};

const DeviceProfileActionsCell: FC<Props> = ({ id }) => {
  const navigate = useNavigate();
  const filterDeviceProfile = {
    limit: 10,
    offset: 0,
    tenantId: getLORAAuth()?.tenant_id || "",
  };
  const deviceProfileListQuery = useQuery({
    queryKey: [`deviceProfileList`, filterDeviceProfile],
    queryFn: async () => getDeviceProfile(filterDeviceProfile),
    enabled: false,
  });

  const openEditDeviceProfilePage = () => {
    navigate(`/device-profiles/${id}`);
  };

  const openDeleteDeviceProfilePage = () => {
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
        deleteDeviceProfileById(String(id))
          .then(() => {
            toast.success("Device Profile deleted successfully");
            deviceProfileListQuery.refetch();
          })
          .catch((error) => toast.error(error.message));
      }
    });
  };

  return (
    <>
      <button type="button" className="btn btn-light btn-light-primary btn-sm me-2" onClick={openEditDeviceProfilePage}>
        Edit
      </button>
      <button type="button" className="btn btn-light btn-danger btn-sm" onClick={openDeleteDeviceProfilePage}>
        Delete
      </button>
    </>
  );
};

export { DeviceProfileActionsCell };
