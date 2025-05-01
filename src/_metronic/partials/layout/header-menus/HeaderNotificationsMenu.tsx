import { Dispatch, FC, SetStateAction } from "react";
import { Link } from "react-router-dom";
import { KTIcon, toAbsoluteUrl } from "../../../helpers";

interface HeaderNotificationsMenuProps {
  filterNotification: {
    limit: number;
    offset: number;
    status: string;
    from: number;
    to: number;
  };
  setFilterNotification: Dispatch<
    SetStateAction<{
      limit: number;
      offset: number;
      status: string;
      from: number;
      to: number;
    }>
  >;
  notificationList: any;
}

const HeaderNotificationsMenu: FC<HeaderNotificationsMenuProps> = ({ filterNotification, setFilterNotification, notificationList }: HeaderNotificationsMenuProps) => {
  const displayNotificationByStatus = (status: string) => {
    setFilterNotification({ ...filterNotification, status: status });
    console.log("status", status, filterNotification);
  };

  return (
    <div className="menu menu-sub menu-sub-dropdown menu-column w-350px w-lg-375px" data-kt-menu="true">
      <div className="d-flex flex-column bgi-no-repeat rounded-top" style={{ backgroundImage: `url('${toAbsoluteUrl("media/misc/menu-header-bg.png")}')` }}>
        <h3 className="text-white fw-bold px-9 mt-10 mb-6">Notifications</h3>

        <ul className="nav nav-line-tabs nav-line-tabs-2x nav-stretch fw-bold px-9">
          <li className="nav-item">
            <a
              className={`nav-link text-white opacity-75 opacity-state-100 pb-4 ${filterNotification.status === "NEW" ? "active" : ""}`}
              data-bs-toggle="tab"
              href="#kt_topbar_notifications_new"
              onClick={() => displayNotificationByStatus("NEW")}
            >
              New
            </a>
          </li>

          <li className="nav-item">
            <a
              className={`nav-link text-white opacity-75 opacity-state-100 pb-4 ${filterNotification.status === "PROCESSED" ? "active" : ""}`}
              data-bs-toggle="tab"
              href="#kt_topbar_notifications_processed"
              onClick={() => displayNotificationByStatus("PROCESSED")}
            >
              Processed
            </a>
          </li>

          <li className="nav-item">
            <a
              className={`nav-link text-white opacity-75 opacity-state-100 pb-4 ${filterNotification.status === "ESCALATED" ? "active" : ""}`}
              data-bs-toggle="tab"
              href="#kt_topbar_notifications_escalated"
              onClick={() => displayNotificationByStatus("ESCALATED")}
            >
              Escalated
            </a>
          </li>
        </ul>
      </div>

      <div className="tab-content">
        <div className={`tab-pane fade ${filterNotification.status === "NEW" ? "show active" : ""}`} id="kt_topbar_notifications_new" role="tabpanel">
          <div className="scroll-y mh-325px my-5 px-8">
            {notificationList.length === 0 && (
              <div className="d-flex flex-stack py-4">
                <div className="d-flex align-items-center me-2">
                  <span className="text-gray-800 text-hover-primary fw-bold">No notifications</span>
                </div>
              </div>
            )}
            {notificationList.map((notification: any, index: number) => (
              <div key={`notification${index}`} className="d-flex flex-stack py-4">
                <div className="d-flex align-items-center me-2">
                  {notification.labels?.map((label: string, index: number) => (
                    <div key={index} className="badge badge-light-primary fw-bolder me-2">
                      {label}
                    </div>
                  ))}
                  <a href="#" className="text-gray-800 text-hover-primary fw-bold">
                    {notification.content}
                  </a>
                  <span className="badge badge-light fs-8">{notification.sender}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="py-3 text-center border-top">
            <Link to="/notifications" className="btn btn-color-gray-600 btn-active-color-primary">
              View All <KTIcon iconName="arrow-right" className="fs-5" />
            </Link>
          </div>
        </div>

        <div className={`tab-pane fade ${filterNotification.status === "PROCESSED" ? "show active" : ""}`} id="kt_topbar_notifications_processed" role="tabpanel">
          <div className="scroll-y mh-325px my-5 px-8">
            {notificationList.length === 0 && (
              <div className="d-flex flex-stack py-4">
                <div className="d-flex align-items-center me-2">
                  <span className="text-gray-800 text-hover-primary fw-bold">No notifications</span>
                </div>
              </div>
            )}
            {notificationList.map((notification: any, index: number) => (
              <div key={`notification${index}`} className="d-flex flex-stack py-4">
                <div className="d-flex align-items-center me-2">
                  {notification.labels?.map((label: string, index: number) => (
                    <div key={index} className="badge badge-light-primary fw-bolder me-2">
                      {label}
                    </div>
                  ))}
                  <a href="#" className="text-gray-800 text-hover-primary fw-bold">
                    {notification.content}
                  </a>
                  <span className="badge badge-light fs-8">{notification.sender}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="py-3 text-center border-top">
            <Link to="/notifications" className="btn btn-color-gray-600 btn-active-color-primary">
              View All <KTIcon iconName="arrow-right" className="fs-5" />
            </Link>
          </div>
        </div>

        <div className={`tab-pane fade ${filterNotification.status === "ESCALATED" ? "show active" : ""}`} id="kt_topbar_notifications_escalated" role="tabpanel">
          <div className="scroll-y mh-325px my-5 px-8">
            {notificationList.length === 0 && (
              <div className="d-flex flex-stack py-4">
                <div className="d-flex align-items-center me-2">
                  <span className="text-gray-800 text-hover-primary fw-bold">No notifications</span>
                </div>
              </div>
            )}
            {notificationList.map((notification: any, index: number) => (
              <div key={`notification${index}`} className="d-flex flex-stack py-4">
                <div className="d-flex align-items-center me-2">
                  {/* <span className={clsx("w-70px badge", `badge-light-${notification.state}`, "me-4")}>{notification.code}</span> */}
                  {notification.labels?.map((label: string, index: number) => (
                    <div key={index} className="badge badge-light-primary fw-bolder me-2">
                      {label}
                    </div>
                  ))}
                  <a href="#" className="text-gray-800 text-hover-primary fw-bold">
                    {notification.content}
                  </a>
                  <span className="badge badge-light fs-8">{notification.sender}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="py-3 text-center border-top">
            <Link to="/notifications" className="btn btn-color-gray-600 btn-active-color-primary">
              View All <KTIcon iconName="arrow-right" className="fs-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export { HeaderNotificationsMenu };
