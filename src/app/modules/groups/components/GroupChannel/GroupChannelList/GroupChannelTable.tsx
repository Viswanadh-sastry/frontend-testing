import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { ColumnInstance, Row, useTable } from "react-table";
import { toast } from "react-toastify";
import { KTCard, KTCardBody } from "../../../../../../_metronic/helpers";
import { getGroupChannelList } from "../../../api/GroupChannelAPI";
import { GroupChannel } from "../../../api/_models";
// import { AddGroupChannel } from "../AddEditGroupChannel/AddGroupChannel";
import { GroupChannelListHeader } from "./GroupChannelListHeader";
import { CustomHeaderColumn } from "./columns/CustomHeaderColumn";
import { CustomRow } from "./columns/CustomRow";
import { groupChannelColumns } from "./columns/_columns";
import { GroupChannelListLoading } from "./pagination/GroupChannelListLoading";
import { GroupChannelListPagination } from "./pagination/GroupChannelListPagination";

const GroupChannelTable = () => {
  const params = useParams();
  const id = params.id as string;
  // const [showAddGroupChannel, setShowAddGroupChannel] = useState(false);
  const [filterGroupChannel, setFilterGroupChannel] = useState({
    offset: 0,
    limit: 10,
    name: "",
    metadata: "",
    parentID: "",
    status: "enabled",
  });
  const groupListQuery = useQuery({
    queryKey: [`groupChannelList`, filterGroupChannel],
    queryFn: async () => getGroupChannelList(id, filterGroupChannel).catch((error) => toast.error(error?.response?.data?.error || "Something went wrong")),
    enabled: true,
  });
  const isLoading = groupListQuery.isLoading;
  const data = useMemo(() => groupListQuery.data?.groups || [], [groupListQuery.data]);
  const columns = useMemo(() => groupChannelColumns, []);
  const { getTableProps, getTableBodyProps, headers, rows, prepareRow } = useTable({
    columns,
    data,
  });

  // const onShowAddGroupChannel = () => {
  //   setShowAddGroupChannel(true);
  // };

  // const onCloseAddGroupChannel = () => {
  //   setShowAddGroupChannel(false);
  // };

  // const onGetGroupChannelList = () => {
  //   groupListQuery.refetch();
  // };

  return (
    <KTCard>
      <GroupChannelListHeader />
      <KTCardBody className="py-4">
        <div className="table-responsive">
          <table id="kt_table_groups" className="table align-middle table-row-dashed fs-6 dataTable no-footer" {...getTableProps()}>
            <thead>
              <tr className="text-start text-muted fw-bolder fs-7 text-uppercase gs-0">
                {headers.map((column: ColumnInstance<GroupChannel>) => (
                  <CustomHeaderColumn key={column.id} column={column} />
                ))}
              </tr>
            </thead>
            <tbody className="text-gray-600" {...getTableBodyProps()}>
              {rows.length > 0 ? (
                rows.map((row: Row<GroupChannel>, i) => {
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
        <GroupChannelListPagination filterGroupChannel={filterGroupChannel} setFilterGroupChannel={setFilterGroupChannel} />
        {/* {showAddGroupChannel && <AddGroupChannel onCloseAddGroupChannel={onCloseAddGroupChannel} onGetGroupChannelList={onGetGroupChannelList} />} */}
        {isLoading && <GroupChannelListLoading />}
      </KTCardBody>
    </KTCard>
  );
};

export { GroupChannelTable };
