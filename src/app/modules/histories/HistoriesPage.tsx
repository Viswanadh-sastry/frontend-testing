import "primeicons/primeicons.css";
import "primereact/resources/primereact.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { PageLink, PageTitle } from "../../../_metronic/layout/core";
import { AssetTable } from "./AssetList/AssetTable";
import { ChannelsTable } from "./AssetList/ChannelsList/ChannelsTable";
import { DeviceTable } from "./DeviceList/DeviceTable";
import { ThingsTable } from "./DeviceList/ThingList/ThingsTable";
import { GroupTable } from "./GroupList/GroupTable";
import { AssetGroupTable } from "./GroupList/AssetGroupsList/AssetGroupTable";

const groupBreadCrumbs: Array<PageLink> = [
  { title: "Home", path: `/home`, isSeparator: false, isActive: false },
  { title: "", path: "", isSeparator: true, isActive: false },
];

const GroupPage = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path="group"
          element={
            <>
              <PageTitle breadcrumbs={groupBreadCrumbs}>Asset Group List</PageTitle>
              <AssetGroupTable />
            </>
          }
        />
        <Route
          path="group/list"
          element={
            <>
              <PageTitle breadcrumbs={groupBreadCrumbs}>Asset Group History</PageTitle>
              <GroupTable />
            </>
          }
        />
        <Route
          path="asset/list"
          element={
            <>
              <PageTitle breadcrumbs={groupBreadCrumbs}>Asset History</PageTitle>
              <AssetTable />
            </>
          }
        />
        <Route
          path="asset"
          element={
            <>
              <PageTitle breadcrumbs={groupBreadCrumbs}>Asset List</PageTitle>
              <ChannelsTable />
            </>
          }
        />
        <Route
          path="asset/:id"
          element={
            <>
              <PageTitle breadcrumbs={groupBreadCrumbs}>Asset History</PageTitle>
              <AssetTable />
            </>
          }
        />
        <Route
          path="device"
          element={
            <>
              <PageTitle breadcrumbs={groupBreadCrumbs}>Device List</PageTitle>
              <ThingsTable />
            </>
          }
        />
        <Route
          path="device/list"
          element={
            <>
              <PageTitle breadcrumbs={groupBreadCrumbs}>Device History</PageTitle>
              <DeviceTable />
            </>
          }
        />

        <Route
          path="device/:id"
          element={
            <>
              <PageTitle breadcrumbs={groupBreadCrumbs}>Device History</PageTitle>
              <DeviceTable />
            </>
          }
        />
        <Route index element={<Navigate to="/history/asset/List" />} />
      </Route>
    </Routes>
  );
};

export default GroupPage;
