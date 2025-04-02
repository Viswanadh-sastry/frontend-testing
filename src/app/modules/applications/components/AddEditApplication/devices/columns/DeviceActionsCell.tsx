import { useQuery } from "@tanstack/react-query";
import { FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { deleteDeviceById, deleteKeysById, getDevice } from "../../../../api/DeviceAPI";

type Props = {
  id: string | undefined;
};

const DeviceActionsCell: FC<Props> = ({ id }) => {
  const navigate = useNavigate();
  const params = useParams();
  const applicationId = params.id as string;
  const filterDevice = {
    limit: 10,
    offset: 0,
    applicationId: applicationId,
  };
  const deviceListQuery = useQuery({
    queryKey: [`deviceList`, filterDevice],
    queryFn: async () => getDevice(filterDevice).catch((error) => toast.error(error?.response?.data?.message || "Something went wrong")),
    enabled: false,
  });

  const openEditDevicePage = () => {
    navigate(`/applications/${applicationId}/devices/${id}`);
  };

  const openDeleteDevicePage = () => {
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
        deleteKeysById(String(id)).catch((error) => toast.error(error?.response?.data?.message || "Something went wrong"));
        deleteDeviceById(String(id))
          .then(() => {
            toast.success("Device deleted successfully");
            deviceListQuery.refetch();
          })
          .catch((error) => toast.error(error?.response?.data?.message || "Something went wrong"));
      }
    });
  };

  return (
    <>
      <button type="button" className="btn btn-light btn-light-primary btn-sm me-2" onClick={openEditDevicePage}>
        View
      </button>
      <button type="button" className="btn btn-light btn-danger btn-sm" onClick={openDeleteDevicePage}>
        Delete
      </button>
    </>
  );
};

export { DeviceActionsCell };
