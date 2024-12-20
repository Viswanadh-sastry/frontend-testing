import { useQuery } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { LineWidget } from "./LineWidget";
import { BarWidget } from "./BarWidget";
import { DonutWidget } from "./DonutWidget";
import { getUserListAll } from "../users/api/UserAPI";
import { getGroupListAll } from "../groups/api/GroupAPI";
import { getChannelListAll } from "../channels/api/ChannelsAPI";
import { getThingListAll } from "../things/api/ThingAPI";
import { getThingChannelList } from "../things/api/ThingChannelAPI";
import { getHistoryListAll } from "../histories/api/HistoryAPI";
import { KTIcon } from "../../../_metronic/helpers";
import "./HomePage.css";

const HomePage: React.FC = () => {
  const [button, setButton] = useState<{ index: any; active: boolean }>({ index: null, active: false });
  const [chartParams, setChartParams] = useState<{ dataPointIndex: any; originalState: boolean }>({ dataPointIndex: null, originalState: false });

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
    queryFn: async () => getUserListAll(filterUser).catch((error) => toast.error(error.message)),
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
    queryFn: async () => getUserListAll(disabledFilterUser).catch((error) => toast.error(error.message)),
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
    queryFn: async () => getGroupListAll(filterGroup).catch((error) => toast.error(error.message)),
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
    queryFn: async () => getGroupListAll(disabledFilterGroup).catch((error) => toast.error(error.message)),
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
    queryFn: async () => getChannelListAll(filterChannel).catch((error) => toast.error(error.message)),
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
    queryFn: async () => getChannelListAll(disabledFilterChannel).catch((error) => toast.error(error.message)),
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
    queryFn: async () =>
      getThingListAll(filterThing)
        .then(async (response) => {
          const things = await Promise.all(
            response.things.map(async (thing: any) => {
              try {
                const filterThingChannel = {
                  limit: 10,
                  offset: 0,
                  name: "",
                  metadata: "",
                  status: "enabled",
                };
                const channel = await getThingChannelList(thing.id, filterThingChannel);
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
                      const history = await getHistoryListAll(group.id, filterHistory);
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
          return { ...response, things };
        })
        .catch((error) => toast.error(error.message)),
    enabled: true,
  });
  const deviceData = useMemo(() => thingListQuery.data?.things || [], [thingListQuery.data]);
  const activeDevices = deviceData.filter((device: any) => device.activity === "active");
  const inactiveDevices = deviceData.filter((device: any) => device.activity === "inactive");
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
    queryFn: async () => getThingListAll(disabledFilterThing).catch((error) => toast.error(error.message)),
    enabled: true,
  });
  const disabledDeviceData = useMemo(() => disabledThingListQuery.data?.things || [], [disabledThingListQuery.data]);

  const handleButtonClick = (dataPointIndex: number) => {
    setButton({ index: dataPointIndex, active: button.index === dataPointIndex ? !button.active : true });
    setChartParams({ dataPointIndex, originalState: chartParams.dataPointIndex === dataPointIndex ? !chartParams.originalState : true });
  };

  return (
    <>
      {/* begin::Row */}
      {/* <div className="row g-5 g-xl-8">
        <div className="col-xl-3">
          <StatisticsWidget color="primary" svgIcon="user" iconColor="white" title="5" titleColor="white" description="Users" descriptionColor="white" />
        </div>
        <div className="col-xl-3">
          <StatisticsWidget color="success" svgIcon="technology" iconColor="white" title="0" titleColor="white" description="Devices" descriptionColor="white" />
        </div>
        <div className="col-xl-3">
          <StatisticsWidget color="warning" svgIcon="abstract-26" iconColor="white" title="2" titleColor="white" description="Asset Groups" descriptionColor="white" />
        </div>
        <div className="col-xl-3">
          <StatisticsWidget color="danger" svgIcon="arrow-right-left" iconColor="white" title="0" titleColor="white" description="Assets" descriptionColor="white" />
        </div>
      </div> */}
      {/* end::Row */}
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
                  <div className="d-flex flex-column flex-grow-1 py-7 me-2">
                    <div className="fs-2hx fw-bold text-gray-900 mb-2 mt-5">{inactiveDevices.length}</div>
                    <div className="fw-semibold text-gray-700">Inactive Devices</div>
                  </div>
                  <KTIcon iconName="technology" className="text-warning fs-7x ms-n1" />
                </div>
              </div>
            </div>
            <div className="col-xl-4">
              <div className="card hoverable mb-xl-4">
                <div className="card-body d-flex align-items-center pt-3 pb-5">
                  <div className="d-flex flex-column flex-grow-1 py-7 me-2">
                    <div className="fs-2hx fw-bold text-gray-900 mb-2 mt-5">{activeDevices.length}</div>
                    <div className="fw-semibold text-gray-700">Active Devices</div>
                  </div>
                  <KTIcon iconName="technology" className="text-warning fs-7x ms-n1" />
                </div>
              </div>
            </div>
            <div className="col-xl-4">
              <div className="card hoverable mb-xl-4">
                <div className="card-body d-flex align-items-center pt-3 pb-5">
                  <div className="d-flex flex-column flex-grow-1 py-7 me-2">
                    <div className="fs-2hx fw-bold text-gray-900 mb-2 mt-5">{inactiveDevices.length + activeDevices.length}</div>
                    <div className="fw-semibold text-gray-700">Total Devices</div>
                  </div>
                  <KTIcon iconName="technology" className="text-warning fs-7x ms-n1" />
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
