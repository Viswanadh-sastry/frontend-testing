import { FC, useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTable, ColumnInstance, Row } from "react-table";
import { toast } from "react-toastify";
import { KTCard, KTCardBody, PaginationState } from "../../../../../_metronic/helpers";
import { getGroupListAll } from "../../api/GroupAPI";
import { Group } from "../../api/_models";
import { AddGroup } from "../AddEditGroup/AddGroup";
import { GroupListHeader } from "./GroupListHeader";
import { CustomHeaderColumn } from "./columns/CustomHeaderColumn";
import { CustomRow } from "./columns/CustomRow";
import { groupColumns } from "./columns/_columns";
import { GroupsListLoading } from "./pagination/GroupsListLoading";
import { GroupsListPagination } from "./pagination/GroupsListPagination";
import { ImportGroup } from "../AddEditGroup/ImportGroup/ImportGroup";

const GroupTable: FC = () => {
  const [showAddGroup, setShowAddGroup] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [importModal, setImportModal] = useState(false);
  const [data, setData] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<any>(10);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    items_per_page: 10,
    links: [],
  });
  const [groupList, setGroupList] = useState<any>([]);
  const [filterGroup, setFilterGroup] = useState({
    limit: 100,
    offset: 0,
    name: "",
    metadata: "",
    parentID: "",
    status: "enabled",
    tree: true,
  });

  const groupListQuery = useQuery({
    queryKey: [`groupList`, filterGroup],
    queryFn: async () => getGroupListAll(filterGroup).catch((error) => toast.error(error.message)),
    enabled: true,
  });

  const isLoading = groupListQuery.isLoading;
  const columns = useMemo(() => groupColumns, []);
  const { getTableProps, getTableBodyProps, headers, rows, prepareRow } = useTable({
    columns,
    data,
  });

  useEffect(() => {
    if (groupListQuery.data?.groups) {
      setGroupList(groupListQuery.data.groups || []);
    }
  }, [groupListQuery.data?.groups]);
  useEffect(() => {
    setData(
      groupList.filter((_: any, index: number) => {
        return index >= (currentPage - 1) * itemsPerPage && index < currentPage * itemsPerPage;
      })
    );
  }, [groupList, currentPage, itemsPerPage]);

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
      <GroupListHeader
        onShowAddGroup={onShowAddGroup}
        onShowImportGroup={onShowImportGroup}
        setCurrentPage={setCurrentPage}
        setPagination={setPagination}
        setFilterGroup={setFilterGroup}
        setGroupList={setGroupList}
        groupList={groupList}
        groupListQuery={groupListQuery}
        pagination={pagination}
      />
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
                  return <CustomRow key={`row-${i}-${row.id}`} row={row} onRowClick={onRowClick} isExpanded={!!expandedRows[row.id]} />;
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
        <GroupsListPagination
          groupList={groupList}
          itemsPerPage={itemsPerPage}
          pagination={pagination}
          data={data}
          setCurrentPage={setCurrentPage}
          setItemsPerPage={setItemsPerPage}
          setPagination={setPagination}
          setData={setData}
        />
        {showAddGroup && <AddGroup onCloseAddGroup={onCloseAddGroup} onGetGroupList={onGetGroupList} />}
        {importModal && <ImportGroup onShowImportGroup={importModal} onCloseImportGroup={onCloseImportGroup} onGetGroupList={onGetGroupList} />}
        {isLoading && <GroupsListLoading />}
      </KTCardBody>
    </KTCard>
  );
};

export { GroupTable };
