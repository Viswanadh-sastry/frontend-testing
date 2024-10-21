import { Dispatch, SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
import { KTIcon } from "../../../../../_metronic/helpers";

interface IDashboardListHeaderProps {
  view: string;
  setView: Dispatch<SetStateAction<string>>;
  onShowAddDashboard: () => void;
}

const DashboardListHeader = ({ view, setView, onShowAddDashboard }: IDashboardListHeaderProps) => {
  const navigate = useNavigate();
  return (
    <>
      <div className="card-header border-0 pt-6">
        <div className="card-title">
          {/* begin::Search */}
          <div className="d-flex align-items-center position-relative my-1">
            <input type="text" className="form-control form-control form-control-lg mx-2" placeholder="Search" onChange={(e) => e.preventDefault()} />
          </div>
          {/* end::Search */}
        </div>

        <div className="card-toolbar">
          <div className="d-flex justify-content-end" data-kt-dashboard-table-toolbar="base">
            <button type="button" className="btn btn-primary mx-2" onClick={onShowAddDashboard}>
              <KTIcon iconName="plus" className="fs-2" />
              Add Dashboard
            </button>
            <button type="button" className="btn btn-light-primary" data-kt-menu-trigger="click" data-kt-menu-placement="bottom-end">
              <KTIcon iconName={view === "icon" ? "abstract-29" : "abstract-14"} className="fs-2 p-0" />
            </button>
            <div className="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-bold fs-7 w-125px py-4" data-kt-menu="true">
              <div
                className="menu-item px-3"
                onClick={() => {
                  setView("icon");
                  navigate("/dashboard/icon");
                }}
              >
                <a className="menu-link px-3">Icon</a>
              </div>
              <div
                className="menu-item px-3"
                onClick={() => {
                  setView("list");
                  navigate("/dashboard/list");
                }}
              >
                <a className="menu-link px-3">List</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export { DashboardListHeader };
