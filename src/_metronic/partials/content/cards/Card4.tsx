import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useAuth } from "../../../../app/modules/auth";
import { updateDashboard } from "../../../../app/modules/dashboard/api/DashboardAPI";
import { removeDashboard } from "../../../../app/modules/dashboard/api/DashboardHelper";
import { EditDashboard } from "../../../../app/modules/dashboard/components/AddEditDashboard/EditDashboard";
import { KTIcon, toAbsoluteUrl } from "../../../helpers";

type Props = {
  id: string;
  url: string;
  icon: string;
  title: string;
  description: string;
  onGetDashboardList: () => void;
};

const Card4: FC<Props> = ({ id, url, icon, title, description, onGetDashboardList }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { id: userId } = currentUser || { id: "" };
  const [showEditDashboard, setShowEditDashboard] = useState({
    id: "",
    edit: false,
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
          name: title,
          description: description,
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

  return (
    <>
      <div className="card h-100">
        <div className="card-body d-flex justify-content-center text-center flex-column p-8">
          <div className="d-flex justify-content-end">
            <button
              type="button"
              className="btn btn-clean btn-sm btn-icon btn-icon-primary btn-active-light-primary me-n3"
              data-kt-menu-trigger="click"
              data-kt-menu-placement="bottom-end"
            >
              <KTIcon iconName="category" className="fs-2 p-0" />
            </button>
            <div className="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-bold fs-7 w-125px py-4" data-kt-menu="true">
              <div className="menu-item px-3" onClick={onEditDashboard}>
                <a className="menu-link px-3">Edit</a>
              </div>
              <div className="menu-item px-3" onClick={onDeleteDashboard}>
                <a className="menu-link px-3">Delete</a>
              </div>
            </div>
          </div>
          <a className="text-gray-800 text-hover-primary d-flex flex-column" onClick={() => navigate(url)} style={{ cursor: "pointer" }}>
            <div className="symbol symbol-75px mb-6">
              <img src={toAbsoluteUrl(icon)} alt="" />
            </div>
            <div className="fs-5 fw-bolder mb-2">{title}</div>
          </a>
          <div className="fs-7 fw-bold text-gray-500 m-auto">{description}</div>
        </div>
      </div>
      {showEditDashboard.edit && <EditDashboard id={showEditDashboard.id} onCloseEditDashboard={onCloseEditDashboard} onGetDashboardList={onGetDashboardList} />}
    </>
  );
};

export { Card4 };
