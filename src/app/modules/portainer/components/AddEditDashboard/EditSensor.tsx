import { toAbsoluteUrl } from "../../../../../_metronic/helpers";
import { getThingChannelList } from "../../../things/api/ThingChannelAPI";
import { getHistoryList } from "../../../histories/api/HistoryAPI";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import "./EditSensor.css"; // Add CSS for the progress bar

interface IEditSensorProps {
  dashboardData: any;
}

const EditSensor = ({ dashboardData }: IEditSensorProps) => {
  const filterGroupChannel = {
    offset: 0,
    limit: 100,
    name: "",
    status: "enabled",
  };

  const filterDevice = {
    limit: 100,
    offset: 0,
    thingId: [],
    status: "enabled",
    name: dashboardData.sensorType,
    from: "",
    to: "",
    publisher: "",
  };

  const channelListByThingIdQuery = useQuery({
    queryKey: [`thingListByChannelId`, filterGroupChannel],
    queryFn: async () => {
      const channelList: any = [];
      for (const device of dashboardData.devices) {
        const channelListByThingId = await getThingChannelList(device.id, filterGroupChannel);
        if (channelListByThingId.groups) {
          const groupsWithThingId = channelListByThingId.groups.map((group: any) => ({
            ...group,
            thingId: device.id,
          }));
          channelList.push(...groupsWithThingId);
        }
      }
      return channelList;
    },
    enabled: !!dashboardData.devices,
  });

  const deviceHistoryListQuery = useQuery({
    queryKey: [`deviceHistoryList`, filterDevice],
    queryFn: async () => {
      if (!channelListByThingIdQuery.isSuccess || !channelListByThingIdQuery.data) return [];

      const channelList = channelListByThingIdQuery.data || [];
      const allHistoryData = [];

      for (const channel of channelList) {
        const filterWithPublisher = { ...filterDevice, publisher: channel.thingId };

        try {
          const historyData = await getHistoryList(channel.id, filterWithPublisher);
          if (historyData.messages) {
            allHistoryData.push(...historyData.messages);
          }
        } catch (error: any) {
          toast.error(error.message);
        }
      }

      return allHistoryData;
    },
    enabled: channelListByThingIdQuery.isSuccess && !!channelListByThingIdQuery.data,
  });

  const data = deviceHistoryListQuery.data ?? [];

  const lastData = data?.length > 0 ? data[data?.length - 1] : null;

  const lastFiveData = data?.slice(Math.max(data?.length - 5, 0));

  function calculateDaysDifference(unixMicroTime: any) {
    const unixMilliTime = Math.floor(unixMicroTime / 1000);
    const currentDate = new Date().getTime();
    const timeDifference = currentDate - unixMilliTime;
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    return daysDifference;
  }

  // Calculate the percentage for the progress bar
  const temperatureValue = lastData?.value || 0;
  const maxTemperature = 100;
  const minTemperature = 0;
  const progressPercentage = ((temperatureValue - minTemperature) / (maxTemperature - minTemperature)) * 100;

  return (
    <>
      {dashboardData?.isActivated?.sensor && (
        <>
          <div>
            {dashboardData?.layout == "SquareCard" && lastData && (
              <div className="col-xl-3">
                <div className="card hoverable mb-xl-4">
                  <div className="card-body text-center">
                    {/* <h4>{lastData?.name}</h4> */}
                    <span className="fs-2hx fw-bold text-gray-900 me-2 lh-1 ls-n2">{lastData?.name}</span>
                    <div className="d-flex flex-row align-items-center justify-content-center py-7 me-2">
                      {dashboardData.sensorType === "Temp" && (
                        <img src={toAbsoluteUrl("media/widget/Temperature1.png")} style={{ width: "160px", height: "100px" }} className="mw-100" alt="" />
                      )}
                      {dashboardData.sensorType === "vibration" && (
                        <img src={toAbsoluteUrl("media/widget/vibration.png")} style={{ width: "160px", height: "100px" }} className="mw-100" alt="" />
                      )}
                      <div className="ms-4">
                        <span className="fw-bolder fs-2">{lastData?.value}°C</span>
                      </div>
                    </div>
                    <h3>{lastData?.time && calculateDaysDifference(lastData?.time)} days ago</h3>
                  </div>
                </div>
              </div>
            )}
          </div>

          {dashboardData?.layout == "RectangleCard" && (
            <div className="col-xl-3">
              <div className="card card-flush h-md-50 mb-5 mb-xl-10">
                <div className="card-header pt-5">
                  <div className="card-title d-flex flex-column">
                    <div className="d-flex align-items-center">
                      {dashboardData.sensorType === "Temp" && (
                        <img src={toAbsoluteUrl("media/widget/Temperature1.png")} style={{ width: "70px", height: "70px" }} className="mw-100" alt="" />
                      )}
                      {dashboardData.sensorType === "vibration" && (
                        <img src={toAbsoluteUrl("media/widget/vibration.png")} style={{ width: "160px", height: "100px" }} className="mw-100" alt="" />
                      )}
                      <span className="fs-2hx fw-bold text-gray-900 me-2 lh-1 ls-n2">{lastData?.name}</span>
                      <span className="fs-2hx fw-bold text-gray-900 me-2 lh-1 ls-n2 mx-5">
                        {lastData?.value}
                        {dashboardData.sensorType === "Temp" && "°C"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-center">{dashboardData.sensorType === "Temp" && <h3>Last update {lastData?.time && calculateDaysDifference(lastData?.time)} ago</h3>}</div>
              </div>
            </div>
          )}

          {/* <div>
            {dashboardData?.layout == "RectangleCard" && lastData && (
              <div className="col-xl-3">
                <div className="card hoverable mb-xl-4">
                  <div className="card-body d-flex align-items-center justify-content-center">
                    <div className="me-3">
                      {dashboardData.sensorType === "Temp" && (
                        <img src={toAbsoluteUrl("media/widget/Temperature1.png")} style={{ width: "160px", height: "100px" }} className="mw-100" alt="" />
                      )}
                      {dashboardData.sensorType === "vibration" && (
                        <img src={toAbsoluteUrl("media/widget/vibration.png")} style={{ width: "160px", height: "100px" }} className="mw-100" alt="" />
                      )}
                    </div>

                    <div className="ms-4 text-start">
                      <div className="d-flex align-items-center">
                        <span className="fs-2hx fw-bold text-gray-900 me-2 lh-1 ls-n2">{lastData?.name}</span>
                        <span className="fw-bolder fs-2">{lastData?.value}°C</span>
                      </div>

                      <h3 className="mt-2">{lastData?.time && calculateDaysDifference(lastData?.time)} days ago</h3>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div> */}

          {dashboardData?.layout == "VerticalCard" && lastData && (
            <div className="col-xl-3">
              {" "}
              {/* Increased width for the VerticalCard */}
              <div className="card hoverable mb-xl-4">
                <div className="card-body text-center">
                  <h2>{lastData?.name}</h2>
                  <div className="d-flex flex-column align-items-center flex-grow-1 py-7">
                    <div className="temperature-display-vertical">
                      <h2>{temperatureValue}°C</h2>
                      {dashboardData.sensorType === "Temp" && <span>100°C</span>}
                      {dashboardData.sensorType === "vibration" && <span>100</span>}
                      <div className="progress-bar-container vertical">
                        <div className="progress-bar" style={{ height: `${progressPercentage}%`, width: "100%" }}></div>
                      </div>
                      <div className="progress-labels-vertical d-flex flex-column align-items-center">
                        {dashboardData.sensorType === "Temp" && <span>0°C</span>}
                        {dashboardData.sensorType === "vibration" && <span>0</span>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div>
            {dashboardData?.layout == "HorizontalCard" && lastData && (
              <div className="col-xl-3">
                <div className="card hoverable mb-xl-4">
                  <div className="card-body text-center">
                    <h2>{lastData?.name}</h2>
                    <div className="d-flex flex-column flex-grow-1 py-7 me-2">
                      <div className="temperature-display">
                        <h2>{temperatureValue}°C</h2>
                        <div className="progress-bar-container">
                          <div className="progress-bar" style={{ width: `${progressPercentage}%` }}></div>
                        </div>
                        <div className="progress-labels">
                          {dashboardData.sensorType === "Temp" && <span>0°C</span>}
                          {dashboardData.sensorType === "vibration" && <span>0</span>}
                          {dashboardData.sensorType === "Temp" && <span>100°C</span>}
                          {dashboardData.sensorType === "vibration" && <span>100</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {dashboardData?.layout == "TableCard" && lastFiveData && (
            <div className="col-xl-3">
              <div className="card hoverable mb-xl-4">
                <div className="card-body text-center">
                  <table className="table table-striped table-bordered mt-4">
                    <thead>
                      <tr>
                        <th>Time</th>
                        <th>{lastData?.name}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lastFiveData && lastFiveData.length > 0 ? (
                        lastFiveData.map((item: any, index: number) => (
                          <tr key={index}>
                            <td>{new Date(item.time / 1000).toLocaleString()}</td>
                            <td>{item.value}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={2}>No data available</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {dashboardData?.layout == "HorizontalLineCard" && lastData && (
            <div className="col-xl-3">
              <div className="card hoverable mb-xl-4">
                <div className="card-body text-center">
                  <h2>{lastData?.name}</h2>
                  <div className="horizontal-line-card-container">
                    <div className="horizontal-line-card">
                      <div className="temperature-value">
                        <strong>{temperatureValue}°C</strong>
                      </div>
                      <div className="temperature-line">
                        <div className="temperature-progress" style={{ width: `${progressPercentage}%` }}></div>
                      </div>

                      <div className="line-labels">
                        {dashboardData.sensorType === "Temp" && <span>0°C</span>}
                        {dashboardData.sensorType === "vibration" && <span>0</span>}
                        {dashboardData.sensorType === "Temp" && <span>100°C</span>}
                        {dashboardData.sensorType === "vibration" && <span>100</span>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export { EditSensor };
