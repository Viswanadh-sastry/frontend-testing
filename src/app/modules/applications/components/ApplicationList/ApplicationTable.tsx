import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ColumnInstance, Row, useTable } from "react-table";
import { toast } from "react-toastify";
import { KTCard, KTCardBody } from "../../../../../_metronic/helpers";
import { getLORAAuth } from "../../../auth/core/LORAHelpers";
import { getApplication } from "../../api/ApplicationAPI";
import { Application } from "../../api/_models";
import { ImportApplications } from "../AddEditApplication/ImportApplications/ImportApplications";
import { ApplicationListHeader } from "./ApplicationListHeader";
import { CustomHeaderColumn } from "./columns/CustomHeaderColumn";
import { CustomRow } from "./columns/CustomRow";
import { applicationsColumns } from "./columns/_columns";
import { ApplicationListLoading } from "./pagination/ApplicationListLoading";
import { ApplicationListPagination } from "./pagination/ApplicationListPagination";

const ApplicationTable = () => {
  const [importModal, setImportModal] = useState(false);
  const [filterApplication, setFilterApplication] = useState({
    limit: 10,
    offset: 0,
    tenantId: getLORAAuth()?.tenant_id || "",
  });
  const applicationListQuery = useQuery({
    queryKey: [`applicationList`, filterApplication],
    queryFn: async () => getApplication(filterApplication).catch((error) => toast.error(error?.response?.data?.message || "Something went wrong")),
    enabled: true,
  });

  const isLoading = applicationListQuery.isLoading;
  const data = useMemo(() => applicationListQuery.data?.result || [], [applicationListQuery.data]);
  const columns = useMemo(() => applicationsColumns, []);
  const { getTableProps, getTableBodyProps, headers, rows, prepareRow } = useTable({
    columns,
    data,
  });

  const onShowImportApplication = () => setImportModal(true);
  const onCloseImportApplication = () => setImportModal(false);
  const onGetApplicationList = () => applicationListQuery.refetch();

  return (
    <KTCard>
      <ApplicationListHeader onShowImportApplication={onShowImportApplication} />
      <KTCardBody className="py-4">
        <div className="table-responsive">
          <table id="kt_table_applications" className="table align-middle table-row-dashed fs-6 dataTable no-footer" {...getTableProps()}>
            <thead>
              <tr className="text-start text-muted fw-bolder fs-7 text-uppercase gs-0">
                {headers.map((column: ColumnInstance<Application>) => (
                  <CustomHeaderColumn key={column.id} column={column} />
                ))}
              </tr>
            </thead>
            <tbody className="text-gray-600" {...getTableBodyProps()}>
              {rows.length > 0 ? (
                rows.map((row: Row<Application>, i) => {
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
        <ApplicationListPagination filterApplication={filterApplication} setFilterApplication={setFilterApplication} />
        {importModal && (
          <ImportApplications onShowImportApplication={importModal} onCloseImportApplication={onCloseImportApplication} onGetApplicationList={onGetApplicationList} />
        )}
        {isLoading && <ApplicationListLoading />}
      </KTCardBody>
    </KTCard>
  );
};

export { ApplicationTable };
