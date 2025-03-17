import { useQuery } from "@tanstack/react-query";
import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { getLORAAuth } from "../../../../auth/core/LORAHelpers";
import { deleteApplicationById, getApplication } from "../../../api/ApplicationAPI";

type Props = {
  id: string | undefined;
};

const ApplicationActionsCell: FC<Props> = ({ id }) => {
  const navigate = useNavigate();
  const filterApplication = {
    limit: 10,
    offset: 0,
    tenantId: getLORAAuth()?.tenant_id || "",
  };
  const applicationListQuery = useQuery({
    queryKey: [`applicationList`, filterApplication],
    queryFn: async () => getApplication(filterApplication),
    enabled: false,
  });

  const openEditApplicationPage = () => {
    navigate(`/applications/${id}`);
  };

  const openDeleteApplicationPage = () => {
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
        deleteApplicationById(String(id))
          .then(() => {
            toast.success("Application deleted successfully");
            applicationListQuery.refetch();
          })
          .catch((error) => toast.error(error?.response?.data?.error || "Something went wrong"));
      }
    });
  };

  return (
    <>
      <button type="button" className="btn btn-light btn-light-primary btn-sm me-2" onClick={openEditApplicationPage}>
        View
      </button>
      <button type="button" className="btn btn-light btn-danger btn-sm" onClick={openDeleteApplicationPage}>
        Delete
      </button>
    </>
  );
};

export { ApplicationActionsCell };
