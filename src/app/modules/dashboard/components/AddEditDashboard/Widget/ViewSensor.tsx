import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import { useState } from "react";
import { Rnd } from "react-rnd";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { toAbsoluteUrl } from "../../../../../../_metronic/helpers";
import { getHistoryListAll } from "../../../../histories/api/HistoryAPI";
import { getThingChannelList } from "../../../../things/api/ThingChannelAPI";
import { editDashboard, getDashboardById } from "../../../api/DashboardHelper";
import { convertUnixTimestampToLocalDateTime } from "../../../../../constants/Common";
import "./ViewSensor.css";

interface IViewSensorProps {
  widgetData: any;
  editWidget: (data: any) => void;
  removeWidget: (id: any) => void;
}

const ViewSensor = ({ widgetData, editWidget, removeWidget }: IViewSensorProps) => {
  const params = useParams();
  const id = params.id as string;
  const layout = widgetData.layouts;
  const metadata = widgetData.metadata;
  const devices = metadata.parameters.map((parameter: any) => {
    if (parameter.type === "thing") {
      return {
        deviceLabel: parameter.type,
        deviceValue: parameter.thing,
        deviceName: parameter.thingName,
        sensorType: parameter.sensorType,
      };
    } else {
      return {
        deviceLabel: parameter.type,
        deviceValue: parameter.channel,
        sensorType: parameter.sensorType,
      };
    }
  });
  const layoutData = {
    height: layout.widgetSize.height,
    width: layout.widgetSize.width,
    left: layout.widgetPosition.left,
    top: layout.widgetPosition.top,
    order: layout.orderBy,
    title: metadata.title,
    name: layout.widgetType,
    imageUrl: "",
  };
  const [selectedLayout, setSelectedLayout] = useState<any>(layoutData);
  const style = {
    // display: "flex",
    // alignItems: "center",
    // justifyContent: "center",
    border: "solid 1px #ddd",
    background: "#fff",
  };
  console.log("devices", devices);
  // const data = {
  //   layout: layout.widgetType,
  //   name: metadata.title,
  //   interval: metadata.updateInterval,
  //   timeline: metadata.timeline,
  //   fromDate: metadata.fromDate,
  //   toDate: metadata.toDate,
  //   devices: devices,
  // };
  // Set the current time for from and to
  let fromTime: number = 0;
  let toTime: number = 0;
  if (metadata.timeline === "0") {
    fromTime = moment.utc(metadata.fromDate).startOf("day").valueOf() * 1000000;
    toTime = moment.utc(metadata.toDate).endOf("day").valueOf() * 1000000 + 999999;
  } else {
    fromTime = moment.utc(moment().subtract(metadata.timeline, "days").format("YYYY-MM-DD")).startOf("day").valueOf() * 1000000;
    toTime = moment.utc(moment().format("YYYY-MM-DD")).endOf("day").valueOf() * 1000000 + 999999;
  }

  const filterGroupChannel = {
    offset: 0,
    limit: 100,
    name: "",
    status: "enabled",
  };
  const channelListByThingIdQuery = useQuery({
    queryKey: [`thingListByChannelId`, filterGroupChannel],
    queryFn: async () => {
      const channelList: any = [];
      for (const device of devices) {
        const channelListByThingId = await getThingChannelList(device.deviceValue, filterGroupChannel);
        if (channelListByThingId.groups) {
          const groupsWithThingId = channelListByThingId.groups.map((group: any) => ({
            ...group,
            thingId: device.deviceValue,
          }));
          channelList.push(...groupsWithThingId);
        }
      }
      return channelList;
    },
    enabled: !!devices,
  });

  const filterDevice = {
    limit: 100,
    offset: 0,
    thingId: [],
    status: "enabled",
    name: devices[0].sensorType,
    from: Number(String(fromTime).slice(0, 10)),
    to: Number(String(toTime).slice(0, 10)),
    publisher: "",
  };
  const deviceHistoryListQuery = useQuery({
    queryKey: [`deviceHistoryList`, filterDevice],
    queryFn: async () => {
      if (!channelListByThingIdQuery.isSuccess || !channelListByThingIdQuery.data) return [];

      const channelList = channelListByThingIdQuery.data || [];
      const allHistoryData = [];

      for (const channel of channelList) {
        const filterWithPublisher = { ...filterDevice, publisher: channel.thingId };

        try {
          const historyData = await getHistoryListAll(channel.id, filterWithPublisher);
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

  let lastData = null;
  if (metadata.aggregationType === "avg") {
    const sum = data.reduce((a: any, b: any) => a + b.value, 0);
    const avg = sum / data.length;
    lastData = { name: metadata.title, value: Number(avg.toFixed(2)), time: data.length > 0 ? data[data.length - 1].time : 0 };
  } else if (metadata.aggregationType === "min") {
    const min = Math.min(...data.map((item: any) => item.value));
    lastData = { name: metadata.title, value: min, time: data.length > 0 ? data[data.length - 1].time : 0 };
  } else if (metadata.aggregationType === "max") {
    const max = Math.max(...data.map((item: any) => item.value));
    lastData = { name: metadata.title, value: max, time: data.length > 0 ? data[data.length - 1].time : 0 };
  } else if (metadata.aggregationType === "sum") {
    const sum = data.reduce((a: any, b: any) => a + b.value, 0);
    lastData = { name: metadata.title, value: sum, time: data.length > 0 ? data[data.length - 1].time : 0 };
  }

  const lastFiveData = data?.slice(Math.max(data?.length - 5, 0));

  function calculateDaysDifference(unixTime: any) {
    if (!unixTime) return 0;
    if (unixTime.toString().length === 10) {
      unixTime = unixTime * 1000;
    } else if (unixTime.toString().length === 16) {
      unixTime = unixTime / 1000;
    } else if (unixTime.toString().length === 19) {
      unixTime = unixTime / 1000000;
    }
    const currentDate = new Date().getTime();
    const timeDifference = currentDate - unixTime;
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    return daysDifference;
  }

  // Calculate the percentage for the progress bar
  const temperatureValue = lastData?.value || 0;
  const progressPercentage = Number(temperatureValue / 100).toFixed(2);

  return (
    <>
      <Rnd
        bounds="parent"
        style={style}
        className="d-flex flex-column align-items-center justify-content-center p-5"
        default={{ x: selectedLayout.left, y: selectedLayout.top, width: selectedLayout.width, height: selectedLayout.height }}
        size={{ width: selectedLayout.width, height: selectedLayout.height }}
        position={{ x: selectedLayout.left, y: selectedLayout.top }}
        onDragStop={(e, d) => {
          setSelectedLayout({
            ...selectedLayout,
            left: d.x,
            top: d.y,
          });
          const widget = {
            ...widgetData,
            layouts: {
              ...widgetData.layouts,
              widgetPosition: {
                ...widgetData.layouts.widgetPosition,
                left: d.x,
                top: d.y,
              },
            },
          };
          const dashboardData = getDashboardById(id);
          editDashboard({
            ...dashboardData,
            data: {
              ...dashboardData.data,
              widgets: dashboardData.data.widgets.map((item: any) => (item.widgetId === widget.widgetId ? widget : item)),
            },
          });
        }}
        onResizeStop={(e, direction, ref, delta, position) => {
          setSelectedLayout({
            ...selectedLayout,
            width: parseInt(ref.style.width),
            height: parseInt(ref.style.height),
            left: position.x,
            top: position.y,
          });
          const widget = {
            ...widgetData,
            layouts: {
              ...widgetData.layouts,
              widgetSize: {
                ...widgetData.layouts.widgetSize,
                width: parseInt(ref.style.width),
                height: parseInt(ref.style.height),
              },
              widgetPosition: {
                ...widgetData.layouts.widgetPosition,
                left: position.x,
                top: position.y,
              },
            },
          };
          const dashboardData = getDashboardById(id);
          editDashboard({
            ...dashboardData,
            data: {
              ...dashboardData.data,
              widgets: dashboardData.data.widgets.map((item: any) => (item.widgetId === widget.widgetId ? widget : item)),
            },
          });
        }}
      >
        {/* <div className="d-flex align-items-center justify-content-center me-2">
          <div>
            <h4>{selectedLayout.title}</h4>
          </div>
        </div> */}
        <div className="overlay w-100 h-100">
          <div className="overlay-wrapper h-100">
            {layout.widgetType === "SquareCard" && lastData && (
              <div className="hoverable">
                <div className="text-center">
                  <span className="fs-2hx fw-bold text-gray-900 me-2 lh-1 ls-n2">{lastData?.name}</span>
                  <div className="d-flex flex-row align-items-center justify-content-center py-7 me-2">
                    {devices[0].sensorType === "Temp" && (
                      <img src={toAbsoluteUrl("media/widget/Temperature1.png")} style={{ width: "160px", height: "100px" }} className="mw-100" alt="" />
                    )}
                    {(devices[0].sensorType === "Vibration" || devices[0].sensorType === "Water_Level") && (
                      <img src={toAbsoluteUrl("media/widget/vibration.png")} style={{ width: "160px", height: "100px" }} className="mw-100" alt="" />
                    )}
                    <div className="ms-4">
                      <span className="fw-bolder fs-2">{lastData?.value}°C</span>
                    </div>
                  </div>
                  <h3>{lastData?.time && calculateDaysDifference(lastData?.time)} days ago</h3>
                </div>
              </div>
            )}

            {layout.widgetType === "RectangleCard" && (
              <div className="card-flush">
                <div className="card-header">
                  <div className="card-title d-flex flex-column">
                    <div className="d-flex align-items-center">
                      {devices[0].sensorType === "Temp" && (
                        <img src={toAbsoluteUrl("media/widget/Temperature1.png")} style={{ width: "70px", height: "70px" }} className="mw-100" alt="" />
                      )}
                      {(devices[0].sensorType === "vibration" || devices[0].sensorType === "Water_Level") && (
                        <img src={toAbsoluteUrl("media/widget/vibration.png")} style={{ width: "160px", height: "100px" }} className="mw-100" alt="" />
                      )}
                      <span className="fs-2hx fw-bold text-gray-900 mx-3 lh-1 ls-n2">{lastData?.name}</span>
                      <span className="fs-2hx fw-bold text-gray-900 lh-1 ls-n2">{lastData?.value}°C</span>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <h3>Last update {lastData?.time && calculateDaysDifference(lastData?.time)} days ago</h3>
                </div>
              </div>
            )}

            {layout.widgetType === "VerticalCard" && lastData && (
              <div className="hoverable h-100">
                <div className="text-center h-100">
                  <h2>{lastData?.name}</h2>
                  <div className="d-flex flex-column align-items-center flex-grow-1 py-7 h-100">
                    <div className="temperature-display-vertical h-100">
                      <h2>{progressPercentage}%</h2>
                      <span>100</span>
                      <div className="progress-bar-container vertical h-100">
                        <div className="progress-bar" style={{ height: `${progressPercentage}%`, width: "100%" }}></div>
                      </div>
                      <div className="progress-labels-vertical d-flex flex-column align-items-center">
                        <span>0</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {layout.widgetType === "HorizontalCard" && lastData && (
              <div className="hoverable">
                <div className="text-center">
                  <h2>{lastData?.name}</h2>
                  <div className="d-flex flex-column flex-grow-1">
                    <div className="temperature-display">
                      <h2>{progressPercentage}%</h2>
                      <div className="progress-bar-container">
                        <div className="progress-bar" style={{ width: `${progressPercentage}%` }}></div>
                      </div>
                      <div className="progress-labels">
                        <span>0</span>
                        <span>100</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {layout.widgetType === "TableCard" && lastFiveData && (
              <div className="hoverable">
                <div className="text-center">
                  <h2 className="mt-4">{lastData?.name}</h2>
                  <table className="table table-striped table-bordered">
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
                            <td>{convertUnixTimestampToLocalDateTime(item.time)}</td>
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
            )}
          </div>
          <div className="overlay-layer bg-dark bg-opacity-0 rounded">
            <div className="d-flex">
              <button type="button" className="btn btn-sm btn-light-primary btn-shadow" onClick={() => editWidget(widgetData)}>
                <i className="bi bi-pencil p-0"></i>
              </button>
              <button type="button" className="btn btn-sm btn-light-danger btn-shadow ms-1" onClick={() => removeWidget(widgetData.widgetId)}>
                <i className="bi bi-trash p-0"></i>
              </button>
            </div>
          </div>
        </div>
      </Rnd>
    </>
  );
};

export { ViewSensor };
