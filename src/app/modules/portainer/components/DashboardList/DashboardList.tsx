import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { ColumnInstance, Row, useTable } from "react-table";
import { toast } from "react-toastify";
import { KTCard, KTCardBody } from "../../../../../_metronic/helpers";
import { useAuth } from "../../../auth";
import { getDashboardList } from "../../api/DashboardAPI";
import { setDashboard } from "../../api/DashboardHelper";
import { Dashboard } from "../../api/_models";
import { AddDashboard } from "../AddEditDashboard/AddDashboard";
import { DashboardListHeader } from "./DashboardListHeader";
import { CustomHeaderColumn } from "./columns/CustomHeaderColumn";
import { CustomRow } from "./columns/CustomRow";
import { dashboardColumns } from "./columns/_columns";
import { DashboardListLoading } from "./pagination/DashboardListLoading";
// import { DashboardListPagination } from "./pagination/DashboardListPagination";

const DashboardList = () => {
  const { currentUser } = useAuth();
  const { id: userId } = currentUser || { id: "" };
  const [view, setView] = useState("list");
  const [showAddDashboard, setShowAddDashboard] = useState(false);

  const dashboardListQuery = useQuery({
    queryKey: [`dashboardList`, userId],
    queryFn: async () => getDashboardList(userId).catch((error) => toast.error(error.message)),
    enabled: !!userId,
  });
  const isLoading = dashboardListQuery.isLoading;
  const data = useMemo(() => dashboardListQuery.data?.dashboards.filter((row: Dashboard) => "id" in row && row.id !== "") || [], [dashboardListQuery.data]);
  const columns = useMemo(() => dashboardColumns, []);
  const { getTableProps, getTableBodyProps, headers, rows, prepareRow } = useTable({
    columns,
    data,
  });

  useEffect(() => {
    if (data) {
      setDashboard(data);
    }
  }, [data]);

  const onGetDashboardList = () => {
    dashboardListQuery.refetch();
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
        <div className="table-responsive">
          <table id="kt_table_channels" className="table align-middle table-row-dashed fs-6 dataTable no-footer" {...getTableProps()}>
            <thead>
              <tr className="text-start text-muted fw-bolder fs-7 text-uppercase gs-0">
                {headers.map((column: ColumnInstance<Dashboard>) => (
                  <CustomHeaderColumn key={column.id} column={column} />
                ))}
              </tr>
            </thead>
            <tbody className="text-gray-600" {...getTableBodyProps()}>
              {rows.length > 0 ? (
                rows.map((row: Row<Dashboard>, i) => {
                  prepareRow(row);
                  return <CustomRow row={row} key={`row-${i}-${row.id}`} />;
                })
              ) : (
                <tr>
                  <td colSpan={7}>
                    <div className="d-flex text-center w-100 align-content-center justify-content-center">No matching records found</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* <DashboardListPagination filterDashboard={filterDashboard} setFilterDashboard={setFilterDashboard} /> */}
        {showAddDashboard && <AddDashboard onCloseAddDashboard={onCloseAddDashboard} onGetDashboardList={onGetDashboardList} />}
        {isLoading && <DashboardListLoading />}
      </KTCardBody>
    </KTCard>
  );
};

export { DashboardList };
