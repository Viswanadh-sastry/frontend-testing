import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ColumnInstance, Row, useTable } from "react-table";
import { toast } from "react-toastify";
import { KTCard, KTCardBody } from "../../../../../_metronic/helpers";
import { Invitation } from "../../api/_models";
import { InvitationsListHeader } from "./InvitationsListHeader";
import { CustomHeaderColumn } from "./columns/CustomHeaderColumn";
import { CustomRow } from "./columns/CustomRow";
import { invitationsColumns } from "./columns/_columns";
import { InvitationsListLoading } from "./pagination/InvitationsListLoading";
import { InvitationsListPagination } from "./pagination/InvitationsListPagination";
// import { InviteUser } from "../InviteUser/InviteUser";
import * as roleHelper from "../../../auth/core/RoleHelpers";
import { getDomain } from "../../../domains/api/DomainsAPI";
import { getUser } from "../../../users/api/UserAPI";
import { getInvitationList } from "../../api/InvitationAPI";

const InvitationsTable = () => {
  const role = roleHelper.getRole();
  // const [showInviteUser, setShowInviteUser] = useState(false);
  const [filterInvitation, setFilterInvitation] = useState({
    limit: 10,
    offset: 0,
    invited_by: "",
    domain_id: "",
    user_id: "",
    relation: "",
    state: "pending",
  });
  const invitationListQuery = useQuery({
    queryKey: [`invitationList`, filterInvitation],
    queryFn: async () =>
      getInvitationList(filterInvitation)
        .then(async (response) => {
          const invitations = await Promise.all(
            response.invitations.map(async (invitation: any) => ({
              ...invitation,
              toUserName: await getUser(invitation.user_id)
                .then((user) => user.name)
                .catch(() => invitation.user_id),
              fromUserName: await getUser(invitation.invited_by)
                .then((user) => user.name)
                .catch(() => invitation.invited_by),
              domainName: await getDomain(invitation.domain_id)
                .then((domain) => domain.name)
                .catch(() => invitation.domain_id),
            }))
          );
          return { ...response, invitations };
        })
        .catch((error) => toast.error(error?.response?.data?.error || "Something went wrong")),
    enabled: true,
  });
  const isLoading = invitationListQuery.isLoading;
  const data = useMemo(() => invitationListQuery.data?.invitations || [], [invitationListQuery.data]);
  const columns = useMemo(() => invitationsColumns, []);
  const { getTableProps, getTableBodyProps, headers, rows, prepareRow } = useTable({
    columns,
    data,
  });

  // const onShowInviteUser = () => {
  //   setShowInviteUser(true);
  // };

  // const onCloseInviteUser = () => {
  //   setShowInviteUser(false);
  // };

  // const onGetInvitationList = () => {
  //   invitationListQuery.refetch();
  // };

  return (
    <KTCard>
      <InvitationsListHeader invitationListQuery={invitationListQuery} />
      <KTCardBody className="py-4">
        <div className="table-responsive">
          <table id="kt_table_invitations" className="table align-middle table-row-dashed fs-6 dataTable no-footer" {...getTableProps()}>
            <thead>
              <tr className="text-start text-muted fw-bolder fs-7 text-uppercase gs-0">
                {headers.map((column: ColumnInstance<Invitation>) => (column.id !== "actions" || role !== "viewer") && <CustomHeaderColumn key={column.id} column={column} />)}
              </tr>
            </thead>
            <tbody className="text-gray-600" {...getTableBodyProps()}>
              {rows.length > 0 ? (
                rows.map((row: Row<Invitation>, i) => {
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
        <InvitationsListPagination filterInvitation={filterInvitation} setFilterInvitation={setFilterInvitation} />
        {/* {showInviteUser && <InviteUser onCloseInviteUser={onCloseInviteUser} onGetInvitationList={onGetInvitationList} />} */}
        {isLoading && <InvitationsListLoading />}
      </KTCardBody>
    </KTCard>
  );
};

export { InvitationsTable };
