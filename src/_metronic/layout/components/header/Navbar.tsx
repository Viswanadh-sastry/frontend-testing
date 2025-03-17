import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { useMemo } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { getUserDetails, loginWithDomain } from "../../../../app/modules/auth/core/_requests";
import { useAuth } from "../../../../app/modules/auth/core/Auth";
import { getCred } from "../../../../app/modules/auth/core/CredentialHelpers";
import { getDomain, removeDAuth, setDomain } from "../../../../app/modules/auth/core/DomainHelpers";
import { setRole } from "../../../../app/modules/auth/core/RoleHelpers";
import { getDomainListAll } from "../../../../app/modules/domain/api/DomainAPI";
import { KTIcon, toAbsoluteUrl } from "../../../helpers";
import { HeaderUserMenu, ThemeModeSwitcher } from "../../../partials";
import { useLayout } from "../../core";

const itemClass = "ms-1 ms-md-4";
// const btnClass = "btn btn-icon btn-custom btn-icon-muted btn-active-light btn-active-color-primary w-35px h-35px";
const userAvatarClass = "symbol-35px";
const btnIconClass = "fs-2";

const Navbar = () => {
  const { saveAuth, setCurrentUser } = useAuth();
  const { id, name } = getDomain();
  const { config } = useLayout();
  const filterDomain = {
    offset: 0,
    limit: 100,
    name: "",
    permission: "",
    status: "enabled",
  };
  const domainListQuery = useQuery({
    queryKey: [`domainListQuery`, filterDomain],
    queryFn: async () => getDomainListAll(filterDomain).catch((error) => toast.error(error?.response?.data?.error || "Something went wrong")),
    enabled: true,
  });
  // const isLoading = domainListQuery.isLoading;
  const data = useMemo(() => domainListQuery.data?.domains || [], [domainListQuery.data]);

  const onSelectOrganization = (domainId: string, domainName: string, permission: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Are you sure you want to switch to ${domainName} organization?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, switch it!",
      cancelButtonText: "Cancel",
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-secondary",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        if (!domainId) {
          toast.info("Please select a organization");
          return;
        }
        const { identity, secret } = getCred() || {};
        if (!identity || !secret) {
          toast.error("No identity or secret found");
          return;
        }
        loginWithDomain(identity, secret, domainId)
          .then(async (auth) => {
            if (!auth.access_token) {
              throw new Error("No access token found");
            }

            setRole(permission || "");

            // credHelper.removeCred();
            removeDAuth();
            setDomain({ id: domainId, name: domainName });

            saveAuth(auth);
            const user = await getUserDetails();

            setCurrentUser(user);
            window.location.reload();
          })
          .catch((error) => {
            toast.error(error?.response?.data?.error || "Something went wrong");
            saveAuth(undefined);
          });
      }
    });
  };

  return (
    <div className="app-navbar flex-shrink-0">
      {name && (
        <div className={clsx("app-navbar-item", itemClass)}>
          {/* begin::Label */}
          {/* <span className="fs-7 fw-bolder text-gray-700 pe-4 text-nowrap d-none d-xxl-block">Organization:</span> */}
          {/* end::Label */}

          {/* Label value */}
          {/* <span className="fs-7 fw-bold text-gray-500 text-nowrap d-none d-xxl-block">{name}</span> */}
          {/* end::Label value */}
          <a
            href="#"
            className={clsx("btn btn-light btn-active-light-primary btn-sm ", "btn-active-light-primary btn-custom")}
            data-kt-menu-trigger="{default: 'click', lg: 'hover'}"
            data-kt-menu-attach="parent"
            data-kt-menu-placement="bottom-end"
          >
            {name}&nbsp;
            <KTIcon iconName="down" className="fs-5 m-0" />
          </a>
          {/* begin::Menu */}
          <div
            className="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-title-gray-700 menu-icon-muted menu-active-bg menu-state-primary fw-semibold py-4 fs-base w-200px"
            data-kt-menu="true"
          >
            {data.map((domain: any) => (
              <div className="menu-item px-3" key={domain.id}>
                <a className={clsx("menu-link px-3", { active: id === domain.id })} onClick={() => onSelectOrganization(domain.id, domain.name, domain.permission)}>
                  {/* {domain.name} */}
                  <span className="menu-icon" data-kt-element="icon">
                    <KTIcon iconName="element-6" className="fs-1" />
                  </span>
                  <span className="menu-title">{domain.name}</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* <div className={clsx("app-navbar-item align-items-stretch", itemClass)}>
        <Search />
      </div>

      <div className={clsx("app-navbar-item", itemClass)}>
        <div id="kt_activities_toggle" className={btnClass}>
          <KTIcon iconName="chart-simple" className={btnIconClass} />
        </div>
      </div>

      <div className={clsx("app-navbar-item", itemClass)}>
        <div data-kt-menu-trigger="{default: 'click'}" data-kt-menu-attach="parent" data-kt-menu-placement="bottom-end" className={btnClass}>
          <KTIcon iconName="element-plus" className={btnIconClass} />
        </div>
        <HeaderNotificationsMenu />
      </div>

      <div className={clsx("app-navbar-item", itemClass)}>
        <div className={clsx("position-relative", btnClass)} id="kt_drawer_chat_toggle">
          <KTIcon iconName="message-text-2" className={btnIconClass} />
          <span className="bullet bullet-dot bg-success h-6px w-6px position-absolute translate-middle top-0 start-50 animation-blink" />
        </div>
      </div> */}

      <div className={clsx("app-navbar-item", itemClass)}>
        <ThemeModeSwitcher toggleBtnClass={clsx("btn-active-light-primary btn-custom")} />
      </div>

      <div className={clsx("app-navbar-item", itemClass)}>
        <div className={clsx("cursor-pointer symbol", userAvatarClass)} data-kt-menu-trigger="{default: 'click'}" data-kt-menu-attach="parent" data-kt-menu-placement="bottom-end">
          <img src={toAbsoluteUrl("media/avatars/blank.png")} alt="" />
        </div>
        <HeaderUserMenu />
      </div>

      {config.app?.header?.default?.menu?.display && (
        <div className="app-navbar-item d-lg-none ms-2 me-n3" title="Show header menu">
          <div className="btn btn-icon btn-active-color-primary w-35px h-35px" id="kt_app_header_menu_toggle">
            <KTIcon iconName="text-align-left" className={btnIconClass} />
          </div>
        </div>
      )}
    </div>
  );
};

export { Navbar };
