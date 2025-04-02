import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ColumnInstance, Row, useTable } from "react-table";
import { toast } from "react-toastify";
import { KTCard, KTCardBody } from "../../../../../_metronic/helpers";
import { getThingUsersList } from "../../api/ThingUserAPI";
import { User } from "../../api/_models";
import { AddUser } from "../AddEditUser/AddUser";
import { UserListHeader } from "./UserListHeader";
import { CustomHeaderColumn } from "./columns/CustomHeaderColumn";
import { CustomRow } from "./columns/CustomRow";
import { userColumns } from "./columns/_columns";
import { UserListLoading } from "./pagination/UserListLoading";
import { UserListPagination } from "./pagination/UserListPagination";
import { useParams } from "react-router-dom";
import { KTIcon } from "../../../../../_metronic/helpers";

const UserTable = () => {
  const [tab, setTab] = useState("admin");
  const params = useParams();
  const id = params.id as string;

  const [showAddUser, setShowAddUser] = useState(false);
  const [filterUser, setFilterUser] = useState({
    limit: 10,
    offset: 0,
    name: "",
    metadata: "",
    permission: tab,
    status: "enabled",
  });
  const userListQuery = useQuery({
    queryKey: [`userList`, filterUser],
    queryFn: async () => getThingUsersList(id, filterUser).catch((error) => toast.error(error?.response?.data?.message || "Something went wrong")),
    enabled: true,
  });
  const isLoading = userListQuery.isLoading;
  const data = useMemo(() => userListQuery.data?.users || [], [userListQuery.data]);
  const columns = useMemo(() => userColumns, []);
  const { getTableProps, getTableBodyProps, headers, rows, prepareRow } = useTable({
    columns,
    data,
  });

  const onShowAddUser = () => {
    setShowAddUser(true);
  };

  const onCloseAddUser = () => {
    setShowAddUser(false);
  };

  const onGetUserList = () => {
    userListQuery.refetch();
  };

  return (
    <>
      <div className="card-header d-flex justify-content-between py-6 px-9">
        <div className="card-title">
          <h3 className="fw-bolder">Members</h3>
        </div>

        <div className="card-header d-flex justify-content-end ">
          <button type="button" className="btn btn-light mx-2" onClick={() => window.history.back()}>
            <i className="bi bi-arrow-left"></i>
            Back
          </button>
          <div className="card-toolbar">
            <div className="d-flex justify-content-end" data-kt-user-table-toolbar="base">
              <button type="button" className="btn btn-primary" onClick={onShowAddUser}>
                <KTIcon iconName="plus" className="fs-2" />
                Add User
              </button>
            </div>
          </div>
        </div>
      </div>

      <KTCard>
        <UserListHeader setFilterUser={setFilterUser} tab={tab} setTab={setTab} />
        <KTCardBody className="py-4 mt-5">
          <div className="table-responsive">
            <table id="kt_table_groups" className="table align-middle table-row-dashed fs-6 dataTable no-footer" {...getTableProps()}>
              <thead>
                <tr className="text-start text-muted fw-bolder fs-7 text-uppercase gs-0">
                  {headers.map((column: ColumnInstance<User>) => (
                    <CustomHeaderColumn key={column.id} column={column} />
                  ))}
                </tr>
              </thead>
              <tbody className="text-gray-600" {...getTableBodyProps()}>
                {rows.length > 0 ? (
                  rows.map((row: Row<User>, i) => {
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
          <UserListPagination filterUser={filterUser} setFilterUser={setFilterUser} />
          {showAddUser && <AddUser onCloseAddUser={onCloseAddUser} onGetUserList={onGetUserList} />}
          {isLoading && <UserListLoading />}
        </KTCardBody>
      </KTCard>
    </>
  );
};

export { UserTable };
