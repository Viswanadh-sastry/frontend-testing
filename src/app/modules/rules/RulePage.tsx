import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { PageLink, PageTitle } from "../../../_metronic/layout/core";
import { RuleTable } from "./components/RuleList/RuleTable";
import { AddRule } from "./components/AddEditRule/AddRule";
import { EditRule } from "./components/AddEditRule/EditRule";

const ruleBreadCrumbs: Array<PageLink> = [
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

const RulePage = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path="list"
          element={
            <>
              <PageTitle breadcrumbs={ruleBreadCrumbs}>Rule List</PageTitle>
              <RuleTable />
            </>
          }
        />
        <Route
          path="add"
          element={
            <>
              <PageTitle breadcrumbs={ruleBreadCrumbs}>Add Rule</PageTitle>
              <AddRule />
            </>
          }
        />
        <Route
          path=":name/*"
          element={
            <>
              <PageTitle breadcrumbs={ruleBreadCrumbs}>Edit Rule</PageTitle>
              <EditRule />
            </>
          }
        />
        <Route index element={<Navigate to="/rule/list" />} />
      </Route>
    </Routes>
  );
};

export default RulePage;
