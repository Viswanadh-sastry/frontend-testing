import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { PageLink, PageTitle } from "../../../_metronic/layout/core";
import { SubscriptionTable } from "./components/SubscriptionList/SubscriptionTable";

const subscriptionBreadCrumbs: Array<PageLink> = [
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

const SubscriptionPage = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path="list"
          element={
            <>
              <PageTitle breadcrumbs={subscriptionBreadCrumbs}>Subscription List</PageTitle>
              <SubscriptionTable />
            </>
          }
        />
        <Route index element={<Navigate to="/subscriptions/list" />} />
      </Route>
    </Routes>
  );
};

export default SubscriptionPage;
