import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ColumnInstance, Row, useTable } from "react-table";
import { KTCard, KTCardBody } from "../../../../../_metronic/helpers";
import { getDashboardList } from "../../api/DashboardAPI";
import { Dashboard } from "../../api/_models";
import { AddDashboard } from "../AddEditDashboard/AddDashboard";
import { DashboardListHeader } from "./DashboardListHeader";
import { CustomHeaderColumn } from "./columns/CustomHeaderColumn";
import { CustomRow } from "./columns/CustomRow";
import { dashboardColumns } from "./columns/_columns";
import { DashboardListLoading } from "./pagination/DashboardListLoading";
// import { DashboardListPagination } from "./pagination/DashboardListPagination";
import { Card4 } from "../../../../../_metronic/partials/content/cards/Card4";

const DashboardList = () => {
  const [view, setView] = useState("icon");
  const [showAddDashboard, setShowAddDashboard] = useState(false);
  const [filterDashboard, setFilterDashboard] = useState({
    limit: 10,
    page: 0,
    name: "",
  });

  const dashboardListQuery = useQuery({
    queryKey: [`dashboardList`, filterDashboard],
    queryFn: async () => getDashboardList(filterDashboard),
  });
  const isLoading = dashboardListQuery.isLoading;
  const data = useMemo(() => dashboardListQuery.data?.groups || [], [dashboardListQuery.data]);
  // const data = [
  //   {
  //     id: "1",
  //     name: "Dashboard 1",
  //     description: "3 widgets",
  //     created_at: "2021-09-01",
  //     updated_at: "2021-09-01",
  //   },
  //   {
  //     id: "2",
  //     name: "Dashboard 2",
  //     description: "2 widgets",
  //     created_at: "2021-09-01",
  //     updated_at: "2021-09-01",
  //   },
  //   {
  //     id: "3",
  //     name: "Dashboard 3",
  //     description: "4 widgets",
  //     created_at: "2021-09-01",
  //     updated_at: "2021-09-01",
  //   },
  //   {
  //     id: "4",
  //     name: "Dashboard 4",
  //     description: "3 widgets",
  //     created_at: "2021-09-01",
  //     updated_at: "2021-09-01",
  //   },
  //   {
  //     id: "5",
  //     name: "Dashboard 5",
  //     description: "1 widget",
  //     created_at: "2021-09-01",
  //     updated_at: "2021-09-01",
  //   },
  //   {
  //     id: "6",
  //     name: "Dashboard 6",
  //     description: "2 widgets",
  //     created_at: "2021-09-01",
  //     updated_at: "2021-09-01",
  //   },
  //   {
  //     id: "7",
  //     name: "Dashboard 7",
  //     description: "1 widget",
  //     created_at: "2021-09-01",
  //     updated_at: "2021-09-01",
  //   },
  // ];
  const columns = useMemo(() => dashboardColumns, []);
  const { getTableProps, getTableBodyProps, headers, rows, prepareRow } = useTable({
    columns,
    data,
  });

  const onGetDashboardList = () => {
    dashboardListQuery.refetch();
  };

  const onShowAddDashboard = () => {
    setShowAddDashboard(true);
  };

  const onCloseAddDashboard = () => {
    setShowAddDashboard(false);
  };

  console.log("dashboardListQuery", dashboardListQuery);

  return (
    <KTCard>
      <DashboardListHeader view={view} setView={setView} onShowAddDashboard={onShowAddDashboard} setFilterDashboard={setFilterDashboard} />
      <KTCardBody className="py-4">
        {view === "icon" && (
          <div className="row">
            {rows.map((row: Row<Dashboard>) => {
              return (
                <div className="col-12 col-xl-2 col-lg-3 col-md-4 mb-5" key={row.original.id}>
                  <Card4
                    id={row.original.id}
                    url={`/dashboard/${row.original.id}/view`}
                    icon="media/svg/files/folder-document.svg"
                    title={row.original.name}
                    description={row.original.description}
                    onGetDashboardList={onGetDashboardList}
                  />
                </div>
              );
            })}
          </div>
        )}
        {view === "list" && (
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
        )}
        {/* <DashboardListPagination filterDashboard={filterDashboard} setFilterDashboard={setFilterDashboard} /> */}
        {showAddDashboard && <AddDashboard onCloseAddDashboard={onCloseAddDashboard} onGetDashboardList={onGetDashboardList} />}
        {isLoading && <DashboardListLoading />}
      </KTCardBody>
    </KTCard>
  );
};

export { DashboardList };
