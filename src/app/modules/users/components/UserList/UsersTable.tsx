import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { ColumnInstance, Row, useTable } from "react-table";
import { toast } from "react-toastify";
import { KTCard, KTCardBody, PaginationState } from "../../../../../_metronic/helpers";
import { User } from "../../api/_models";
import { getUserListAll } from "../../api/UserAPI";
import { AddUser } from "../AddEditUser/AddUser";
import { ImportUser } from "../AddEditUser/ImportUser/ImportUser";
import { usersColumns } from "./columns/_columns";
import { CustomHeaderColumn } from "./columns/CustomHeaderColumn";
import { CustomRow } from "./columns/CustomRow";
import { UsersListLoading } from "./pagination/UsersListLoading";
import { UsersListPagination } from "./pagination/UsersListPagination";
import { UsersListHeader } from "./UsersListHeader";
import { getRolePermission, MODULENAME } from "../../../auth/core/RoleHelpers";

const UsersTable = () => {
  const [rolePermission, setRolePermission] = useState<any>(null);

  useEffect(() => {
    const fetchRolePermission = async () => {
      const permission = await getRolePermission(MODULENAME.USERSLIST);
      setRolePermission(permission);
    };
    fetchRolePermission();
  }, []);

  const [showAddUser, setShowAddUser] = useState(false);
  const [importModal, setImportModal] = useState(false);
  const [data, setData] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<any>(10);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    items_per_page: 10,
    links: [],
  });
  const [userList, setUserList] = useState<any>([]);
  const [filterUser, setFilterUser] = useState({
    limit: 100,
    offset: 0,
    name: "",
    identity: "",
    metadata: "",
    tags: "",
    status: "enabled",
  });
  const userListQuery = useQuery({
    queryKey: [`userList`, filterUser],
    queryFn: async () => getUserListAll(filterUser).catch((error) => toast.error(error?.response?.data?.message || "Something went wrong")),
    enabled: true,
  });
  const isLoading = userListQuery.isLoading;
  const columns = useMemo(() => usersColumns, []);
  const { getTableProps, getTableBodyProps, headers, rows, prepareRow } = useTable({
    columns,
    data,
  });

  useEffect(() => {
    if (userListQuery.data?.users) {
      setUserList(userListQuery.data.users || []);
    }
  }, [userListQuery.data?.users]);
  useEffect(() => {
    setData(
      userList.filter((_: any, index: number) => {
        return index >= (currentPage - 1) * itemsPerPage && index < currentPage * itemsPerPage;
      })
    );
  }, [userList, currentPage, itemsPerPage]);

  const onShowAddUser = () => {
    setShowAddUser(true);
  };

  const onCloseAddUser = () => {
    setShowAddUser(false);
  };

  const onGetUserList = () => {
    userListQuery.refetch();
  };

  const onShowImportUser = () => setImportModal(true);
  const onCloseImportUser = () => setImportModal(false);

  return (
    <KTCard>
      <UsersListHeader
        onShowAddUser={onShowAddUser}
        onShowImportUser={onShowImportUser}
        setCurrentPage={setCurrentPage}
        setPagination={setPagination}
        setFilterUser={setFilterUser}
        setUserList={setUserList}
        userList={userList}
        userListQuery={userListQuery}
        pagination={pagination}
      />
      <KTCardBody className="py-4">
        <div className="table-responsive">
          <table id="kt_table_users" className="table align-middle table-row-dashed fs-6 dataTable no-footer" {...getTableProps()}>
            <thead>
              <tr className="text-start text-muted fw-bolder fs-7 text-uppercase gs-0">
                {headers.map((column: ColumnInstance<User>) => (column.id !== "actions" || rolePermission?.view) && <CustomHeaderColumn key={column.id} column={column} />)}
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
        <UsersListPagination
          userList={userList}
          itemsPerPage={itemsPerPage}
          pagination={pagination}
          data={data}
          setCurrentPage={setCurrentPage}
          setItemsPerPage={setItemsPerPage}
          setPagination={setPagination}
          setData={setData}
        />
        {showAddUser && <AddUser onCloseAddUser={onCloseAddUser} onGetUserList={onGetUserList} />}
        {importModal && <ImportUser onShowImportUser={importModal} onCloseImportUser={onCloseImportUser} onGetUserList={onGetUserList} />}
        {isLoading && <UsersListLoading />}
      </KTCardBody>
    </KTCard>
  );
};

export { UsersTable };
