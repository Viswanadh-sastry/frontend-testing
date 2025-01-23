import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { getDomain } from "../../../../../app/modules/auth/core/DomainHelpers";
import { getRolePermission, MODULENAME } from "../../../../../app/modules/auth/core/RoleHelpers";
import { SidebarMenuItem } from "./SidebarMenuItem";
import { SidebarMenuItemWithSub } from "./SidebarMenuItemWithSub";

const SidebarMenuMain = () => {
  const intl = useIntl();
  const { id, name } = getDomain();
  const [rolePermission, setRolePermission] = useState<any>(null);

  useEffect(() => {
    const fetchRolePermission = async () => {
      const permission = await getRolePermission(MODULENAME.ORGANIZATIONINVITATION);
      setRolePermission(permission);
    };
    fetchRolePermission();
  }, []);

  return (
    <>
      <SidebarMenuItem to="/home" icon="element-11" title={intl.formatMessage({ id: "MENU.HOME" })} fontIcon="bi-app-indicator" />
      <SidebarMenuItem to="/dashboard" icon="graph-3" title="Dashboard" fontIcon="bi-app-indicator" />
      <div className="menu-item">
        <div className="menu-content pt-8 pb-2">
          <span className="menu-section text-muted text-uppercase fs-8 ls-1">Organizations Management</span>
        </div>
      </div>
      <SidebarMenuItemWithSub to="" title="Organizations" icon="element-6">
        <SidebarMenuItem to="/domains/list" title="Organizations" icon="element-6" />
        <SidebarMenuItem to="/invitations/list" title="Invitations" icon="sms" />
      </SidebarMenuItemWithSub>
      <SidebarMenuItemWithSub to="" title={name} icon="office-bag">
        <SidebarMenuItem to={`/domains/${id}/view`} title="Organization" icon="office-bag" />
        <SidebarMenuItem to={`/domains/${id}/members`} title="Members" icon="people" />
        {rolePermission?.menu && <SidebarMenuItem to={`/invitations/${id}`} title="Organization Invitations" icon="sms" />}
        {/* <SidebarMenuItem to="/domains/role" title="Roles" hasBullet={true} /> */}
      </SidebarMenuItemWithSub>
      <SidebarMenuItem to="/users" title="Users" icon="user" />
      <div className="menu-item">
        <div className="menu-content pt-8 pb-2">
          <span className="menu-section text-muted text-uppercase fs-8 ls-1">Devices Management</span>
        </div>
      </div>
      <SidebarMenuItem to="/groups" title="Asset Groups" icon="abstract-26" />
      <SidebarMenuItem to="/channels" title="Assets" icon="arrow-right-left" />
      <SidebarMenuItem to="/things" title="Devices" icon="technology" />
      <div className="menu-item">
        <div className="menu-content pt-8 pb-2">
          <span className="menu-section text-muted text-uppercase fs-8 ls-1">Data Management</span>
        </div>
      </div>
      <SidebarMenuItemWithSub to="" title="Telemetry" icon="notification-status">
        <SidebarMenuItem to="/history/group" title="Asset Group History" icon="abstract-26" />
        <SidebarMenuItem to="/history/asset" title="Asset History" icon="arrow-right-left" />
        <SidebarMenuItem to="/history/device" title="Device History" icon="technology" />
      </SidebarMenuItemWithSub>
      {/* <div className="menu-item">
        <div className="menu-content pt-8 pb-2">
          <span className="menu-section text-muted text-uppercase fs-8 ls-1">Report</span>
        </div>
      </div>
      <SidebarMenuItem to="/report" title="Reports" icon="chart" /> */}
      <div className="menu-item">
        <div className="menu-content pt-8 pb-2">
          <span className="menu-section text-muted text-uppercase fs-8 ls-1">EDGE</span>
        </div>
      </div>
      <SidebarMenuItemWithSub to="" title="Rule Engine" icon="code">
        <SidebarMenuItem to="/stream" title="Stream" icon="square-brackets" />
        <SidebarMenuItem to="/rule" title="Rules" icon="code" />
      </SidebarMenuItemWithSub>
      <SidebarMenuItem to="/notifications" title="Notifications" icon="notification" />
      <SidebarMenuItem to="/subscriptions" title="Subscriptions" icon="tablet-text-up" />
    </>
  );
};

export { SidebarMenuMain };
