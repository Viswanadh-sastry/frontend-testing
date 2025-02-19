import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { PageLink, PageTitle } from "../../../_metronic/layout/core";
import { DeviceProfileTable } from "./components/DeviceProfileList/DeviceProfileTable";
import { AddDeviceProfile } from "./components/AddEditDeviceProfile/AddDeviceProfile";
import { EditDeviceProfile } from "./components/AddEditDeviceProfile/EditDeviceProfile";

const deviceProfileBreadCrumbs: Array<PageLink> = [
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

const DeviceProfilePage = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path="list"
          element={
            <>
              <PageTitle breadcrumbs={deviceProfileBreadCrumbs}>Device Profile List</PageTitle>
              <DeviceProfileTable />
            </>
          }
        />
        <Route
          path="add"
          element={
            <>
              <PageTitle breadcrumbs={deviceProfileBreadCrumbs}>Add Device Profile</PageTitle>
              <AddDeviceProfile />
            </>
          }
        />
        <Route
          path=":id"
          element={
            <>
              <PageTitle breadcrumbs={deviceProfileBreadCrumbs}>Edit Device Profile</PageTitle>
              <EditDeviceProfile />
            </>
          }
        />
        <Route index element={<Navigate to="/device-profiles/list" />} />
      </Route>
    </Routes>
  );
};

export default DeviceProfilePage;
