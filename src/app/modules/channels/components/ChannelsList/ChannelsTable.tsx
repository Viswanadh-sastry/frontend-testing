import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ColumnInstance, Row, useTable } from "react-table";
import { toast } from "react-toastify";
import { KTCard, KTCardBody } from "../../../../../_metronic/helpers";
import { getChannelGroupList } from "../../api/ChannelGroupAPI";
import { getChannelThingList } from "../../api/ChannelThingAPI";
import { getChannelList } from "../../api/ChannelsAPI";
import { Channels } from "../../api/_models";
import { AddChannels } from "../AddEditChannels/AddChannels";
import { ImportChannel } from "../AddEditChannels/ImportChannel/ImportChannel";
import { ChannelsListHeader } from "./ChannelsListHeader";
import { CustomHeaderColumn } from "./columns/CustomHeaderColumn";
import { CustomRow } from "./columns/CustomRow";
import { channelsColumns } from "./columns/_columns";
import { ChannelsListLoading } from "./pagination/ChannelsListLoading";
import { ChannelsListPagination } from "./pagination/ChannelsListPagination";

const ChannelsTable = () => {
  const [showAddChannel, setShowAddChannel] = useState(false);
  const [importModal, setImportModal] = useState(false);
  const [filterChannel, setFilterChannel] = useState({
    limit: 10,
    offset: 0,
    name: "",
    metadata: "",
    status: "enabled",
  });
  const filterThing = {
    limit: 10,
    offset: 0,
    name: "",
    metadata: "",
    tags: "",
    status: "enabled",
  };
  const filterGroup = {
    limit: 10,
    offset: 0,
    name: "",
    metadata: "",
    parentID: "",
    status: "enabled",
  };
  const channelListQuery = useQuery({
    queryKey: [`channelList`, filterChannel],
    queryFn: async () =>
      getChannelList(filterChannel)
        .then(async (response) => {
          const groups = await Promise.all(
            response.groups.map(async (group: any) => {
              try {
                const thing = await getChannelThingList(group.id, filterThing);
                const location = await getChannelGroupList(group.id, filterGroup);
                return {
                  ...group,
                  isConnected: thing.total > 0,
                  isLocated: location.total > 0,
                };
              } catch (error) {
                return {
                  ...group,
                  isConnected: false,
                  isLocated: false,
                };
              }
            })
          );
          return { ...response, groups };
        })
        .catch((error) => toast.error(error?.response?.data?.message || "Something went wrong")),
    enabled: true,
  });

  const isLoading = channelListQuery.isLoading;
  const data = useMemo(() => channelListQuery.data?.groups || [], [channelListQuery.data]);
  const columns = useMemo(() => channelsColumns, []);
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
  const onShowImportChannel = () => setImportModal(true);
  const onCloseImportChannel = () => setImportModal(false);

  return (
    <KTCard>
      <ChannelsListHeader onShowAddChannel={onShowAddChannel} onShowImportChannel={onShowImportChannel} setFilterChannel={setFilterChannel} filterChannel={filterChannel} />
      <KTCardBody className="py-4">
        <div className="table-responsive">
          <table id="kt_table_channels" className="table align-middle table-row-dashed fs-6 dataTable no-footer" {...getTableProps()}>
            <thead>
              <tr className="text-start text-muted fw-bolder fs-7 text-uppercase gs-0">
                {headers.map((column: ColumnInstance<Channels>) => (
                  <CustomHeaderColumn key={column.id} column={column} />
                ))}
              </tr>
            </thead>
            <tbody className="text-gray-600" {...getTableBodyProps()}>
              {rows.length > 0 ? (
                rows.map((row: Row<Channels>, i) => {
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
        <ChannelsListPagination filterChannel={filterChannel} setFilterChannel={setFilterChannel} />
        {showAddChannel && <AddChannels onCloseAddChannel={onCloseAddChannel} onGetChannelList={onGetChannelList} />}
        {importModal && <ImportChannel onShowImportChannel={importModal} onCloseImportChannel={onCloseImportChannel} onGetChannelList={onGetChannelList} />}
        {isLoading && <ChannelsListLoading />}
      </KTCardBody>
    </KTCard>
  );
};

export { ChannelsTable };
