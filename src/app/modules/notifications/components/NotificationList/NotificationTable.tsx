import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { ColumnInstance, Row, useTable } from "react-table";
import { KTCard, KTCardBody, PaginationState } from "../../../../../_metronic/helpers";
import { getNotificationByStatus } from "../../api/NotificationAPI";
import { Notification } from "../../api/_models";
import { NotificationListHeader } from "./NotificationListHeader";
import { CustomHeaderColumn } from "./columns/CustomHeaderColumn";
import { CustomRow } from "./columns/CustomRow";
import { notificationsColumns } from "./columns/_columns";
import { NotificationListLoading } from "./pagination/NotificationListLoading";
import { NotificationListPagination } from "./pagination/NotificationListPagination";
import { SelectedValuesProvider } from "../../NotificationContext";

const NotificationTable = () => {
  const [data, setData] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<any>(10);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    items_per_page: 10,
    links: [],
  });
  const [notificationList, setNotificationList] = useState<any>([]);
  const [filterNotification, setFilterNotification] = useState({
    status: "new",
    from: 0,
    to: 0,
  });
  const notificationListQuery = useQuery({
    queryKey: [`notificationList`, filterNotification.status],
    queryFn: async () => getNotificationByStatus(filterNotification.status),
    enabled: true,
  });

  const isLoading = notificationListQuery.isLoading;

  useEffect(() => {
    if (notificationListQuery.data?.notifications) {
      setNotificationList(notificationListQuery.data.notifications || []);
    }
  }, [notificationListQuery.data?.notifications]);
  useEffect(() => {
    setData(
      notificationList.filter((_: any, index: number) => {
        return index >= (currentPage - 1) * itemsPerPage && index < currentPage * itemsPerPage;
      })
    );
  }, [notificationList, currentPage, itemsPerPage]);

  const columns = useMemo(() => notificationsColumns, []);
  const { getTableProps, getTableBodyProps, headers, rows, prepareRow } = useTable({
    columns,
    data,
  });

  return (
    <SelectedValuesProvider>
      <KTCard>
        <NotificationListHeader
          setCurrentPage={setCurrentPage}
          setPagination={setPagination}
          setFilterNotification={setFilterNotification}
          setNotificationList={setNotificationList}
          notificationList={notificationList}
          notificationListQuery={notificationListQuery}
          pagination={pagination}
        />
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
          <NotificationListPagination
            notificationList={notificationList}
            itemsPerPage={itemsPerPage}
            pagination={pagination}
            data={data}
            setCurrentPage={setCurrentPage}
            setItemsPerPage={setItemsPerPage}
            setPagination={setPagination}
            setData={setData}
          />
          {isLoading && <NotificationListLoading />}
        </KTCardBody>
      </KTCard>
    </SelectedValuesProvider>
  );
};

export { NotificationTable };
