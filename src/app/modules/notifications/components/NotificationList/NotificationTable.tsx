import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ColumnInstance, Row, useTable } from "react-table";
import { KTCard, KTCardBody } from "../../../../../_metronic/helpers";
import { getNotification } from "../../api/NotificationAPI";
import { Notification } from "../../api/_models";
import { NotificationListHeader } from "./NotificationListHeader";
import { CustomHeaderColumn } from "./columns/CustomHeaderColumn";
import { CustomRow } from "./columns/CustomRow";
import { notificationsColumns } from "./columns/_columns";
import { NotificationListLoading } from "./pagination/NotificationListLoading";
import { NotificationListPagination } from "./pagination/NotificationListPagination";
import { SelectedValuesProvider } from "../../NotificationContext";

const NotificationTable = () => {
  const [filterNotification, setFilterNotification] = useState({
    limit: 10,
    offset: 0,
    status: "NEW",
    from: 0,
    to: 0,
  });
  const notificationListQuery = useQuery({
    queryKey: [`notificationList`, filterNotification],
    queryFn: async () => getNotification(filterNotification),
    enabled: true,
  });

  const isLoading = notificationListQuery.isLoading;
  const data = useMemo(() => notificationListQuery.data?.notifications || [], [notificationListQuery.data]);
  const columns = useMemo(() => notificationsColumns, []);
  const { getTableProps, getTableBodyProps, headers, rows, prepareRow } = useTable({
    columns,
    data,
  });

  return (
    <SelectedValuesProvider>
      <KTCard>
        <NotificationListHeader setFilterNotification={setFilterNotification} filterNotification={filterNotification} notificationListQuery={notificationListQuery} />
        <KTCardBody className="py-4">
          <div className="table-responsive">
            <table id="kt_table_notifications" className="table align-middle table-row-dashed fs-6 dataTable no-footer" {...getTableProps()}>
              <thead>
                <tr className="text-start text-muted fw-bolder fs-7 text-uppercase gs-0">
                  {headers.map((column: ColumnInstance<Notification>) => (
                    <CustomHeaderColumn key={column.id} column={column} />
                  ))}
                </tr>
              </thead>
              <tbody className="text-gray-600" {...getTableBodyProps()}>
                {rows.length > 0 ? (
                  rows.map((row: Row<Notification>, i) => {
                    prepareRow(row);
                    return <CustomRow row={row} key={`row-${i}-${row.id}`} />;
                  })
                ) : (
                  <tr>
                    <td colSpan={10}>
                      <div className="d-flex text-center w-100 align-content-center justify-content-center">No matching records found</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <NotificationListPagination filterNotification={filterNotification} setFilterNotification={setFilterNotification} />
          {isLoading && <NotificationListLoading />}
        </KTCardBody>
      </KTCard>
    </SelectedValuesProvider>
  );
};

export { NotificationTable };
