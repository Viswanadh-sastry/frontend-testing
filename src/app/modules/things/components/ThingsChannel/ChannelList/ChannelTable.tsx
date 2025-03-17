import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ColumnInstance, Row, useTable } from "react-table";
import { toast } from "react-toastify";
import { KTCard, KTCardBody } from "../../../../../../_metronic/helpers";
import { getThingChannelList } from "../../../api/ThingChannelAPI";
import { ThingChannel } from "../../../api/_models";
import { AddChannel } from "../AddEditChannel/AddChannel";
import { ChannelListHeader } from "./ChannelListHeader";
import { CustomHeaderColumn } from "./columns/CustomHeaderColumn";
import { CustomRow } from "./columns/CustomRow";
import { userColumns } from "./columns/_columns";
import { ChannelListLoading } from "./pagination/ChannelListLoading";
import { ChannelListPagination } from "./pagination/ChannelListPagination";
import { useParams } from "react-router-dom";

const ChannelTable = () => {
  const params = useParams();
  const id = params.id as string;

  const [showAddChannel, setShowAddChannel] = useState(false);
  const [filterChannel, setFilterChannel] = useState({
    limit: 10,
    offset: 0,
    name: "",
    metadata: "",
    status: "enabled",
  });
  const channelListQuery = useQuery({
    queryKey: [`channelThingList`, filterChannel],
    queryFn: async () => getThingChannelList(id, filterChannel).catch((error) => toast.error(error?.response?.data?.error || "Something went wrong")),
    enabled: true,
  });
  const isLoading = channelListQuery.isLoading;
  const data = useMemo(() => channelListQuery.data?.groups || [], [channelListQuery.data]);
  const columns = useMemo(() => userColumns, []);
  const { getTableProps, getTableBodyProps, headers, rows, prepareRow } = useTable({
    columns,
    data,
  });

  const onShowAddChannel = () => {
    setShowAddChannel(true);
  };

  const onCloseAddChannel = () => {
    setShowAddChannel(false);
  };

  const onGetChannelList = () => {
    channelListQuery.refetch();
  };

  return (
    <>
      <KTCard>
        <ChannelListHeader onShowAddChannel={onShowAddChannel} setFilterChannel={setFilterChannel} totalChannel={rows.length} />
        <KTCardBody className="py-4">
          <div className="table-responsive">
            <table id="kt_table_groups" className="table align-middle table-row-dashed fs-6 dataTable no-footer" {...getTableProps()}>
              <thead>
                <tr className="text-start text-muted fw-bolder fs-7 text-uppercase gs-0">
                  {headers.map((column: ColumnInstance<ThingChannel>) => (
                    <CustomHeaderColumn key={column.id} column={column} />
                  ))}
                </tr>
              </thead>
              <tbody className="text-gray-600" {...getTableBodyProps()}>
                {rows.length > 0 ? (
                  rows.map((row: Row<ThingChannel>, i) => {
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
          <ChannelListPagination filterChannel={filterChannel} setFilterChannel={setFilterChannel} />
          {showAddChannel && <AddChannel onCloseAddChannel={onCloseAddChannel} onGetChannelList={onGetChannelList} />}
          {isLoading && <ChannelListLoading />}
        </KTCardBody>
      </KTCard>
    </>
  );
};

export { ChannelTable };
