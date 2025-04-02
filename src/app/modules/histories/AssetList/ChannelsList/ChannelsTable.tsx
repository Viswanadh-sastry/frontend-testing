import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ColumnInstance, Row, useTable } from "react-table";
import { toast } from "react-toastify";
import { KTCard, KTCardBody } from "../../../../../_metronic/helpers";
import { getChannelList } from "../../../channels/api/ChannelsAPI";
import { SelectedValuesProvider } from "../../HistoryContext";
import { Channels } from "../../api/_models";
import { ChannelsListHeader } from "./ChannelsListHeader";
import { CustomHeaderColumn } from "./columns/CustomHeaderColumn";
import { CustomRow } from "./columns/CustomRow";
import { channelsColumns } from "./columns/_columns";
import { ChannelsListLoading } from "./pagination/ChannelsListLoading";
import { ChannelsListPagination } from "./pagination/ChannelsListPagination";

const ChannelsTable = () => {
  const [filterChannel, setFilterChannel] = useState({
    limit: 10,
    offset: 0,
    name: "",
    metadata: "",
    status: "enabled",
  });

  // only call getChannelList api when the component is mounted
  const channelListQuery = useQuery({
    queryKey: [`channelList`, filterChannel],
    queryFn: async () => getChannelList(filterChannel).catch((error) => toast.error(error?.response?.data?.message || "Something went wrong")),
    enabled: true,
  });

  const isLoading = channelListQuery.isLoading;
  const data = useMemo(() => channelListQuery.data?.groups || [], [channelListQuery.data]);
  const columns = useMemo(() => channelsColumns, []);
  const { getTableProps, getTableBodyProps, headers, rows, prepareRow } = useTable({
    columns,
    data,
  });

  return (
    <SelectedValuesProvider>
      <KTCard>
        <ChannelsListHeader setFilterChannel={setFilterChannel} />
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
          {isLoading && <ChannelsListLoading />}
        </KTCardBody>
      </KTCard>
    </SelectedValuesProvider>
  );
};

export { ChannelsTable };
