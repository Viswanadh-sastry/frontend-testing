import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { ColumnInstance, Row, useTable } from "react-table";
import { toast } from "react-toastify";
import { KTCard, KTCardBody } from "../../../../../../_metronic/helpers";
import * as roleHelper from "../../../../auth/core/RoleHelpers";
import { getChannelThingList } from "../../../api/ChannelThingAPI";
import { ChannelThing } from "../../../api/_models";
import { AddThing } from "../AddEditThing/AddThing";
import { ThingsListHeader } from "./ThingsListHeader";
import { CustomHeaderColumn } from "./columns/CustomHeaderColumn";
import { CustomRow } from "./columns/CustomRow";
import { thingsColumns } from "./columns/_columns";
import { ThingsListLoading } from "./pagination/ThingsListLoading";
import { ThingsListPagination } from "./pagination/ThingsListPagination";

const ThingsTable = () => {
  const params = useParams();
  const id = params.id as string;
  const role = roleHelper.getRole();

  const [showAddThing, setShowAddThing] = useState(false);
  const [filterThing, setFilterThing] = useState({
    limit: 10,
    offset: 0,
    name: "",
    metadata: "",
    tags: "",
    status: "enabled",
  });
  const thingListQuery = useQuery({
    queryKey: [`thingList`, filterThing],
    queryFn: async () => getChannelThingList(id, filterThing).catch((error) => toast.error(error?.response?.data?.message || "Something went wrong")),
    enabled: true,
  });
  const isLoading = thingListQuery.isLoading;
  const data = useMemo(() => thingListQuery.data?.things || [], [thingListQuery.data]);
  const columns = useMemo(() => thingsColumns, []);
  const { getTableProps, getTableBodyProps, headers, rows, prepareRow } = useTable({
    columns,
    data,
  });

  const onShowAddThing = () => {
    setShowAddThing(true);
  };

  const onCloseAddThing = () => {
    setShowAddThing(false);
  };

  const onGetThingList = () => {
    thingListQuery.refetch();
  };

  return (
    <KTCard>
      <ThingsListHeader onShowAddThing={onShowAddThing} setFilterThing={setFilterThing} />
      <KTCardBody className="py-4">
        <div className="table-responsive">
          <table id="kt_table_things" className="table align-middle table-row-dashed fs-6 dataTable no-footer" {...getTableProps()}>
            <thead>
              <tr className="text-start text-muted fw-bolder fs-7 text-uppercase gs-0">
                {headers.map((column: ColumnInstance<ChannelThing>) => (column.id !== "actions" || role !== "viewer") && <CustomHeaderColumn key={column.id} column={column} />)}
              </tr>
            </thead>
            <tbody className="text-gray-600" {...getTableBodyProps()}>
              {rows.length > 0 ? (
                rows.map((row: Row<ChannelThing>, i) => {
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
        <ThingsListPagination filterThing={filterThing} setFilterThing={setFilterThing} />
        {showAddThing && <AddThing onCloseAddThing={onCloseAddThing} onGetThingList={onGetThingList} />}
        {isLoading && <ThingsListLoading />}
      </KTCardBody>
    </KTCard>
  );
};

export { ThingsTable };
