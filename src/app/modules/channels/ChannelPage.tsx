import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { PageLink, PageTitle } from "../../../_metronic/layout/core";
import { EditChannel } from "./components/AddEditChannels/EditChannels";
import { ChannelsTable } from "./components/ChannelsList/ChannelsTable";
import { ThingsTable } from "./components/ChannelThing/ThingList/ThingsTable";
import { GroupTable } from "./components/ChannelGroup/GroupsList/GroupTable";
import { DisplayUserData } from "./components/ChannelUser/AddEditUser/DisplayUserData";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";

const channelBreadCrumbs: Array<PageLink> = [
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

const ChannelPage = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path=":id"
          element={
            <>
              <PageTitle breadcrumbs={channelBreadCrumbs}>Edit Asset</PageTitle>
              <EditChannel />
            </>
          }
        />
        <Route
          path="list"
          element={
            <>
              <PageTitle breadcrumbs={channelBreadCrumbs}>Asset List</PageTitle>
              <ChannelsTable />
            </>
          }
        />
        <Route
          path=":id/assignThings"
          element={
            <>
              <PageTitle breadcrumbs={channelBreadCrumbs}>Assign Devices</PageTitle>
              <ThingsTable />
            </>
          }
        />
        <Route
          path=":id/view"
          element={
            <>
              <PageTitle breadcrumbs={channelBreadCrumbs}>Users</PageTitle>
              <DisplayUserData />
            </>
          }
        />
        <Route
          path=":id/assignGroups"
          element={
            <>
              <PageTitle breadcrumbs={channelBreadCrumbs}>Assign Asset Group</PageTitle>
              <GroupTable />
            </>
          }
        />
        <Route index element={<Navigate to="/channels/list" />} />
      </Route>
    </Routes>
  );
};

export default ChannelPage;
