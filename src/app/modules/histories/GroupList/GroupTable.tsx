import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { ColumnInstance, Row, useTable } from "react-table";
import { toast } from "react-toastify";
import { KTCard, KTCardBody } from "../../../../_metronic/helpers";
// import { sortHistoryData } from "../../dashboard/api/DashboardHelper";
import { getGroupChannelList } from "../../groups/api/GroupChannelAPI";
import { getHistoryListAll } from "../api/HistoryAPI";
import { History } from "../api/_models";
import { GroupListHeader } from "./GroupListHeader";
import { CustomHeaderColumn } from "./columns/CustomHeaderColumn";
import { CustomRow } from "./columns/CustomRow";
import { assetColumns } from "./columns/_columns";
import { GroupListLoading } from "./pagination/GroupListLoading";
import { GroupListPagination } from "./pagination/GroupListPagination";

const GroupTable = () => {
  const [data, setData] = useState<any>([]);
  const [historyList, setHistoryList] = useState<any>([]);
  const [filterGroup, setFilterGroup] = useState({
    limit: 100,
    offset: 0,
    groupId: [],
    status: "enabled",
    from: 0,
    to: 0,
    name: [],
  });

  const filterChannel = {
    offset: 0,
    limit: 10,
    name: "",
    status: "enabled",
  };

  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10); // Dynamic items per page

  interface LocationState {
    selectedValues: [];
  }

  const location = useLocation();
  const { selectedValues } = (location.state as LocationState) || []; // Cast state to LocationState type

  useEffect(() => {
    if (selectedValues) {
      setFilterGroup({ ...filterGroup, groupId: selectedValues });
    }
  }, [selectedValues]);

  const channelListByDeviceIdQuery = useQuery({
    queryKey: [`channelListByDeviceId`, filterGroup.groupId, filterChannel],
    queryFn: async () => {
      if (filterGroup.groupId) {
        const channelList = [];
        for (const groupId of filterGroup.groupId) {
          const channelListByGroupId = await getGroupChannelList(groupId, filterChannel);
          channelList.push(...channelListByGroupId.groups);
        }
        return channelList;
      }

      return [];
    },
    enabled: !!filterGroup.groupId,
  });

  const groupHistoryListQuery = useQuery({
    queryKey: [`historyList`, filterGroup],
    queryFn: async () => {
      if (!channelListByDeviceIdQuery.isSuccess || !channelListByDeviceIdQuery.data) return [];

      let totalCount = 0;
      const channelList = channelListByDeviceIdQuery.data || [];
      const allHistoryData = [];

      for (const channel of channelList) {
        if (filterGroup.name && filterGroup.name.length > 0) {
          for (const name of filterGroup.name) {
            const filterWithName = { ...filterGroup, name: [name] }; // Add publisher here
            try {
              const historyData = await getHistoryListAll(channel.id, filterWithName);
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
            const historyData = await getHistoryListAll(channel.id, filterGroup);
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
    enabled: channelListByDeviceIdQuery.isSuccess && !!channelListByDeviceIdQuery.data, // Ensure channelListByThingIdQuery is successful
  });

  // Paginate the data based on currentPage and itemsPerPage
  const isLoading = groupHistoryListQuery.isLoading || channelListByDeviceIdQuery.isLoading;

  useEffect(() => {
    if (historyList) {
      setData(
        historyList.filter((_: any, index: number) => {
          return index >= (currentPage - 1) * itemsPerPage && index < currentPage * itemsPerPage;
        })
      );
      if (currentPage * itemsPerPage >= historyList.length && historyList.length > 0) {
        setFilterGroup({ ...filterGroup, offset: Math.ceil(historyList.length / itemsPerPage) });
      }
    }
  }, [historyList, currentPage, itemsPerPage]);

  const columns = useMemo(() => assetColumns, []);
  const { getTableProps, getTableBodyProps, headers, rows, prepareRow } = useTable({
    columns,
    data,
  });

  return (
    <>
      <KTCard className="mt-2">
        <GroupListHeader setFilterGroup={setFilterGroup} setHistoryList={setHistoryList} filterGroup={filterGroup} />
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
          <GroupListPagination
            historyList={historyList}
            total={total}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            data={data}
            setCurrentPage={setCurrentPage}
            setItemsPerPage={setItemsPerPage}
            setData={setData}
          />
          {isLoading && <GroupListLoading />}
        </KTCardBody>
      </KTCard>
    </>
  );
};

export { GroupTable };
