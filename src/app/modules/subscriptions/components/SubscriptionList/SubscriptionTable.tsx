import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ColumnInstance, Row, useTable } from "react-table";
import { toast } from "react-toastify";
import { KTCard, KTCardBody } from "../../../../../_metronic/helpers";
import { getSubscriptionList } from "../../api/SubscriptionAPI";
import { Subscription } from "../../api/_models";
import { AddSubscription } from "../AddEditSubscription/AddSubscription";
import { SubscriptionListHeader } from "./SubscriptionListHeader";
import { CustomHeaderColumn } from "./columns/CustomHeaderColumn";
import { CustomRow } from "./columns/CustomRow";
import { subscriptionsColumns } from "./columns/_columns";
import { SubscriptionListLoading } from "./pagination/SubscriptionListLoading";
import { SubscriptionListPagination } from "./pagination/SubscriptionListPagination";

const SubscriptionTable = () => {
  const [showAddSubscription, setShowAddSubscription] = useState(false);
  const [filterSubscription, setFilterSubscription] = useState({
    limit: 10,
    offset: 0,
  });
  const subscriptionListQuery = useQuery({
    queryKey: [`subscriptionList`, filterSubscription],
    queryFn: async () => getSubscriptionList(filterSubscription).catch((error) => toast.error(error?.response?.data?.error || "Something went wrong")),
    enabled: true,
  });

  const isLoading = subscriptionListQuery.isLoading;
  const data = useMemo(() => subscriptionListQuery.data?.subscriptions || [], [subscriptionListQuery.data]);
  const columns = useMemo(() => subscriptionsColumns, []);
  const { getTableProps, getTableBodyProps, headers, rows, prepareRow } = useTable({
    columns,
    data,
  });

  const onShowAddSubscription = () => {
    setShowAddSubscription(true);
  };

  const onCloseAddSubscription = () => {
    setShowAddSubscription(false);
  };

  const onGetSubscriptionList = () => {
    subscriptionListQuery.refetch();
  };

  return (
    <KTCard>
      <SubscriptionListHeader onShowAddSubscription={onShowAddSubscription} subscriptionListQuery={subscriptionListQuery} />
      <KTCardBody className="py-4">
        <div className="table-responsive">
          <table id="kt_table_subscriptions" className="table align-middle table-row-dashed fs-6 dataTable no-footer" {...getTableProps()}>
            <thead>
              <tr className="text-start text-muted fw-bolder fs-7 text-uppercase gs-0">
                {headers.map((column: ColumnInstance<Subscription>) => (
                  <CustomHeaderColumn key={column.id} column={column} />
                ))}
              </tr>
            </thead>
            <tbody className="text-gray-600" {...getTableBodyProps()}>
              {rows.length > 0 ? (
                rows.map((row: Row<Subscription>, i) => {
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
        <SubscriptionListPagination filterSubscription={filterSubscription} setFilterSubscription={setFilterSubscription} />
        {showAddSubscription && <AddSubscription onCloseAddSubscription={onCloseAddSubscription} onGetSubscriptionList={onGetSubscriptionList} />}
        {isLoading && <SubscriptionListLoading />}
      </KTCardBody>
    </KTCard>
  );
};

export { SubscriptionTable };
