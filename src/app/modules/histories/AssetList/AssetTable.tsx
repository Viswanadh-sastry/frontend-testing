import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { ColumnInstance, Row, useTable } from "react-table";
import { toast } from "react-toastify";
import { KTCardBody } from "../../../../_metronic/helpers";
// import { sortHistoryData } from "../../dashboard/api/DashboardHelper";
import { getHistoryListAll } from "../api/HistoryAPI";
import { History } from "../api/_models";
import { AssetListHeader } from "./AssetListHeader";
import { CustomHeaderColumn } from "./columns/CustomHeaderColumn";
import { CustomRow } from "./columns/CustomRow";
import { assetColumns } from "./columns/_columns";
import { AssetListLoading } from "./pagination/AssetListLoading";
import { AssetListPagination } from "./pagination/AssetListPagination";

const AssetTable = () => {
  const [data, setData] = useState<any>([]);
  const [historyList, setHistoryList] = useState<any>([]);
  const [filterAsset, setFilterAsset] = useState({
    limit: 100,
    offset: 0,
    channelId: [],
    status: "enabled",
    from: 0,
    to: 0,
    name: [],
  });

  interface LocationState {
    selectedValues: [];
  }

  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10); // Dynamic items per page
  const params = useParams();
  const channelId = params.id;

  const location = useLocation();
  const { selectedValues } = (location.state as LocationState) || []; // Cast state to LocationState type

  useEffect(() => {
    if (selectedValues) {
      setFilterAsset({ ...filterAsset, channelId: selectedValues });
    }
  }, [selectedValues]);

  const assetHistoryListQuery = useQuery({
    queryKey: [`historyList`, filterAsset],
    queryFn: async () => {
      let totalCount = 0;
      if (channelId) {
        let channelListByThingId;
        if (filterAsset.name && filterAsset.name.length == 0) {
          channelListByThingId = await getHistoryListAll(channelId, filterAsset).catch((error) => toast.error(error?.response?.data?.message || "Something went wrong"));
        }
        // when filterAsset.name.length > 0, we need to pass the name one by one to get the data
        if (filterAsset.name && filterAsset.name.length > 0) {
          const channelList = [];
          for (const name of filterAsset.name) {
            try {
              const filterWithName = { ...filterAsset, name: [name] }; // Pass the name one by one
              const historyData = await getHistoryListAll(channelId, filterWithName).catch((error) => toast.error(error?.response?.data?.message || "Something went wrong"));
              if (historyData.messages) {
                channelList.push(...historyData.messages);
              }
              totalCount += historyData.total;
            } catch (error: any) {
              toast.error(error?.response?.data?.message || "Something went wrong");
            }
          }
          setHistoryList([...historyList, ...channelList]);
          setTotal(totalCount);
          return channelList;
        }

        if (channelListByThingId.messages) {
          totalCount += channelListByThingId.total;
          setHistoryList([...historyList, ...channelListByThingId.messages]);
          setTotal(totalCount);
          return channelListByThingId.messages;
        }
      } else {
        if (filterAsset.channelId) {
          const channelList = [];

          for (const assetId of filterAsset.channelId) {
            if (filterAsset.name && filterAsset.name.length > 0) {
              for (const name of filterAsset.name) {
                try {
                  const filterWithName = { ...filterAsset, name: [name] }; // Pass the name one by one
                  const historyData = await getHistoryListAll(assetId, filterWithName).catch((error) => toast.error(error?.response?.data?.message || "Something went wrong"));
                  if (historyData.messages) {
                    channelList.push(...historyData.messages);
                  }
                  totalCount += historyData.total;
                } catch (error: any) {
                  toast.error(error?.response?.data?.message || "Something went wrong");
                }
              }
            } else {
              const channelListByThingId = await getHistoryListAll(assetId, filterAsset).catch((error) => toast.error(error?.response?.data?.message || "Something went wrong"));
              if (channelListByThingId.messages) {
                channelList.push(...channelListByThingId.messages);
              }
              totalCount += channelListByThingId.total;
            }
          }

          // order by unix time descending
          // channelList.sort((a: any, b: any) => sortHistoryData(a, b));
          setHistoryList([...historyList, ...channelList]);
          setTotal(totalCount);
          return channelList;
        }
      }
      return [];
    },
    enabled: !!filterAsset.channelId || !!channelId,
  });

  const isLoading = assetHistoryListQuery.isLoading;

  useEffect(() => {
    if (historyList) {
      setData(
        historyList.filter((_: any, index: number) => {
          return index >= (currentPage - 1) * itemsPerPage && index < currentPage * itemsPerPage;
        })
      );
      if (currentPage * itemsPerPage >= historyList.length && historyList.length > 0 && total > historyList.length) {
        setFilterAsset({ ...filterAsset, offset: filterAsset.offset + filterAsset.limit });
      }
    }
  }, [historyList, currentPage, itemsPerPage]);

  const columns = useMemo(() => assetColumns, []);
  const { getTableProps, getTableBodyProps, headers, rows, prepareRow } = useTable({
    columns,
    data,
  });

  return (
    <div className="card w-100">
      <AssetListHeader setFilterAsset={setFilterAsset} setHistoryList={setHistoryList} filterAsset={filterAsset} />
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
        <AssetListPagination
          historyList={historyList}
          total={total}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          data={data}
          setCurrentPage={setCurrentPage}
          setItemsPerPage={setItemsPerPage}
          setData={setData}
        />
        {isLoading && <AssetListLoading />}
      </KTCardBody>
    </div>
  );
};

export { AssetTable };
