import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ColumnInstance, Row, useTable } from "react-table";
import { KTCard, KTCardBody } from "../../../../../_metronic/helpers";
import { getLORAAuth } from "../../../auth/core/LORAHelpers";
import { getGateway } from "../../api/GatewayAPI";
import { Gateway } from "../../api/_models";
import { GatewayListHeader } from "./GatewayListHeader";
import { CustomHeaderColumn } from "./columns/CustomHeaderColumn";
import { CustomRow } from "./columns/CustomRow";
import { gatewaysColumns } from "./columns/_columns";
import { GatewayListLoading } from "./pagination/GatewayListLoading";
import { GatewayListPagination } from "./pagination/GatewayListPagination";

const GatewayTable = () => {
  const [filterGateway, setFilterGateway] = useState({
    limit: 10,
    offset: 0,
    tenantId: getLORAAuth()?.tenant_id || "",
  });
  const gatewayListQuery = useQuery({
    queryKey: [`gatewayList`, filterGateway],
    queryFn: async () => getGateway(filterGateway),
    enabled: true,
  });

  const isLoading = gatewayListQuery.isLoading;
  const data = useMemo(() => gatewayListQuery.data?.result || [], [gatewayListQuery.data]);
  const columns = useMemo(() => gatewaysColumns, []);
  const { getTableProps, getTableBodyProps, headers, rows, prepareRow } = useTable({
    columns,
    data,
  });

  return (
    <KTCard>
      <GatewayListHeader filterGateway={filterGateway} />
      <KTCardBody className="py-4">
        <div className="table-responsive">
          <table id="kt_table_gateways" className="table align-middle table-row-dashed fs-6 dataTable no-footer" {...getTableProps()}>
            <thead>
              <tr className="text-start text-muted fw-bolder fs-7 text-uppercase gs-0">
                {headers.map((column: ColumnInstance<Gateway>) => (
                  <CustomHeaderColumn key={column.id} column={column} />
                ))}
              </tr>
            </thead>
            <tbody className="text-gray-600" {...getTableBodyProps()}>
              {rows.length > 0 ? (
                rows.map((row: Row<Gateway>, i) => {
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
        <GatewayListPagination filterGateway={filterGateway} setFilterGateway={setFilterGateway} />
        {isLoading && <GatewayListLoading />}
      </KTCardBody>
    </KTCard>
  );
};

export { GatewayTable };
