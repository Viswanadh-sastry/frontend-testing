import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { PageLink, PageTitle } from "../../../_metronic/layout/core";
import { UsersTable } from "./components/UserList/UsersTable";
import { EditUser } from "./components/AddEditUser/EditUser";

const userBreadCrumbs: Array<PageLink> = [
  {
    title: "Home",
    path: `/home`,
    isSeparator: false,
    isActive: false,
  },
  {
    title: "",
    path: "",
    isSeparator: true,
    isActive: false,
  },
];

const UserPage = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path=":id"
          element={
            <>
              <PageTitle breadcrumbs={userBreadCrumbs}>Edit User</PageTitle>
              <EditUser />
            </>
          }
        />
        <Route
          path="list"
          element={
            <>
              <PageTitle breadcrumbs={userBreadCrumbs}>User List</PageTitle>
              <UsersTable />
            </>
          }
        />
        <Route index element={<Navigate to="/users/list" />} />
      </Route>
    </Routes>
  );
};

export default UserPage;
