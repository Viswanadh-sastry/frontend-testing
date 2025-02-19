import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { PageLink, PageTitle } from "../../../_metronic/layout/core";
import { GroupTable } from "./components/GroupsList/GroupTable";
import { EditGroup } from "./components/AddEditGroup/EditGroup";
import { GroupChannelTable } from "./components/GroupChannel/GroupChannelList/GroupChannelTable";
import { DisplayUserData } from "./components/GroupUser/AddEditUser/DisplayUserData";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";

const groupBreadCrumbs: Array<PageLink> = [
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

const GroupPage = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path=":id"
          element={
            <>
              <PageTitle breadcrumbs={groupBreadCrumbs}>Edit Asset Group</PageTitle>
              <EditGroup />
            </>
          }
        />

        <Route
          path=":id/assignChannels"
          element={
            <>
              <PageTitle breadcrumbs={groupBreadCrumbs}>Assign Assets</PageTitle>
              <GroupChannelTable />
            </>
          }
        />

        <Route
          path=":id/user"
          element={
            <>
              <PageTitle breadcrumbs={groupBreadCrumbs}>Member</PageTitle>
              <DisplayUserData />
            </>
          }
        />

        <Route
          path="list"
          element={
            <>
              <PageTitle breadcrumbs={groupBreadCrumbs}>Asset Group List</PageTitle>
              <GroupTable />
            </>
          }
        />
        <Route index element={<Navigate to="/groups/list" />} />
      </Route>
    </Routes>
  );
};

export default GroupPage;
