import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { ColumnInstance, Row, useTable } from "react-table";
import { toast } from "react-toastify";
import { KTCard, KTCardBody, PaginationState } from "../../../../../_metronic/helpers";
import { getChannelListAll } from "../../api/ChannelsAPI";
import { getChannelThingList } from "../../api/ChannelThingAPI";
import { getChannelGroupList } from "../../api/ChannelGroupAPI";
import { Channels } from "../../api/_models";
import { AddChannels } from "../AddEditChannels/AddChannels";
import { ChannelsListHeader } from "./ChannelsListHeader";
import { CustomHeaderColumn } from "./columns/CustomHeaderColumn";
import { CustomRow } from "./columns/CustomRow";
import { channelsColumns } from "./columns/_columns";
import { ChannelsListLoading } from "./pagination/ChannelsListLoading";
import { ChannelsListPagination } from "./pagination/ChannelsListPagination";
import { ImportChannel } from "../AddEditChannels/ImportChannel/ImportChannel";

const ChannelsTable = () => {
  const [showAddChannel, setShowAddChannel] = useState(false);
  const [importModal, setImportModal] = useState(false);
  const [data, setData] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<any>(10);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    items_per_page: 10,
    links: [],
  });
  const [channelList, setChannelList] = useState<any>([]);
  const [filterChannel, setFilterChannel] = useState({
    limit: 100,
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
      getChannelListAll(filterChannel)
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
        .catch((error) => toast.error(error.message)),
    enabled: true,
  });

  const isLoading = channelListQuery.isLoading;
  const columns = useMemo(() => channelsColumns, []);
  const { getTableProps, getTableBodyProps, headers, rows, prepareRow } = useTable({
    columns,
    data,
  });

  useEffect(() => {
    if (channelListQuery.data?.groups) {
      setChannelList(channelListQuery.data.groups || []);
    }
  }, [channelListQuery.data?.groups]);
  useEffect(() => {
    setData(
      channelList.filter((_: any, index: number) => {
        return index >= (currentPage - 1) * itemsPerPage && index < currentPage * itemsPerPage;
      })
    );
  }, [channelList, currentPage, itemsPerPage]);

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
      <ChannelsListHeader
        onShowAddChannel={onShowAddChannel}
        onShowImportChannel={onShowImportChannel}
        setCurrentPage={setCurrentPage}
        setPagination={setPagination}
        setFilterChannel={setFilterChannel}
        setChannelList={setChannelList}
        channelList={channelList}
        channelListQuery={channelListQuery}
        pagination={pagination}
      />
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
        <ChannelsListPagination
          channelList={channelList}
          itemsPerPage={itemsPerPage}
          pagination={pagination}
          data={data}
          setCurrentPage={setCurrentPage}
          setItemsPerPage={setItemsPerPage}
          setPagination={setPagination}
          setData={setData}
        />
        {showAddChannel && <AddChannels onCloseAddChannel={onCloseAddChannel} onGetChannelList={onGetChannelList} />}
        {importModal && <ImportChannel onShowImportChannel={importModal} onCloseImportChannel={onCloseImportChannel} onGetChannelList={onGetChannelList} />}
        {isLoading && <ChannelsListLoading />}
      </KTCardBody>
    </KTCard>
  );
};

export { ChannelsTable };
