import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { ColumnInstance, Row, useTable } from "react-table";
import { toast } from "react-toastify";
import { KTCard, KTCardBody, PaginationState } from "../../../../../_metronic/helpers";
import { getStreamList } from "../../api/StreamAPI";
import { Stream } from "../../api/_models";
import { AddStream } from "../AddEditStream/AddStream";
import { StreamListHeader } from "./StreamListHeader";
import { CustomHeaderColumn } from "./columns/CustomHeaderColumn";
import { CustomRow } from "./columns/CustomRow";
import { streamsColumns } from "./columns/_columns";
import { StreamListLoading } from "./pagination/StreamListLoading";
import { StreamListPagination } from "./pagination/StreamListPagination";

const StreamTable = () => {
  const [showAddStream, setShowAddStream] = useState(false);
  const [data, setData] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<any>(10);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    items_per_page: 10,
    links: [],
  });
  const [streamList, setStreamList] = useState<any>([]);
  const streamListQuery = useQuery({
    queryKey: [`streamList`],
    queryFn: async () => getStreamList().catch((error) => toast.error(error?.response?.data?.message || "Something went wrong")),
    enabled: true,
  });

  const isLoading = streamListQuery.isLoading;

  useEffect(() => {
    if (streamListQuery.data?.length > 0) {
      setStreamList(streamListQuery.data.map((name: string) => ({ name })));
    }
  }, [streamListQuery.data?.length]);
  useEffect(() => {
    setData(
      streamList.filter((_: any, index: number) => {
        return index >= (currentPage - 1) * itemsPerPage && index < currentPage * itemsPerPage;
      })
    );
  }, [streamList, currentPage, itemsPerPage]);

  const columns = useMemo(() => streamsColumns, []);
  const { getTableProps, getTableBodyProps, headers, rows, prepareRow } = useTable({
    columns,
    data,
  });

  const onShowAddStream = () => {
    setShowAddStream(true);
  };

  const onCloseAddStream = () => {
    setShowAddStream(false);
  };

  const onGetStreamList = () => {
    streamListQuery.refetch();
  };

  return (
    <KTCard>
      <StreamListHeader onShowAddStream={onShowAddStream} setCurrentPage={setCurrentPage} setPagination={setPagination} streamListQuery={streamListQuery} pagination={pagination} />
      <KTCardBody className="py-4">
        <div className="table-responsive">
          <table id="kt_table_streams" className="table align-middle table-row-dashed fs-6 dataTable no-footer" {...getTableProps()}>
            <thead>
              <tr className="text-start text-muted fw-bolder fs-7 text-uppercase gs-0">
                {headers.map((column: ColumnInstance<Stream>) => (
                  <CustomHeaderColumn key={column.id} column={column} />
                ))}
              </tr>
            </thead>
            <tbody className="text-gray-600" {...getTableBodyProps()}>
              {rows.length > 0 ? (
                rows.map((row: Row<Stream>, i) => {
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
        <StreamListPagination
          streamList={streamList}
          itemsPerPage={itemsPerPage}
          pagination={pagination}
          data={data}
          setCurrentPage={setCurrentPage}
          setItemsPerPage={setItemsPerPage}
          setPagination={setPagination}
          setData={setData}
        />
        {showAddStream && <AddStream onCloseAddStream={onCloseAddStream} onGetStreamList={onGetStreamList} />}
        {isLoading && <StreamListLoading />}
      </KTCardBody>
    </KTCard>
  );
};

export { StreamTable };
