import moment from "moment";
import { useEffect, useState } from "react";
import { Rnd } from "react-rnd";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { ThemeModeComponent } from "../../../../../../_metronic/assets/ts/layout";
import { toAbsoluteUrl } from "../../../../../../_metronic/helpers";
import { convertUnixTimestampToLocalDateTime } from "../../../../../constants/Common";
import { getHistoryListAll } from "../../../../histories/api/HistoryAPI";
import { getThingChannelList } from "../../../../things/api/ThingChannelAPI";
import { editDashboard, getDashboardById } from "../../../api/DashboardHelper";
import "./ViewSensor.css";

interface IViewSensorProps {
  widgetData: any;
  editWidget: (data: any) => void;
  removeWidget: (id: any) => void;
}

const ViewSensor = ({ widgetData, editWidget, removeWidget }: IViewSensorProps) => {
  let ktThemeModeValue = localStorage.getItem("kt_theme_mode_value");
  if (ktThemeModeValue === "system") {
    ktThemeModeValue = ThemeModeComponent.getSystemMode() as "light" | "dark";
  }
  const [lastData, setLastData] = useState<any>(null);
  const [progressPercentage, setProgressPercentage] = useState<number>(0);
  const [lastFiveData, setLastFiveData] = useState<any[]>([]);
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
    fromTime = moment(metadata.fromDate).startOf("day").valueOf() * 1000000;
    toTime = moment(metadata.toDate).endOf("day").valueOf() * 1000000 + 999000;
  } else {
    fromTime = moment(moment().subtract(metadata.timeline, "days").format("YYYY-MM-DD")).startOf("day").valueOf() * 1000000;
    toTime = moment(moment().format("YYYY-MM-DD")).endOf("day").valueOf() * 1000000 + 999000;
  }

  useEffect(() => {
    const fetchData = async () => {
      if (!devices || devices.length === 0) return;

      try {
        // Fetch channel list
        const channelList: any[] = [];
        for (const device of devices) {
          const channelListByThingId = await getThingChannelList(device.deviceValue, {
            offset: 0,
            limit: 10,
            name: "",
            status: "enabled",
          });
          if (channelListByThingId.groups) {
            const groupsWithThingId = channelListByThingId.groups.map((group: any) => ({
              ...group,
              thingId: device.deviceValue,
            }));
            channelList.push(...groupsWithThingId);
          }
        }

        // Fetch device history
        const allHistoryData: any[] = [];
        for (const channel of channelList) {
          const filterDevice = {
            limit: 100,
            offset: 0,
            thingId: [],
            status: "enabled",
            name: devices[0].sensorType,
            from: Number(String(fromTime).slice(0, 10)),
            to: Number(String(toTime).slice(0, 10)),
            publisher: channel.thingId,
          };

          try {
            const historyData = await getHistoryListAll(channel.id, filterDevice);
            if (historyData.messages) {
              allHistoryData.push(...historyData.messages);
            }
          } catch (error: any) {
            toast.error(error.message);
          }
        }

        // Process data
        const data = allHistoryData ?? [];
        let lastData = null;
        if (metadata.aggregationType === "avg") {
          const sum = data.reduce((a: any, b: any) => a + b.value, 0);
          const avg = sum / data.length;
          lastData = {
            name: metadata.title,
            value: Number(avg.toFixed(2)),
            time: data.length > 0 ? data[data.length - 1].time : 0,
            unit: data.length > 0 ? data[data.length - 1].unit : "",
          };
        } else if (metadata.aggregationType === "min") {
          const min = Math.min(...data.map((item: any) => item.value));
          lastData = {
            name: metadata.title,
            value: Number(min.toFixed(2)),
            time: data.length > 0 ? data[data.length - 1].time : 0,
            unit: data.length > 0 ? data[data.length - 1].unit : "",
          };
        } else if (metadata.aggregationType === "max") {
          const max = Math.max(...data.map((item: any) => item.value));
          lastData = {
            name: metadata.title,
            value: Number(max.toFixed(2)),
            time: data.length > 0 ? data[data.length - 1].time : 0,
            unit: data.length > 0 ? data[data.length - 1].unit : "",
          };
        } else if (metadata.aggregationType === "sum") {
          const sum = data.reduce((a: any, b: any) => a + b.value, 0);
          lastData = {
            name: metadata.title,
            value: Number(sum.toFixed(2)),
            time: data.length > 0 ? data[data.length - 1].time : 0,
            unit: data.length > 0 ? data[data.length - 1].unit : "",
          };
        } else if (metadata.aggregationType === "latest") {
          lastData = {
            name: metadata.title,
            value: data.length > 0 ? data[data.length - 1].value : 0,
            time: data.length > 0 ? data[data.length - 1].time : 0,
            unit: data.length > 0 ? data[data.length - 1].unit : "",
          };
        }
        setLastData(lastData);

        const lastFiveData = data?.slice(Math.max(data?.length - 5, 0));
        setLastFiveData(lastFiveData);

        // Calculate the percentage for the progress bar using the last data value and the min/max values
        if (metadata.maxValue?.toString().length > 0 && metadata.minValue?.toString().length > 0) {
          const progressPercentage = Number((((lastData?.value - metadata.minValue) / (metadata.maxValue - metadata.minValue)) * 100).toFixed(2));
          setProgressPercentage(progressPercentage);
        }
      } catch (error: any) {
        toast.error("An error occurred while fetching data.");
      }
    };

    fetchData();
  }, []);

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

  // Helper function to calculate rotation for the needle
  const calculateRotation = (percentage: any) => {
    const minAngle = -90; // Starting angle for the needle
    const maxAngle = 90; // Ending angle for the needle
    return minAngle + (percentage / 100) * (maxAngle - minAngle);
  };

  return (
    <>
      <Rnd
        bounds="parent"
        className="card d-flex flex-column align-items-center justify-content-center p-5"
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
        <div className="d-flex justify-content-end w-100">
          <div className="d-flex">
            <button type="button" className="btn btn-sm btn-light-primary btn-shadow" onClick={() => editWidget(widgetData)}>
              <i className="bi bi-pencil p-0"></i>
            </button>
            <button type="button" className="btn btn-sm btn-light-danger btn-shadow ms-1" onClick={() => removeWidget(widgetData.widgetId)}>
              <i className="bi bi-trash p-0"></i>
            </button>
          </div>
        </div>
        {layout.widgetType === "SquareCard" && lastData && (
          <div className="hoverable row align-items-center h-100">
            <div className="text-center">
              <span className="fs-2hx fw-bold text-gray-900 me-2 lh-1 ls-n2">{lastData?.name}</span>
              <div className="d-flex flex-row align-items-center justify-content-center py-7 me-2">
                {devices[0].sensorType === "Temp" && (
                  <img src={toAbsoluteUrl("media/widget/vibration.png")} style={{ width: "160px", height: "100px" }} className="mw-100" alt="" />
                )}
                {(devices[0].sensorType === "Vibration" || devices[0].sensorType === "Water_Level") && (
                  <img src={toAbsoluteUrl("media/widget/vibration.png")} style={{ width: "160px", height: "100px" }} className="mw-100" alt="" />
                )}
                <div className="ms-4">
                  <span className="fw-bolder fs-2">
                    {lastData?.value}
                    {lastData?.unit}
                  </span>
                </div>
              </div>
              <h3>{lastData?.time && calculateDaysDifference(lastData?.time)} days ago</h3>
            </div>
          </div>
        )}

        {layout.widgetType === "RectangleCard" && (
          <div className="card-flush h-100">
            <div className="card-header">
              <div className="card-title d-flex flex-column">
                <div className="d-flex align-items-center">
                  {devices[0].sensorType === "Temp" && (
                    <img src={toAbsoluteUrl("media/widget/vibration.png")} style={{ width: "70px", height: "70px" }} className="mw-100" alt="" />
                  )}
                  {(devices[0].sensorType === "vibration" || devices[0].sensorType === "Water_Level") && (
                    <img src={toAbsoluteUrl("media/widget/vibration.png")} style={{ width: "160px", height: "100px" }} className="mw-100" alt="" />
                  )}
                  <span className="fs-2hx fw-bold text-gray-900 mx-3 lh-1 ls-n2">{lastData?.name}</span>
                  <span className="fs-2hx fw-bold text-gray-900 lh-1 ls-n2">
                    {lastData?.value}
                    {lastData?.unit}
                  </span>
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
                  <h2>
                    {lastData?.value || 0}
                    {lastData?.unit}
                  </h2>
                  <span>{metadata.maxValue}</span>
                  <div className="progress-bar-container vertical h-100">
                    <div className="progress-bar" style={{ height: `${progressPercentage}%`, width: "100%" }}></div>
                  </div>
                  <div className="progress-labels-vertical d-flex flex-column align-items-center">
                    <span>{metadata.minValue}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {layout.widgetType === "HorizontalCard" && lastData && (
          <div className="hoverable w-100 h-100">
            <div className="text-center">
              <h2>{lastData?.name}</h2>
              <div className="d-flex flex-column flex-grow-1">
                <div className="temperature-display">
                  <h2>
                    {lastData?.value || 0}
                    {lastData?.unit}
                  </h2>
                  <div className="progress-bar-container">
                    <div className="progress-bar" style={{ width: `${progressPercentage}%` }}></div>
                  </div>
                  <div className="progress-labels">
                    <span>{metadata.minValue}</span>
                    <span>{metadata.maxValue}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {layout.widgetType === "TableCard" && lastData && (
          <div className="hoverable h-100">
            <div className="text-center">
              <h2>{lastData?.name}</h2>
              <table className="table table-striped table-bordered">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>
                      {lastData?.name}({lastData?.unit || "-"})
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {lastFiveData.length > 0 ? (
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

        {layout.widgetType === "DigitalGauge" && lastData && (
          <div className="hoverable h-100 text-center">
            <h2>{lastData?.name}</h2>
            <div className="circular-gauge-container text-center">
              <svg className="circular-gauge" width="270" height="270" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
                {/* Background Circle */}
                <circle cx="60" cy="60" r={45} fill="none" stroke="#e6e6e6" strokeWidth={10} />

                {/* Progress Circle */}
                <circle
                  cx="60"
                  cy="60"
                  r={45}
                  fill="none"
                  stroke="#f57c00"
                  strokeWidth={10}
                  strokeDasharray={2 * Math.PI * 45}
                  strokeDashoffset={2 * Math.PI * 45 - (2 * Math.PI * 45 * progressPercentage) / 100}
                  transform="rotate(-90 60 60)"
                />

                {/* Text Value */}
                <text x="60" y="65" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#555">
                  {lastData?.value || 0}
                  {lastData?.unit}
                </text>
              </svg>
            </div>
          </div>
        )}

        {layout.widgetType === "AnalogGauge" && lastData && (
          <div className="hoverable h-100 text-center">
            <h2>{lastData?.name}</h2>
            <div className="analog-gauge-container d-flex flex-column align-items-center flex-grow-1 h-100">
              <svg className="analog-gauge" width="250" height="250" viewBox="0 0 200 200">
                {/* Gauge background */}
                <circle cx="100" cy="100" r="90" stroke="#ddd" strokeWidth="10" fill="none" />

                {/* Color gradient arc */}
                <path d="M 30 100 A 70 70 0 1 1 170 100" stroke="url(#gradient)" strokeWidth="10" fill="none" />

                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="green" />
                    <stop offset="50%" stopColor="yellow" />
                    <stop offset="100%" stopColor="red" />
                  </linearGradient>
                </defs>

                {/* Tick marks */}
                {[...Array(13)].map((_, i) => {
                  const angle = (i * 15 - 180) * (Math.PI / 180); // Adjust angle calculation to match -80 to 120
                  const x1 = 100 + 80 * Math.cos(angle);
                  const y1 = 100 + 80 * Math.sin(angle);
                  const x2 = 100 + 85 * Math.cos(angle);
                  const y2 = 100 + 85 * Math.sin(angle);
                  return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={ktThemeModeValue === "dark" ? "#fff" : "#000"} strokeWidth="2" />;
                })}

                {/* Needle */}
                <line
                  x1="100"
                  y1="100"
                  x2={100 + 70 * Math.cos((calculateRotation(progressPercentage) - 90) * (Math.PI / 180))}
                  y2={100 + 70 * Math.sin((calculateRotation(progressPercentage) - 90) * (Math.PI / 180))}
                  stroke={ktThemeModeValue === "dark" ? "#fff" : "#000"}
                  strokeWidth="3"
                />

                {/* Center of the needle */}
                <circle cx="100" cy="100" r="5" fill={ktThemeModeValue === "dark" ? "#fff" : "#000"} />

                {/* Dynamic Labels */}
                {[...Array(13)].map((_, i) => {
                  const minValue = metadata.minValue;
                  const maxValue = metadata.maxValue;
                  const range = maxValue - minValue;
                  const value = Math.round(minValue + (range / 12) * i);
                  const angle = (i * 15 - 180) * (Math.PI / 180); // Adjust angle calculation to match -80 to 120
                  const x = 100 + 60 * Math.cos(angle);
                  const y = 100 + 60 * Math.sin(angle);
                  return (
                    <text key={i} x={x} y={y} textAnchor="middle" fontSize="9" fill={ktThemeModeValue === "dark" ? "#fff" : "#000"}>
                      {value}
                    </text>
                  );
                })}

                {/* Current value display */}
                <text x="100" y="150" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#555">
                  {lastData?.value || 0} {lastData?.unit}
                </text>
              </svg>
            </div>
          </div>
        )}
      </Rnd>
    </>
  );
};

export { ViewSensor };
