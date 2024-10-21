import { useQuery } from "@tanstack/react-query";
import { FC, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useAuth } from "../../../../auth";
import { getDashboardList, updateDashboard } from "../../../api/DashboardAPI";
import { removeDashboard } from "../../../api/DashboardHelper";
import { EditDashboard } from "../../AddEditDashboard/EditDashboard";

type Props = {
  id: string;
};

const DashboardActionsCell: FC<Props> = ({ id }) => {
  const { currentUser } = useAuth();
  const { id: userId } = currentUser || { id: "" };
  const [showEditDashboard, setShowEditDashboard] = useState({
    id: "",
    edit: false,
  });
  const dashboardListQuery = useQuery({
    queryKey: [`dashboardList`, userId],
    queryFn: async () => getDashboardList(userId).catch((error) => toast.error(error.message)),
    enabled: false,
  });

  const onDeleteDashboard = () => {
    Swal.fire({
      heightAuto: false,
      icon: "warning",
      title: "Delete Dashboard",
      text: "Are you sure you want to delete this dashboard?",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#d33",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        const payload = removeDashboard({
          id: id,
        });
        updateDashboard(userId, payload)
          .then(() => {
            toast.success("Dashboard deleted successfully");
            onGetDashboardList();
          })
          .catch((error) => toast.error(error.message));
      }
    });
  };

  const onEditDashboard = () => {
    setShowEditDashboard({
      id: id,
      edit: true,
    });
  };

  const onCloseEditDashboard = () => {
    setShowEditDashboard({
      id: "",
      edit: false,
    });
  };

  const onGetDashboardList = () => {
    dashboardListQuery.refetch();
  };

  return (
    <>
      <button type="button" className="btn btn-light btn-light-primary btn-sm me-2" onClick={onEditDashboard}>
        Edit
      </button>
      <button type="button" className="btn btn-light btn-light-danger btn-sm" onClick={onDeleteDashboard}>
        Delete
      </button>
      {showEditDashboard.edit && <EditDashboard id={showEditDashboard.id} onCloseEditDashboard={onCloseEditDashboard} onGetDashboardList={onGetDashboardList} />}
    </>
  );
};

export { DashboardActionsCell };
