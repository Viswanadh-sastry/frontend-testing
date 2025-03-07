import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { ColumnInstance, Row, useTable } from "react-table";
import { toast } from "react-toastify";
import { KTCard, KTCardBody } from "../../../../_metronic/helpers";
// import { sortHistoryData } from "../../dashboard/api/DashboardHelper";
import { getThingChannelList } from "../../things/api/ThingChannelAPI";
import { getHistoryListAll } from "../api/HistoryAPI";
import { History } from "../api/_models";
import { DeviceListHeader } from "./DeviceListHeader";
import { CustomHeaderColumn } from "./columns/CustomHeaderColumn";
import { CustomRow } from "./columns/CustomRow";
import { assetColumns } from "./columns/_columns";
import { DeviceListLoading } from "./pagination/DeviceListLoading";
import { DeviceListPagination } from "./pagination/DeviceListPagination";

const DeviceTable = () => {
  const [data, setData] = useState<any>([]);
  const [historyList, setHistoryList] = useState<any>([]);
  const [filterDevice, setFilterDevice] = useState({
    limit: 100, // Always fetch 100 records from the API
    offset: 0,
    thingId: [],
    status: "enabled",
    name: [],
    from: 0,
    to: 0,
    publisher: "",
  });

  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10); // Dynamic items per page

  const filterGroupChannel = {
    offset: 0,
    limit: 10,
    name: "",
    status: "enabled",
  };

  interface LocationState {
    selectedValues: [];
  }

  const params = useParams();
  const thingId = params.id;

  const location = useLocation();
  const { selectedValues } = (location.state as LocationState) || [];

  useEffect(() => {
    if (selectedValues) {
      setFilterDevice({ ...filterDevice, thingId: selectedValues });
    }
  }, [selectedValues]);

  const channelListByThingIdQuery = useQuery({
    queryKey: [`thingListByChannelId`, thingId || filterDevice.thingId, filterGroupChannel],
    queryFn: async () => {
      const channelList = [];
      if (thingId) {
        const channelListByThingId = await getThingChannelList(thingId, filterGroupChannel);
        if (channelListByThingId.groups) {
          const groupsWithThingId = channelListByThingId.groups.map((group: any) => ({
            ...group,
            thingId,
          }));
          channelList.push(...groupsWithThingId);
        }
      } else if (filterDevice.thingId) {
        for (const thingId of filterDevice.thingId) {
          const channelListByThingId = await getThingChannelList(thingId, filterGroupChannel);
          if (channelListByThingId.groups) {
            const groupsWithThingId = channelListByThingId.groups.map((group: any) => ({
              ...group,
              thingId,
            }));
            channelList.push(...groupsWithThingId);
          }
        }
      }
      return channelList;
    },
    enabled: !!filterDevice.thingId || !!thingId,
  });

  const deviceHistoryListQuery = useQuery({
    queryKey: [`historyList`, filterDevice],
    queryFn: async () => {
      if (!channelListByThingIdQuery.isSuccess || !channelListByThingIdQuery.data) return [];

      let totalCount = 0;
      const channelList = channelListByThingIdQuery.data || [];
      const allHistoryData = [];

      for (const channel of channelList) {
        if (filterDevice.name && filterDevice.name.length > 0) {
          for (const name of filterDevice.name) {
            try {
              const filterWithNameAndPublisher = { ...filterDevice, name: [name], publisher: channel.thingId };
              const historyData = await getHistoryListAll(channel.id, filterWithNameAndPublisher);
              if (historyData.messages) {
                allHistoryData.push(...historyData.messages);
              }
              totalCount += historyData.total;
            } catch (error: any) {
              toast.error(error.message);
            }
          }
        } else {
          try {
            const filterWithPublisher = { ...filterDevice, publisher: channel.thingId };
            const historyData = await getHistoryListAll(channel.id, filterWithPublisher);
            if (historyData.messages) {
              allHistoryData.push(...historyData.messages);
            }
            totalCount += historyData.total;
          } catch (error: any) {
            toast.error(error.message);
          }
        }
      }

      // order by unix time descending
      // allHistoryData.sort((a: any, b: any) => sortHistoryData(a, b));
      setHistoryList([...historyList, ...allHistoryData]);
      setTotal(totalCount);
      return allHistoryData;
    },
    enabled: channelListByThingIdQuery.isSuccess && !!channelListByThingIdQuery.data,
  });

  const isLoading = deviceHistoryListQuery.isLoading || channelListByThingIdQuery.isLoading;

  useEffect(() => {
    if (historyList) {
      setData(
        historyList.filter((_: any, index: number) => {
          return index >= (currentPage - 1) * itemsPerPage && index < currentPage * itemsPerPage;
        })
      );
      if (currentPage * itemsPerPage >= historyList.length && historyList.length > 0) {
        setFilterDevice({ ...filterDevice, offset: Math.ceil(historyList.length / itemsPerPage) });
      }
    }
  }, [historyList, currentPage, itemsPerPage]);

  const columns = useMemo(() => assetColumns, []);
  const { getTableProps, getTableBodyProps, headers, rows, prepareRow } = useTable({
    columns,
    data,
  });

  return (
    <KTCard>
      <DeviceListHeader setFilterDevice={setFilterDevice} setHistoryList={setHistoryList} filterDevice={filterDevice} />
      <KTCardBody className="py-4">
        <div className="table-responsive">
          <table id="kt_table_groups" className="table align-middle table-row-dashed fs-6 dataTable no-footer" {...getTableProps()}>
            <thead>
              <tr className="text-start text-muted fw-bolder fs-7 text-uppercase gs-0">
                {headers.map((column: ColumnInstance<History>) => (
                  <CustomHeaderColumn key={column.id} column={column} />
                ))}
              </tr>
            </thead>
            <tbody className="text-gray-600" {...getTableBodyProps()}>
              {rows.length > 0 ? (
                rows.map((row: Row<History>, i) => {
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
        <DeviceListPagination
          historyList={historyList}
          total={total}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          data={data}
          setCurrentPage={setCurrentPage}
          setItemsPerPage={setItemsPerPage}
          setData={setData}
        />
        {isLoading && <DeviceListLoading />}
      </KTCardBody>
    </KTCard>
  );
};

export { DeviceTable };
