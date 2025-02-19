import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { PageLink, PageTitle } from "../../../_metronic/layout/core";
import { GatewayTable } from "./components/GatewayList/GatewayTable";
import { AddGateway } from "./components/AddEditGateway/AddGateway";
import { EditGateway } from "./components/AddEditGateway/EditGateway";

const gatewayBreadCrumbs: Array<PageLink> = [
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

const GatewayPage = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path="list"
          element={
            <>
              <PageTitle breadcrumbs={gatewayBreadCrumbs}>Gateway List</PageTitle>
              <GatewayTable />
            </>
          }
        />
        <Route
          path="add"
          element={
            <>
              <PageTitle breadcrumbs={gatewayBreadCrumbs}>Add Gateway</PageTitle>
              <AddGateway />
            </>
          }
        />
        <Route
          path=":id"
          element={
            <>
              <PageTitle breadcrumbs={gatewayBreadCrumbs}>Edit Gateway</PageTitle>
              <EditGateway />
            </>
          }
        />
        <Route index element={<Navigate to="/gateways/list" />} />
      </Route>
    </Routes>
  );
};

export default GatewayPage;
