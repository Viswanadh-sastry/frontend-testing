import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { ColumnInstance, Row, useTable } from "react-table";
import { KTCardBody } from "../../../../../../_metronic/helpers";
import { getDevice } from "../../../api/DeviceAPI";
import { Device } from "../../../api/_models";
import { DeviceListHeader } from "./DeviceListHeader";
import { CustomHeaderColumn } from "./columns/CustomHeaderColumn";
import { CustomRow } from "./columns/CustomRow";
import { devicesColumns } from "./columns/_columns";
import { DeviceListLoading } from "./pagination/DeviceListLoading";
import { DeviceListPagination } from "./pagination/DeviceListPagination";

const DeviceTable = () => {
  const params = useParams();
  const id = params.id as string;
  const [filterDevice, setFilterDevice] = useState({
    limit: 10,
    offset: 0,
    applicationId: id,
  });
  const deviceListQuery = useQuery({
    queryKey: [`deviceList`, filterDevice],
    queryFn: async () => getDevice(filterDevice),
    enabled: true,
  });

  const isLoading = deviceListQuery.isLoading;
  const data = useMemo(() => deviceListQuery.data?.result || [], [deviceListQuery.data]);
  const columns = useMemo(() => devicesColumns, []);
  const { getTableProps, getTableBodyProps, headers, rows, prepareRow } = useTable({
    columns,
    data,
  });

  return (
    <>
      <DeviceListHeader filterDevice={filterDevice} />
      <KTCardBody className="py-4">
        <div className="table-responsive">
          <table id="kt_table_devices" className="table align-middle table-row-dashed fs-6 dataTable no-footer" {...getTableProps()}>
            <thead>
              <tr className="text-start text-muted fw-bolder fs-7 text-uppercase gs-0">
                {headers.map((column: ColumnInstance<Device>) => (
                  <CustomHeaderColumn key={column.id} column={column} />
                ))}
              </tr>
            </thead>
            <tbody className="text-gray-600" {...getTableBodyProps()}>
              {rows.length > 0 ? (
                rows.map((row: Row<Device>, i) => {
                  prepareRow(row);
                  return <CustomRow row={row} key={`row-${i}-${row.id}`} />;
                })
              ) : (
                <tr>
                  <td colSpan={10}>
                    <div className="d-flex text-center w-100 align-content-center justify-content-center">No matching records found</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <DeviceListPagination filterDevice={filterDevice} setFilterDevice={setFilterDevice} />
        {isLoading && <DeviceListLoading />}
      </KTCardBody>
    </>
  );
};

export { DeviceTable };
