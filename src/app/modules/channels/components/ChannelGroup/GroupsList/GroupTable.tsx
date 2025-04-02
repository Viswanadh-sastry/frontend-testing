import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { ColumnInstance, Row, useTable } from "react-table";
import { toast } from "react-toastify";
import { KTCard, KTCardBody } from "../../../../../../_metronic/helpers";
import { getChannelGroupList } from "../../../api/ChannelGroupAPI";
import { ChannelGroup } from "../../../api/_models";
import { AddGroup } from "../AddEditGroup/AddGroup";
import { GroupListHeader } from "./GroupListHeader";
import { CustomHeaderColumn } from "./columns/CustomHeaderColumn";
import { CustomRow } from "./columns/CustomRow";
import { groupColumns } from "./columns/_columns";
import { GroupsListLoading } from "./pagination/GroupsListLoading";
import { GroupsListPagination } from "./pagination/GroupsListPagination";

const GroupTable = () => {
  const params = useParams();
  const id = params.id as string;
  const [showAddGroup, setShowAddGroup] = useState(false);
  const [filterGroup, setFilterGroup] = useState({
    limit: 10,
    offset: 0,
    name: "",
    metadata: "",
    parentID: "",
    status: "enabled",
  });
  const groupListQuery = useQuery({
    queryKey: [`groupList`, filterGroup],
    queryFn: async () => getChannelGroupList(id, filterGroup).catch((error) => toast.error(error?.response?.data?.message || "Something went wrong")),
    enabled: true,
  });
  const isLoading = groupListQuery.isLoading;
  const data = useMemo(() => groupListQuery.data?.groups || [], [groupListQuery.data]);
  const columns = useMemo(() => groupColumns, []);
  const { getTableProps, getTableBodyProps, headers, rows, prepareRow } = useTable({
    columns,
    data,
  });

  const onShowAddGroup = () => {
    setShowAddGroup(true);
  };

  const onCloseAddGroup = () => {
    setShowAddGroup(false);
  };

  const onGetGroupList = () => {
    groupListQuery.refetch();
  };

  return (
    <KTCard>
      <GroupListHeader onShowAddGroup={onShowAddGroup} setFilterGroup={setFilterGroup} totalGroup={rows.length} />
      <KTCardBody className="py-4">
        <div className="table-responsive">
          <table id="kt_table_groups" className="table align-middle table-row-dashed fs-6 dataTable no-footer" {...getTableProps()}>
            <thead>
              <tr className="text-start text-muted fw-bolder fs-7 text-uppercase gs-0">
                {headers.map((column: ColumnInstance<ChannelGroup>) => (
                  <CustomHeaderColumn key={column.id} column={column} />
                ))}
              </tr>
            </thead>
            <tbody className="text-gray-600" {...getTableBodyProps()}>
              {rows.length > 0 ? (
                rows.map((row: Row<ChannelGroup>, i) => {
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
        <GroupsListPagination filterGroup={filterGroup} setFilterGroup={setFilterGroup} />
        {showAddGroup && <AddGroup onCloseAddGroup={onCloseAddGroup} onGetGroupList={onGetGroupList} />}
        {isLoading && <GroupsListLoading />}
      </KTCardBody>
    </KTCard>
  );
};

export { GroupTable };
