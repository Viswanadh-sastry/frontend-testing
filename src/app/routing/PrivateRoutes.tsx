import { FC, lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { MasterLayout } from "../../_metronic/layout/MasterLayout";
import TopBarProgress from "react-topbar-progress-indicator";
// import { HomeWrapper } from "../modules/home/HomeWrapper";
import { getCSSVariableValue } from "../../_metronic/assets/ts/_utils";
import { WithChildren } from "../../_metronic/helpers";
import BuilderPageWrapper from "../pages/layout-builder/BuilderPageWrapper";

const PrivateRoutes = () => {
  const HomeWrapper = lazy(() => import("../modules/home/HomeWrapper"));
  const DomainsPage = lazy(() => import("../modules/domains/DomainsPage"));
  const InvitationPage = lazy(() => import("../modules/invitations/InvitationPage"));
  const UserPage = lazy(() => import("../modules/users/UserPage"));
  const ReportPage = lazy(() => import("../modules/reports/ReportPage"));
  const ProfilePage = lazy(() => import("../modules/profile/ProfilePage"));
  const ThingPage = lazy(() => import("../modules/things/ThingPage"));
  const ChannelPage = lazy(() => import("../modules/channels/ChannelPage"));
  const GroupPage = lazy(() => import("../modules/groups/GroupPage"));
  const History = lazy(() => import("../modules/histories/HistoriesPage"));
  const DashboardPage = lazy(() => import("../modules/dashboard/DashboardPage"));

  const StreamPage = lazy(() => import("../modules/stream/StreamPage"));
  const RulePage = lazy(() => import("../modules/rules/RulePage"));
  const NotificationPage = lazy(() => import("../modules/notifications/NotificationPage"));
  const SubscriptionPage = lazy(() => import("../modules/subscriptions/SubscriptionPage"));

  return (
    <Routes>
      <Route element={<MasterLayout />}>
        <Route path="auth/*" element={<Navigate to="/home" />} />
        {/* Pages */}
        <Route
          path="home"
          element={
            <SuspensedView>
              <HomeWrapper />
            </SuspensedView>
          }
        />
        <Route
          path="dashboard/*"
          element={
            <SuspensedView>
              <DashboardPage />
            </SuspensedView>
          }
        />
        <Route
          path="builder"
          element={
            <SuspensedView>
              <BuilderPageWrapper />
            </SuspensedView>
          }
        />
        {/* Lazy Modules */}
        <Route
          path="domains/*"
          element={
            <SuspensedView>
              <DomainsPage />
            </SuspensedView>
          }
        />
        <Route
          path="invitations/*"
          element={
            <SuspensedView>
              <InvitationPage />
            </SuspensedView>
          }
        />
        <Route
          path="users/*"
          element={
            <SuspensedView>
              <UserPage />
            </SuspensedView>
          }
        />
        <Route
          path="groups/*"
          element={
            <SuspensedView>
              <GroupPage />
            </SuspensedView>
          }
        />

        <Route
          path="history/*"
          element={
            <SuspensedView>
              <History />
            </SuspensedView>
          }
        />

        <Route
          path="things/*"
          element={
            <SuspensedView>
              <ThingPage />
            </SuspensedView>
          }
        />
        <Route
          path="channels/*"
          element={
            <SuspensedView>
              <ChannelPage />
            </SuspensedView>
          }
        />
        <Route
          path="report/*"
          element={
            <SuspensedView>
              <ReportPage />
            </SuspensedView>
          }
        />
        <Route
          path="profile/*"
          element={
            <SuspensedView>
              <ProfilePage />
            </SuspensedView>
          }
        />

        <Route
          path="stream/*"
          element={
            <SuspensedView>
              <StreamPage />
            </SuspensedView>
          }
        />
        <Route
          path="rule/*"
          element={
            <SuspensedView>
              <RulePage />
            </SuspensedView>
          }
        />
        <Route
          path="notifications/*"
          element={
            <SuspensedView>
              <NotificationPage />
            </SuspensedView>
          }
        />
        <Route
          path="subscriptions/*"
          element={
            <SuspensedView>
              <SubscriptionPage />
            </SuspensedView>
          }
        />
        {/* Page Not Found */}
        <Route path="*" element={<Navigate to="/error/404" />} />
      </Route>
    </Routes>
  );
};

const SuspensedView: FC<WithChildren> = ({ children }) => {
  const baseColor = getCSSVariableValue("--bs-primary");
  TopBarProgress.config({
    barColors: {
      "0": baseColor,
    },
    barThickness: 1,
    shadowBlur: 5,
  });
  return <Suspense fallback={<TopBarProgress />}>{children}</Suspense>;
};

export { PrivateRoutes };
