import { useQuery } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { KTIcon } from "../../../_metronic/helpers";
import { getChannelListAll } from "../channels/api/ChannelsAPI";
import { getGroupListAll } from "../groups/api/GroupAPI";
import { getHistoryListAll } from "../histories/api/HistoryAPI";
import { getNotification } from "../notifications/api/NotificationAPI";
import { getThingListAll } from "../things/api/ThingAPI";
import { getThingChannelList } from "../things/api/ThingChannelAPI";
import { getUserListAll } from "../users/api/UserAPI";
import { BarWidget } from "./BarWidget";
import { DonutWidget } from "./DonutWidget";
import { HomeLoading } from "./HomeLoading";
import "./HomePage.css";
import { LineWidget } from "./LineWidget";

const HomePage: React.FC = () => {
  const [button, setButton] = useState<{ index: any; active: boolean }>({ index: null, active: false });
  const [chartParams, setChartParams] = useState<{ dataPointIndex: any; originalState: boolean }>({ dataPointIndex: null, originalState: false });
  const [inactiveDevices, setInactiveDevices] = useState<any[]>([]);
  const [activeDevices, setActiveDevices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const filterUser = {
    limit: 100,
    offset: 0,
    name: "",
    identity: "",
    metadata: "",
    tags: "",
    status: "enabled",
  };
  const userListQuery = useQuery({
    queryKey: [`userList`, filterUser],
    queryFn: async () => getUserListAll(filterUser).catch((error) => toast.error(error?.response?.data?.message || "Something went wrong")),
    enabled: true,
  });
  const userData = useMemo(() => userListQuery.data?.users || [], [userListQuery.data]);
  const disabledFilterUser = {
    limit: 100,
    offset: 0,
    name: "",
    identity: "",
    metadata: "",
    tags: "",
    status: "disabled",
  };
  const disabledUserListQuery = useQuery({
    queryKey: [`disabledUserList`, disabledFilterUser],
    queryFn: async () => getUserListAll(disabledFilterUser).catch((error) => toast.error(error?.response?.data?.message || "Something went wrong")),
    enabled: true,
  });
  const disabledUserData = useMemo(() => disabledUserListQuery.data?.users || [], [disabledUserListQuery.data]);

  const filterGroup = {
    limit: 100,
    offset: 0,
    name: "",
    metadata: "",
    parentID: "",
    status: "enabled",
  };
  const groupListQuery = useQuery({
    queryKey: [`groupList`, filterGroup],
    queryFn: async () => getGroupListAll(filterGroup).catch((error) => toast.error(error?.response?.data?.message || "Something went wrong")),
    enabled: true,
  });
  const groupData = useMemo(() => groupListQuery.data?.groups || [], [groupListQuery.data]);
  const disabledFilterGroup = {
    limit: 100,
    offset: 0,
    name: "",
    metadata: "",
    parentID: "",
    status: "disabled",
  };
  const disabledGroupListQuery = useQuery({
    queryKey: [`disabledGroupList`, disabledFilterGroup],
    queryFn: async () => getGroupListAll(disabledFilterGroup).catch((error) => toast.error(error?.response?.data?.message || "Something went wrong")),
    enabled: true,
  });
  const disabledGroupData = useMemo(() => disabledGroupListQuery.data?.groups || [], [disabledGroupListQuery.data]);

  const filterChannel = {
    limit: 100,
    offset: 0,
    name: "",
    metadata: "",
    status: "enabled",
  };
  const channelListQuery = useQuery({
    queryKey: [`channelList`, filterChannel],
    queryFn: async () => getChannelListAll(filterChannel).catch((error) => toast.error(error?.response?.data?.message || "Something went wrong")),
    enabled: true,
  });
  const assetData = useMemo(() => channelListQuery.data?.groups || [], [channelListQuery.data]);
  const disabledFilterChannel = {
    limit: 100,
    offset: 0,
    name: "",
    metadata: "",
    status: "disabled",
  };
  const disabledChannelListQuery = useQuery({
    queryKey: [`disabledChannelList`, disabledFilterChannel],
    queryFn: async () => getChannelListAll(disabledFilterChannel).catch((error) => toast.error(error?.response?.data?.message || "Something went wrong")),
    enabled: true,
  });
  const disabledAssetData = useMemo(() => disabledChannelListQuery.data?.groups || [], [disabledChannelListQuery.data]);

  const filterThing = {
    limit: 100,
    offset: 0,
    name: "",
    metadata: "",
    tags: "",
    status: "enabled",
  };
  const thingListQuery = useQuery({
    queryKey: [`thingList`, filterThing],
    queryFn: async () => {
      const response = await getThingListAll(filterThing).catch((error) => toast.error(error?.response?.data?.message || "Something went wrong"));
      return {
        ...response,
        things: [
          ...response.things.map((thing: any) => {
            return { ...thing, isConnected: false, activity: "inactive", lastSeenMsg: null };
          }),
        ],
      };
    },
    enabled: true,
  });
  const deviceData = useMemo(() => thingListQuery.data?.things || [], [thingListQuery.data]);
  const disabledFilterThing = {
    limit: 100,
    offset: 0,
    name: "",
    metadata: "",
    tags: "",
    status: "disabled",
  };
  const disabledThingListQuery = useQuery({
    queryKey: [`disabledThingList`, disabledFilterThing],
    queryFn: async () => getThingListAll(disabledFilterThing).catch((error) => toast.error(error?.response?.data?.message || "Something went wrong")),
    enabled: true,
  });
  const disabledDeviceData = useMemo(() => disabledThingListQuery.data?.things || [], [disabledThingListQuery.data]);

  const newFilterNotification = {
    limit: 10,
    offset: 0,
    status: "NEW",
    from: 0,
    to: 0,
  };
  const newNotificationListQuery = useQuery({
    queryKey: [`newNotificationList`, newFilterNotification],
    queryFn: async () => getNotification(newFilterNotification).catch((error) => toast.error(error?.response?.data?.message || "Something went wrong")),
    enabled: true,
  });
  const newNotificationCount = useMemo(() => newNotificationListQuery.data?.totalCount || 0, [newNotificationListQuery.data]);
  const processedFilterNotification = {
    limit: 10,
    offset: 0,
    status: "PROCESSED",
    from: 0,
    to: 0,
  };
  const processedNotificationListQuery = useQuery({
    queryKey: [`processedNotificationList`, processedFilterNotification],
    queryFn: async () => getNotification(processedFilterNotification).catch((error) => toast.error(error?.response?.data?.message || "Something went wrong")),
    enabled: true,
  });
  const processedNotificationCount = useMemo(() => processedNotificationListQuery.data?.totalCount || 0, [processedNotificationListQuery.data]);
  const escalatedFilterNotification = {
    limit: 10,
    offset: 0,
    status: "ESCALATED",
    from: 0,
    to: 0,
  };
  const escalatedNotificationListQuery = useQuery({
    queryKey: [`escalatedNotificationList`, escalatedFilterNotification],
    queryFn: async () => getNotification(escalatedFilterNotification).catch((error) => toast.error(error?.response?.data?.message || "Something went wrong")),
    enabled: true,
  });
  const escalatedNotificationCount = useMemo(() => escalatedNotificationListQuery.data?.totalCount || 0, [escalatedNotificationListQuery.data]);

  const handleButtonClick = (dataPointIndex: number) => {
    setButton({ index: dataPointIndex, active: button.index === dataPointIndex ? !button.active : true });
    setChartParams({ dataPointIndex, originalState: chartParams.dataPointIndex === dataPointIndex ? !chartParams.originalState : true });
  };

  const handleDisplayDevice = async () => {
    if (activeDevices.length !== 0 || inactiveDevices.length !== 0) {
      return;
    }
    setIsLoading(true);
    const things = await Promise.all(
      deviceData.map(async (thing: any) => {
        try {
          const filterThingChannel = {
            limit: 10,
            offset: 0,
            name: "",
            metadata: "",
            status: "enabled",
          };
          const channel = await getThingChannelList(thing.id, filterThingChannel).catch((error) => toast.error(error?.response?.data?.message || "Something went wrong"));
          const historyData = await Promise.all(
            channel.groups.map(async (group: any) => {
              try {
                const filterHistory = {
                  limit: 10,
                  offset: 0,
                  name: "",
                  publisher: thing.id,
                  status: "enabled",
                };
                const history = await getHistoryListAll(group.id, filterHistory).catch((error) => toast.error(error?.response?.data?.message || "Something went wrong"));
                return history;
              } catch (error) {
                return [];
              }
            })
          );

          const flatHistory: any = historyData.flat().sort((a: any, b: any) => a.time - b.time);

          // Convert current time to Unix timestamp
          const now = Number(String(new Date().getTime()).slice(0, 10));

          // Calculate activity status
          let activity = "inactive";

          if (thing.metadata?.Update_Frequency) {
            const updateFrequency = parseInt(thing.metadata.Update_Frequency);

            if (flatHistory.length > 0 && flatHistory[0].messages?.length > 0) {
              const firstRecordTime = Number(String(flatHistory[0].messages[0].time).slice(0, 10));
              const timeDifference = now - firstRecordTime;
              if (timeDifference >= 0 && timeDifference <= updateFrequency) {
                activity = "active";
              }
            }
          }
          return {
            ...thing,
            isConnected: channel.total > 0,
            activity,
            lastSeenMsg: flatHistory.length > 0 && flatHistory[0].messages?.length > 0 && flatHistory[0].messages[0].time ? flatHistory[0].messages[0].time : null,
          };
        } catch (error) {
          return {
            ...thing,
            isConnected: false,
            activity: "inactive",
            lastSeenMsg: null,
          };
        }
      })
    );
    setActiveDevices(things.filter((thing: any) => thing.activity === "active"));
    setInactiveDevices(things.filter((thing: any) => thing.activity === "inactive"));
    setIsLoading(false);
  };

  return (
    <>
      {isLoading && <HomeLoading />}
      {/* begin::Row */}
      <div className="row g-5 g-xl-8">
        <div className="col-xl-8">
          <LineWidget userData={userData} groupData={groupData} assetData={assetData} deviceData={deviceData} />
        </div>
        <div className="col-xl-4">
          <DonutWidget
            chartParams={chartParams}
            userData={userData}
            groupData={groupData}
            assetData={assetData}
            deviceData={deviceData}
            disabledUserData={disabledUserData}
            disabledGroupData={disabledGroupData}
            disabledAssetData={disabledAssetData}
            disabledDeviceData={disabledDeviceData}
          />
        </div>
      </div>
      {/* end::Row */}
      {/* begin::Row */}
      <div className="row g-5 g-xl-8">
        <div className="col-xl-8">
          <div className="row g-5 g-xl-8 mb-5">
            <div className="col-xl-4">
              <div className="card hoverable mb-xl-4">
                <div className="card-body d-flex align-items-center pt-3 pb-5">
                  <div className="accordion accordion-icon-toggle w-100" id="kt_accordion_2">
                    <div className="mb-0">
                      <div className="accordion-header py-3 d-flex collapsed" data-bs-toggle="collapse" data-bs-target="#kt_accordion_2_item_1" onClick={handleDisplayDevice}>
                        <span className="accordion-icon">
                          <i className="ki-duotone ki-arrow-right fs-4">
                            <span className="path1"></span>
                            <span className="path2"></span>
                          </i>
                        </span>
                        <h3 className="fw-semibold text-gray-700 mb-0 ms-4">Inactive Devices</h3>
                      </div>
                      <div id="kt_accordion_2_item_1" className="fs-6 collapse" data-bs-parent="#kt_accordion_2">
                        <div className="d-flex justify-content-between">
                          <div className="fs-2hx fw-bold text-gray-900 mb-2 mt-5">{inactiveDevices.length}</div>
                          <KTIcon iconName="technology" className="text-warning fs-7x ms-n1" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-4">
              <div className="card hoverable mb-xl-4">
                <div className="card-body d-flex align-items-center pt-3 pb-5">
                  <div className="accordion accordion-icon-toggle w-100" id="kt_accordion_2">
                    <div className="mb-0">
                      <div className="accordion-header py-3 d-flex collapsed" data-bs-toggle="collapse" data-bs-target="#kt_accordion_2_item_1" onClick={handleDisplayDevice}>
                        <span className="accordion-icon">
                          <i className="ki-duotone ki-arrow-right fs-4">
                            <span className="path1"></span>
                            <span className="path2"></span>
                          </i>
                        </span>
                        <h3 className="fw-semibold text-gray-700 mb-0 ms-4">Active Devices</h3>
                      </div>
                      <div id="kt_accordion_2_item_1" className="fs-6 collapse" data-bs-parent="#kt_accordion_2">
                        <div className="d-flex justify-content-between">
                          <div className="fs-2hx fw-bold text-gray-900 mb-2 mt-5">{activeDevices.length}</div>
                          <KTIcon iconName="technology" className="text-warning fs-7x ms-n1" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-4">
              <div className="card hoverable mb-xl-4">
                <div className="card-body d-flex align-items-center pt-3 pb-5">
                  <div className="accordion accordion-icon-toggle w-100" id="kt_accordion_2">
                    <div className="mb-0">
                      <div className="accordion-header py-3 d-flex collapsed" data-bs-toggle="collapse" data-bs-target="#kt_accordion_2_item_1" onClick={handleDisplayDevice}>
                        <span className="accordion-icon">
                          <i className="ki-duotone ki-arrow-right fs-4">
                            <span className="path1"></span>
                            <span className="path2"></span>
                          </i>
                        </span>
                        <h3 className="fw-semibold text-gray-700 mb-0 ms-4">Total Devices</h3>
                      </div>
                      <div id="kt_accordion_2_item_1" className="fs-6 collapse" data-bs-parent="#kt_accordion_2">
                        <div className="d-flex justify-content-between">
                          <div className="fs-2hx fw-bold text-gray-900 mb-2 mt-5">{inactiveDevices.length + activeDevices.length}</div>
                          <KTIcon iconName="technology" className="text-warning fs-7x ms-n1" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row g-5 g-xl-8 mb-5">
            <div className="col-xl-6">
              <button className={`btn btn-users btn-lg btn-block w-100 h-70px ${button.active && button.index === 0 ? "active" : ""}`} onClick={() => handleButtonClick(0)}>
                Users
              </button>
            </div>
            <div className="col-xl-6">
              <button className={`btn btn-devices btn-lg btn-block w-100 h-70px ${button.active && button.index === 1 ? "active" : ""}`} onClick={() => handleButtonClick(1)}>
                Devices
              </button>
            </div>
          </div>
          <div className="row g-5 g-xl-8 mb-xl-8">
            <div className="col-xl-6">
              <button className={`btn btn-groups btn-lg btn-block w-100 h-70px ${button.active && button.index === 2 ? "active" : ""}`} onClick={() => handleButtonClick(2)}>
                Asset Groups
              </button>
            </div>
            <div className="col-xl-6">
              <button className={`btn btn-assets btn-lg btn-block w-100 h-70px ${button.active && button.index === 3 ? "active" : ""}`} onClick={() => handleButtonClick(3)}>
                Assets
              </button>
            </div>
          </div>
          <div className="row g-3 g-lg-6 mt-2">
            <div className="col-3">
              <div className="card hoverable rounded-2 px-6 py-5">
                <div className="symbol symbol-30px me-5 mb-8">
                  <span>
                    <i className="ki-duotone ki-notification fs-2qx text-primary">
                      <span className="path1"></span>
                      <span className="path2"></span>
                    </i>
                  </span>
                </div>
                <div className="m-0">
                  <span className="text-gray-700 fw-bolder d-block fs-2qx lh-1 ls-n1 mb-1">{newNotificationCount}</span>
                  <span className="text-gray-500 fw-semibold fs-6">New Notifications</span>
                </div>
              </div>
            </div>
            <div className="col-3">
              <div className="card hoverable rounded-2 px-6 py-5">
                <div className="symbol symbol-30px me-5 mb-8">
                  <span>
                    <i className="ki-duotone ki-notification fs-2qx text-primary">
                      <span className="path1"></span>
                      <span className="path2"></span>
                    </i>
                  </span>
                </div>
                <div className="m-0">
                  <span className="text-gray-700 fw-bolder d-block fs-2qx lh-1 ls-n1 mb-1">{processedNotificationCount}</span>
                  <span className="text-gray-500 fw-semibold fs-6">Processed Notifications</span>
                </div>
              </div>
            </div>
            <div className="col-3">
              <div className="card hoverable rounded-2 px-6 py-5">
                <div className="symbol symbol-30px me-5 mb-8">
                  <span>
                    <i className="ki-duotone ki-notification fs-2qx text-primary">
                      <span className="path1"></span>
                      <span className="path2"></span>
                      <span className="path3"></span>
                    </i>
                  </span>
                </div>
                <div className="m-0">
                  <span className="text-gray-700 fw-bolder d-block fs-2qx lh-1 ls-n1 mb-1">{escalatedNotificationCount}</span>
                  <span className="text-gray-500 fw-semibold fs-6">Escalated Notifications</span>
                </div>
              </div>
            </div>
            <div className="col-3">
              <div className="card hoverable rounded-2 px-6 py-5">
                <div className="symbol symbol-30px me-5 mb-8">
                  <span>
                    <i className="ki-duotone ki-notification fs-2qx text-primary">
                      <span className="path1"></span>
                      <span className="path2"></span>
                      <span className="path3"></span>
                    </i>
                  </span>
                </div>
                <div className="m-0">
                  <span className="text-gray-700 fw-bolder d-block fs-2qx lh-1 ls-n1 mb-1">{newNotificationCount + processedNotificationCount + escalatedNotificationCount}</span>
                  <span className="text-gray-500 fw-semibold fs-6">Total Notifications</span>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="row g-5 g-xl-8 mb-5">
            <div className="col-xl-6 col-md-6 col-sm-12">
              <div className="card hoverable mb-xl-4">
                <div className="card-body d-flex align-items-center pt-3 pb-5">
                  <div className="d-flex flex-column flex-grow-1 py-5 me-2">
                    <div className="fs-2hx fw-bold text-gray-900 mb-2 mt-5">{newNotificationCount}</div>
                    <div className="fw-semibold text-gray-700">New Notifications</div>
                  </div>
                  <KTIcon iconName="notification" className="text-warning fs-5x ms-n1" />
                </div>
              </div>
            </div>
            <div className="col-xl-6 col-md-6 col-sm-12">
              <div className="card hoverable mb-xl-4">
                <div className="card-body d-flex align-items-center pt-3 pb-5">
                  <div className="d-flex flex-column flex-grow-1 py-5 me-2">
                    <div className="fs-2hx fw-bold text-gray-900 mb-2 mt-5">{processedNotificationCount}</div>
                    <div className="fw-semibold text-gray-700">Processed Notifications</div>
                  </div>
                  <KTIcon iconName="notification" className="text-warning fs-5x ms-n1" />
                </div>
              </div>
            </div>
            <div className="col-xl-6 col-md-6 col-sm-12">
              <div className="card hoverable mb-xl-4">
                <div className="card-body d-flex align-items-center pt-3 pb-5">
                  <div className="d-flex flex-column flex-grow-1 py-5 me-2">
                    <div className="fs-2hx fw-bold text-gray-900 mb-2 mt-5">{escalatedNotificationCount}</div>
                    <div className="fw-semibold text-gray-700">Escalated Notifications</div>
                  </div>
                  <KTIcon iconName="notification" className="text-warning fs-5x ms-n1" />
                </div>
              </div>
            </div>
            <div className="col-xl-6 col-md-6 col-sm-12">
              <div className="card hoverable mb-xl-4">
                <div className="card-body d-flex align-items-center pt-3 pb-5">
                  <div className="d-flex flex-column flex-grow-1 py-5 me-2">
                    <div className="fs-2hx fw-bold text-gray-900 mb-2 mt-5">{newNotificationCount + processedNotificationCount + escalatedNotificationCount}</div>
                    <div className="fw-semibold text-gray-700">Total Notifications</div>
                  </div>
                  <KTIcon iconName="notification" className="text-warning fs-5x ms-n1" />
                </div>
              </div>
            </div>
          </div> */}

          {/* display dash border with rounded corners and put documentation buttons */}
          {/* <div className="card dash-border rounded">
            <div className="card-body">
              <div className="row g-5 g-xl-8">
                <div className="col-xl-6">
                  <button className="btn btn-light-secondary btn-lg btn-block w-100">Documentation</button>
                </div>
                <div className="col-xl-6">
                  <button className="btn btn-light-secondary btn-lg btn-block w-100">Getting Started</button>
                </div>
              </div>
            </div>
          </div> */}
        </div>

        <div className="col-xl-4">
          <BarWidget
            userData={userData}
            groupData={groupData}
            assetData={assetData}
            deviceData={deviceData}
            disabledUserData={disabledUserData}
            disabledGroupData={disabledGroupData}
            disabledAssetData={disabledAssetData}
            disabledDeviceData={disabledDeviceData}
          />
        </div>
      </div>
      {/* end::Row */}
    </>
  );
};

export { HomePage };
