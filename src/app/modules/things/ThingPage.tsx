import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { PageLink, PageTitle } from "../../../_metronic/layout/core";
import { ThingsTable } from "./components/ThingList/ThingsTable";
import { EditThing } from "./components/AddEditThing/EditThing";
import { UserTable } from "./components/UserList/UserTable";
import { ChannelTable } from "./components/ThingsChannel/ChannelList/ChannelTable";
import { DisplayUserData } from "./components/AddEditUser/DisplayUserData";

const thingBreadCrumbs: Array<PageLink> = [
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

const ThingPage = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path=":id"
          element={
            <>
              <PageTitle breadcrumbs={thingBreadCrumbs}>Edit Device</PageTitle>
              <EditThing />
            </>
          }
        />
        <Route
          path="list"
          element={
            <>
              <PageTitle breadcrumbs={thingBreadCrumbs}>Device List</PageTitle>
              <ThingsTable />
            </>
          }
        />
        <Route
          path=":id/assignUsers"
          element={
            <>
              <PageTitle breadcrumbs={thingBreadCrumbs}>Assign Members</PageTitle>
              <UserTable />
            </>
          }
        />

        <Route
          path=":id/view"
          element={
            <>
              <PageTitle breadcrumbs={thingBreadCrumbs}>Member</PageTitle>
              <DisplayUserData />
            </>
          }
        />

        <Route
          path=":id/assignChannels"
          element={
            <>
              <PageTitle breadcrumbs={thingBreadCrumbs}>Assign Asset</PageTitle>
              <ChannelTable />
            </>
          }
        />

        <Route index element={<Navigate to="/things/list" />} />
      </Route>
    </Routes>
  );
};

export default ThingPage;
