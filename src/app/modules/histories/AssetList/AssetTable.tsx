import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { ColumnInstance, Row, useTable } from "react-table";
import { toast } from "react-toastify";
import { KTCardBody } from "../../../../_metronic/helpers";
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

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<any>(10); // Dynamic items per page
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
    queryKey: [`assetHistoryList`, filterAsset],
    queryFn: async () => {
      if (channelId) {
        let channelListByThingId;
        if (filterAsset.name && filterAsset.name.length == 0) {
          channelListByThingId = await getHistoryListAll(channelId, filterAsset);
        }
        // when filterAsset.name.length > 0, we need to pass the name one by one to get the data
        if (filterAsset.name && filterAsset.name.length > 0) {
          const channelList = [];
          for (const name of filterAsset.name) {
            try {
              const filterWithName = { ...filterAsset, name: [name] }; // Pass the name one by one
              const historyData = await getHistoryListAll(channelId, filterWithName);
              if (historyData.messages) {
                channelList.push(...historyData.messages);
              }
            } catch (error: any) {
              toast.error(error.message);
            }
          }
          return channelList;
        }

        if (channelListByThingId.messages) {
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
                  const historyData = await getHistoryListAll(assetId, filterWithName);
                  if (historyData.messages) {
                    channelList.push(...historyData.messages);
                  }
                } catch (error: any) {
                  toast.error(error.message);
                }
              }
            } else {
              const channelListByThingId = await getHistoryListAll(assetId, filterAsset);
              if (channelListByThingId.messages) {
                channelList.push(...channelListByThingId.messages);
              }
            }
          }
          return channelList;
        }
      }
      return [];
    },
    enabled: !!filterAsset.channelId || !!channelId,
  });

  const isLoading = assetHistoryListQuery.isLoading;

  useEffect(() => {
    if (assetHistoryListQuery.data) {
      setData(
        (assetHistoryListQuery.data || []).filter((_: any, index: number) => {
          return index >= (currentPage - 1) * itemsPerPage && index < currentPage * itemsPerPage;
        })
      );
    }
  }, [assetHistoryListQuery.data, currentPage, itemsPerPage]);

  const columns = useMemo(() => assetColumns, []);
  const { getTableProps, getTableBodyProps, headers, rows, prepareRow } = useTable({
    columns,
    data,
  });

  return (
    <div className="card w-100">
      <AssetListHeader setFilterAsset={setFilterAsset} assetHistoryList={assetHistoryListQuery?.data || []} />
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
          assetHistoryListQuery={assetHistoryListQuery}
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
