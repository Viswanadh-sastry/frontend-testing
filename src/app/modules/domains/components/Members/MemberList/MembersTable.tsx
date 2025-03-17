import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useTable, ColumnInstance, Row } from "react-table";
import { CustomHeaderColumn } from "./columns/CustomHeaderColumn";
import { CustomRow } from "./columns/CustomRow";
import { membersColumns } from "./columns/_columns";
import { Member } from "../../../api/_models";
import { KTCard, KTCardBody } from "../../../../../../_metronic/helpers";
import { MembersListPagination } from "./pagination/MembersListPagination";
import { MembersListLoading } from "./pagination/MembersListLoading";
import { MembersListHeader } from "./MembersListHeader";
import { AssignUser } from "../AssignUser/AssignUser";
import { getMemberList } from "../../../api/MembersAPI";

const MembersTable = () => {
  const params = useParams();
  const domainId = params.id as string;
  const [showAddMember, setShowAddMember] = useState(false);
  const [filterMember, setFilterMember] = useState({
    limit: 10,
    offset: 0,
    metadata: "",
    status: "enabled",
  });
  const memberListQuery = useQuery({
    queryKey: [`memberList`, domainId, filterMember],
    queryFn: async () => getMemberList(domainId, filterMember).catch((error) => toast.error(error?.response?.data?.error || "Something went wrong")),
    enabled: true,
  });
  const isLoading = memberListQuery.isLoading;
  const data = useMemo(() => memberListQuery.data?.users || [], [memberListQuery.data]);
  const columns = useMemo(() => membersColumns, []);
  const { getTableProps, getTableBodyProps, headers, rows, prepareRow } = useTable({
    columns,
    data,
  });

  const onShowAddMember = () => {
    setShowAddMember(true);
  };

  const onCloseAddMember = () => {
    setShowAddMember(false);
  };

  const onGetMemberList = () => {
    memberListQuery.refetch();
  };

  return (
    <KTCard>
      <MembersListHeader onShowAddMember={onShowAddMember} />
      <KTCardBody className="py-4">
        <div className="table-responsive">
          <table id="kt_table_members" className="table align-middle table-row-dashed fs-6 dataTable no-footer" {...getTableProps()}>
            <thead>
              <tr className="text-start text-muted fw-bolder fs-7 text-uppercase gs-0">
                {headers.map((column: ColumnInstance<Member>) => (
                  <CustomHeaderColumn key={column.id} column={column} />
                ))}
              </tr>
            </thead>
            <tbody className="text-gray-600" {...getTableBodyProps()}>
              {rows.length > 0 ? (
                rows.map((row: Row<Member>, i) => {
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
        <MembersListPagination filterMember={filterMember} setFilterMember={setFilterMember} />
        {showAddMember && <AssignUser onCloseAddMember={onCloseAddMember} onGetMemberList={onGetMemberList} />}
        {isLoading && <MembersListLoading />}
      </KTCardBody>
    </KTCard>
  );
};

export { MembersTable };
