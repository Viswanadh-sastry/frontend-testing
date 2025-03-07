import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { ColumnInstance, Row, useTable } from "react-table";
import { KTCardBody } from "../../../../../../_metronic/helpers";
import { getIntegrationList } from "../../../api/IntegrationAPI";
import { Integration } from "../../../api/_models";
import { IntegrationListHeader } from "./IntegrationListHeader";
import { CustomHeaderColumn } from "./columns/CustomHeaderColumn";
import { CustomRow } from "./columns/CustomRow";
import { integrationsColumns } from "./columns/_columns";
import { IntegrationListLoading } from "./pagination/IntegrationListLoading";
import { IntegrationListPagination } from "./pagination/IntegrationListPagination";

const IntegrationTable = () => {
  const params = useParams();
  const id = params.id as string;
  const [filterIntegration, setFilterIntegration] = useState({
    limit: 10,
    offset: 0,
    applicationId: id,
  });
  const integrationListQuery = useQuery({
    queryKey: [`integrationList`, filterIntegration],
    queryFn: async () => getIntegrationList(filterIntegration.applicationId),
    enabled: true,
  });

  const isLoading = integrationListQuery.isLoading;
  const data = useMemo(() => integrationListQuery.data?.result || [], [integrationListQuery.data]);
  const columns = useMemo(() => integrationsColumns, []);
  const { getTableProps, getTableBodyProps, headers, rows, prepareRow } = useTable({
    columns,
    data,
  });

  return (
    <>
      <IntegrationListHeader filterIntegration={filterIntegration} />
      <KTCardBody className="py-4">
        <div className="table-responsive">
          <table id="kt_table_integrations" className="table align-middle table-row-dashed fs-6 dataTable no-footer" {...getTableProps()}>
            <thead>
              <tr className="text-start text-muted fw-bolder fs-7 text-uppercase gs-0">
                {headers.map((column: ColumnInstance<Integration>) => (
                  <CustomHeaderColumn key={column.id} column={column} />
                ))}
              </tr>
            </thead>
            <tbody className="text-gray-600" {...getTableBodyProps()}>
              {rows.length > 0 ? (
                rows.map((row: Row<Integration>, i) => {
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
        <IntegrationListPagination filterIntegration={filterIntegration} setFilterIntegration={setFilterIntegration} />
        {isLoading && <IntegrationListLoading />}
      </KTCardBody>
    </>
  );
};

export { IntegrationTable };
