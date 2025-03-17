import { useQuery } from "@tanstack/react-query";
import { FC, useMemo, useState } from "react";
import { ColumnInstance, Row, useTable } from "react-table";
import { toast } from "react-toastify";
import { KTCard, KTCardBody } from "../../../../../_metronic/helpers";
import { getGroupListAll } from "../../../groups/api/GroupAPI";
import { Group } from "../../api/_models";
import { GroupListHeader } from "./GroupListHeader";
import { CustomHeaderColumn } from "./columns/CustomHeaderColumn";
import { CustomRow } from "./columns/CustomRow";
import { groupColumns } from "./columns/_columns";
import { GroupsListLoading } from "./pagination/GroupsListLoading";
import { GroupsListPagination } from "./pagination/GroupsListPagination";
import { SelectedValuesProvider } from "../../HistoryContext";

const AssetGroupTable: FC = () => {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
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
    queryFn: async () => getGroupListAll(filterGroup).catch((error: any) => toast.error(error?.response?.data?.error || "Something went wrong")),
    enabled: true,
  });

  const isLoading = groupListQuery.isLoading;
  const data = useMemo(() => groupListQuery.data?.groups || [], [groupListQuery.data]);
  const columns = useMemo(() => groupColumns, []);
  const { getTableProps, getTableBodyProps, headers, rows, prepareRow } = useTable({
    columns,
    data,
  });

  const onRowClick = (rowId: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [rowId]: !prev[rowId],
    }));
  };

  return (
    <SelectedValuesProvider>
      <KTCard>
        <GroupListHeader setFilterGroup={setFilterGroup} />
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
          <GroupsListPagination filterGroup={filterGroup} setFilterGroup={setFilterGroup} />
          {isLoading && <GroupsListLoading />}
        </KTCardBody>
      </KTCard>
    </SelectedValuesProvider>
  );
};

export { AssetGroupTable };
