import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { KTCard, KTCardBody } from "../../../../../_metronic/helpers";
import { Card4 } from "../../../../../_metronic/partials/content/cards/Card4";
import { useAuth } from "../../../auth";
import { getDashboardList } from "../../api/DashboardAPI";
import { setDashboard } from "../../api/DashboardHelper";
import { Dashboard } from "../../api/_models";
import { AddDashboard } from "../AddEditDashboard/AddDashboard";
import { DashboardListHeader } from "./DashboardListHeader";
import { DashboardListLoading } from "./pagination/DashboardListLoading";
// import { DashboardListPagination } from "./pagination/DashboardListPagination";

const DashboardIcon = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { id: userId } = currentUser || { id: "" };
  const [view, setView] = useState("icon");
  const [showAddDashboard, setShowAddDashboard] = useState(false);

  const dashboardListQuery = useQuery({
    queryKey: [`dashboardList`, userId],
    queryFn: async () => getDashboardList(userId).catch((error) => toast.error(error.message)),
    enabled: !!userId,
  });
  const isLoading = dashboardListQuery.isLoading;
  const data = useMemo(() => dashboardListQuery.data?.dashboards.filter((row: Dashboard) => "id" in row && row.id !== "") || [], [dashboardListQuery.data]);

  useEffect(() => {
    if (data) {
      setDashboard(data);
    }
  }, [data]);

  const onGetDashboardList = () => {
    navigate("/dashboard");
  };

  const onShowAddDashboard = () => {
    setShowAddDashboard(true);
  };

  const onCloseAddDashboard = () => {
    setShowAddDashboard(false);
  };

  return (
    <KTCard>
      <DashboardListHeader view={view} setView={setView} onShowAddDashboard={onShowAddDashboard} />
      <KTCardBody className="py-4">
        <div className="row">
          {data.length > 0 ? (
            data.map((row: Dashboard) => {
              return (
                <div className="col-12 col-xl-2 col-lg-3 col-md-4 mb-5" key={row.id}>
                  <Card4
                    id={row.id}
                    url={`/dashboard/${row.id}/view`}
                    icon="media/svg/files/folder-document.svg"
                    title={row.name}
                    description={row.description}
                    onGetDashboardList={onGetDashboardList}
                  />
                </div>
              );
            })
          ) : (
            <div className="col-12 text-center my-5 py-5 fs-5 text-muted">No matching records found</div>
          )}
        </div>
        {/* <DashboardListPagination filterDashboard={filterDashboard} setFilterDashboard={setFilterDashboard} /> */}
        {showAddDashboard && <AddDashboard onCloseAddDashboard={onCloseAddDashboard} onGetDashboardList={onGetDashboardList} />}
        {isLoading && <DashboardListLoading />}
      </KTCardBody>
    </KTCard>
  );
};

export { DashboardIcon };
