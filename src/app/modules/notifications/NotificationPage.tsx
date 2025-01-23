import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { PageLink, PageTitle } from "../../../_metronic/layout/core";
import { NotificationTable } from "./components/NotificationList/NotificationTable";

const notificationBreadCrumbs: Array<PageLink> = [
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

const NotificationPage = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path="list"
          element={
            <>
              <PageTitle breadcrumbs={notificationBreadCrumbs}>Notification List</PageTitle>
              <NotificationTable />
            </>
          }
        />
        <Route index element={<Navigate to="/notifications/list" />} />
      </Route>
    </Routes>
  );
};

export default NotificationPage;
