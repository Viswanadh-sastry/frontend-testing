import { useQuery } from "@tanstack/react-query";
import { FC, useMemo, useState } from "react";
import { ColumnInstance, Row, useTable } from "react-table";
import { toast } from "react-toastify";
import { KTCard, KTCardBody } from "../../../../../_metronic/helpers";
import { getGroupList } from "../../api/GroupAPI";
import { Group } from "../../api/_models";
import { AddGroup } from "../AddEditGroup/AddGroup";
import { ImportGroup } from "../AddEditGroup/ImportGroup/ImportGroup";
import { GroupListHeader } from "./GroupListHeader";
import { CustomHeaderColumn } from "./columns/CustomHeaderColumn";
import { CustomRow } from "./columns/CustomRow";
import { groupColumns } from "./columns/_columns";
import { GroupsListLoading } from "./pagination/GroupsListLoading";
import { GroupsListPagination } from "./pagination/GroupsListPagination";

const GroupTable: FC = () => {
  const [showAddGroup, setShowAddGroup] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [importModal, setImportModal] = useState(false);
  const [filterGroup, setFilterGroup] = useState({
    limit: 10,
    offset: 0,
    name: "",
    metadata: "",
    parentID: "",
    status: "enabled",
    tree: true,
  });

  const groupListQuery = useQuery({
    queryKey: [`groupList`, filterGroup],
    queryFn: async () => getGroupList(filterGroup).catch((error) => toast.error(error?.response?.data?.message || "Something went wrong")),
    enabled: true,
  });

  const isLoading = groupListQuery.isLoading;
  const data = useMemo(() => groupListQuery.data?.groups || [], [groupListQuery.data]);
  const columns = useMemo(() => groupColumns, []);
  const { getTableProps, getTableBodyProps, headers, rows, prepareRow } = useTable({
    columns,
    data,
  });

  const onShowAddGroup = () => setShowAddGroup(true);
  const onCloseAddGroup = () => setShowAddGroup(false);
  const onShowImportGroup = () => setImportModal(true);
  const onCloseImportGroup = () => setImportModal(false);
  const onGetGroupList = () => groupListQuery.refetch();

  const onRowClick = (rowId: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [rowId]: !prev[rowId],
    }));
  };

  return (
    <KTCard>
      <GroupListHeader onShowAddGroup={onShowAddGroup} onShowImportGroup={onShowImportGroup} setFilterGroup={setFilterGroup} filterGroup={filterGroup} />
      <KTCardBody className="py-4">
        <div className="table-responsive">
          <table id="kt_table_groups" className="table align-middle table-row-dashed fs-6 dataTable no-footer" {...getTableProps()}>
            <thead>
              <tr className="text-start text-muted fw-bolder fs-7 text-uppercase gs-0">
                {headers.map((column: ColumnInstance<Group>) => (
                  <CustomHeaderColumn key={column.id} column={column} />
                ))}
              </tr>
            </thead>
            <tbody className="text-gray-600" {...getTableBodyProps()}>
              {rows.length > 0 ? (
                rows.map((row: Row<Group>, i) => {
                  prepareRow(row);
                  return <CustomRow key={`row-${i}-${row.id}`} row={row} onRowClick={onRowClick} isExpanded={!expandedRows[row.id]} />;
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
        <GroupsListPagination filterGroup={filterGroup} setFilterGroup={setFilterGroup} />
        {showAddGroup && <AddGroup onCloseAddGroup={onCloseAddGroup} onGetGroupList={onGetGroupList} />}
        {importModal && <ImportGroup onShowImportGroup={importModal} onCloseImportGroup={onCloseImportGroup} onGetGroupList={onGetGroupList} />}
        {isLoading && <GroupsListLoading />}
      </KTCardBody>
    </KTCard>
  );
};

export { GroupTable };
