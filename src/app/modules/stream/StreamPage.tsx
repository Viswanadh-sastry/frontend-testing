import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { PageLink, PageTitle } from "../../../_metronic/layout/core";
import { StreamTable } from "./components/StreamList/StreamTable";
import { EditStream } from "./components/AddEditStream/EditStream";

const streamBreadCrumbs: Array<PageLink> = [
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

const StreamPage = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path="edit/:id"
          element={
            <>
              <PageTitle breadcrumbs={streamBreadCrumbs}>Edit Stream</PageTitle>
              <EditStream />
            </>
          }
        />
        <Route
          path="list"
          element={
            <>
              <PageTitle breadcrumbs={streamBreadCrumbs}>Stream List</PageTitle>
              <StreamTable />
            </>
          }
        />
        <Route index element={<Navigate to="/stream/list" />} />
      </Route>
    </Routes>
  );
};

export default StreamPage;
