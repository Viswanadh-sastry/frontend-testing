import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ColumnInstance, Row, useTable } from "react-table";
import { KTCard, KTCardBody } from "../../../../../_metronic/helpers";
import { getLORAAuth } from "../../../auth/core/LORAHelpers";
import { getDeviceProfile } from "../../api/DeviceProfileAPI";
import { DeviceProfile } from "../../api/_models";
import { ImportDeviceProfiles } from "../AddEditDeviceProfile/ImportDeviceProfiles/ImportDeviceProfiles";
import { DeviceProfileListHeader } from "./DeviceProfileListHeader";
import { CustomHeaderColumn } from "./columns/CustomHeaderColumn";
import { CustomRow } from "./columns/CustomRow";
import { deviceProfilesColumns } from "./columns/_columns";
import { DeviceProfileListLoading } from "./pagination/DeviceProfileListLoading";
import { DeviceProfileListPagination } from "./pagination/DeviceProfileListPagination";

const DeviceProfileTable = () => {
  const [importModal, setImportModal] = useState(false);
  const [filterDeviceProfile, setFilterDeviceProfile] = useState({
    limit: 10,
    offset: 0,
    tenantId: getLORAAuth()?.tenant_id || "",
  });
  const deviceProfileListQuery = useQuery({
    queryKey: [`deviceProfileList`, filterDeviceProfile],
    queryFn: async () => getDeviceProfile(filterDeviceProfile),
    enabled: true,
  });

  const isLoading = deviceProfileListQuery.isLoading;
  const data = useMemo(() => deviceProfileListQuery.data?.result || [], [deviceProfileListQuery.data]);
  const columns = useMemo(() => deviceProfilesColumns, []);
  const { getTableProps, getTableBodyProps, headers, rows, prepareRow } = useTable({
    columns,
    data,
  });

  const onShowImportDeviceProfile = () => setImportModal(true);
  const onCloseImportDeviceProfile = () => setImportModal(false);
  const onGetDeviceProfileList = () => deviceProfileListQuery.refetch();

  return (
    <KTCard>
      <DeviceProfileListHeader onShowImportDeviceProfile={onShowImportDeviceProfile} />
      <KTCardBody className="py-4">
        <div className="table-responsive">
          <table id="kt_table_deviceProfiles" className="table align-middle table-row-dashed fs-6 dataTable no-footer" {...getTableProps()}>
            <thead>
              <tr className="text-start text-muted fw-bolder fs-7 text-uppercase gs-0">
                {headers.map((column: ColumnInstance<DeviceProfile>) => (
                  <CustomHeaderColumn key={column.id} column={column} />
                ))}
              </tr>
            </thead>
            <tbody className="text-gray-600" {...getTableBodyProps()}>
              {rows.length > 0 ? (
                rows.map((row: Row<DeviceProfile>, i) => {
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
        <DeviceProfileListPagination filterDeviceProfile={filterDeviceProfile} setFilterDeviceProfile={setFilterDeviceProfile} />
        {importModal && (
          <ImportDeviceProfiles onShowImportDeviceProfile={importModal} onCloseImportDeviceProfile={onCloseImportDeviceProfile} onGetDeviceProfileList={onGetDeviceProfileList} />
        )}
        {isLoading && <DeviceProfileListLoading />}
      </KTCardBody>
    </KTCard>
  );
};

export { DeviceProfileTable };
