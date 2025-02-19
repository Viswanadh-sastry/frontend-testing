import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { PageLink, PageTitle } from "../../../_metronic/layout/core";
import { ApplicationTable } from "./components/ApplicationList/ApplicationTable";
import { AddApplication } from "./components/AddEditApplication/AddApplication";
import { EditApplication } from "./components/AddEditApplication/EditApplication";

const applicationBreadCrumbs: Array<PageLink> = [
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

const ApplicationPage = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path="list"
          element={
            <>
              <PageTitle breadcrumbs={applicationBreadCrumbs}>Application List</PageTitle>
              <ApplicationTable />
            </>
          }
        />
        <Route
          path="add"
          element={
            <>
              <PageTitle breadcrumbs={applicationBreadCrumbs}>Add Application</PageTitle>
              <AddApplication />
            </>
          }
        />
        <Route
          path=":id/*"
          element={
            <>
              <PageTitle breadcrumbs={applicationBreadCrumbs}>Edit Application</PageTitle>
              <EditApplication />
            </>
          }
        />
        <Route index element={<Navigate to="/applications/list" />} />
      </Route>
    </Routes>
  );
};

export default ApplicationPage;
