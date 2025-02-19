import { useQuery } from "@tanstack/react-query";
import { FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { deleteIntegration, getIntegration } from "../../../../api/IntegrationAPI";

type Props = {
  kind: string | undefined;
};

const IntegrationActionsCell: FC<Props> = ({ kind }) => {
  const navigate = useNavigate();
  const params = useParams();
  const applicationId = params.id as string;
  const filterIntegration = {
    limit: 10,
    offset: 0,
    applicationId,
  };
  const integrationListQuery = useQuery({
    queryKey: [`integrationList`, filterIntegration],
    queryFn: async () => getIntegration(filterIntegration),
    enabled: false,
  });

  const openEditIntegrationPage = () => {
    navigate(`/applications/${applicationId}/integrations/${kind}`);
  };

  const openDeleteIntegrationPage = () => {
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
        deleteIntegration({ applicationId, kind })
          .then(() => {
            toast.success("Integration deleted successfully");
            integrationListQuery.refetch();
          })
          .catch((error) => toast.error(error.message));
      }
    });
  };

  return (
    <>
      <button type="button" className="btn btn-light btn-light-primary btn-sm me-2" onClick={openEditIntegrationPage}>
        View
      </button>
      <button type="button" className="btn btn-light btn-danger btn-sm" onClick={openDeleteIntegrationPage}>
        Delete
      </button>
    </>
  );
};

export { IntegrationActionsCell };
