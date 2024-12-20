import ApexCharts from "apexcharts";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { getChannelThingList } from "../../../../channels/api/ChannelThingAPI";
import { getHistoryListAll } from "../../../../histories/api/HistoryAPI";
import { getThing } from "../../../../things/api/ThingAPI";
import { getThingChannelList } from "../../../../things/api/ThingChannelAPI";
import { getChartOptions, sortHistoryData } from "../../../api/DashboardHelper";

interface IWidgetPreviewItemProps {
  widgetData: any;
}

const WidgetPreviewItem = ({ widgetData }: IWidgetPreviewItemProps) => {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const layoutData = {
    height: widgetData.layouts.widgetSize.height,
    width: widgetData.layouts.widgetSize.width,
    left: widgetData.layouts.widgetPosition.left,
    top: widgetData.layouts.widgetPosition.top,
    order: widgetData.layouts.orderBy,
    title: widgetData.metadata.title,
    name: widgetData.layouts.widgetType,
    imageUrl: "",
  };
  const [selectedLayout, setSelectedLayout] = useState<any>(layoutData);
  const [sensorTypeList, setSensorTypeList] = useState<string[]>([]);
  const [deviceData, setDeviceData] = useState<any[]>([]);
  const [inputData, setInputData] = useState<any>(null);

  useEffect(() => {
    if (widgetData) {
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
      const data = {
        layout: layout.widgetType,
        name: metadata.title,
        interval: metadata.updateInterval,
        aggregationType: metadata.aggregationType,
        timeline: metadata.timeline,
        minValue: metadata.minValue,
        maxValue: metadata.maxValue,
        fromDate: metadata.fromDate,
        toDate: metadata.toDate,
        devices: devices,
      };
      refreshChart(data);
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.innerHTML = "";
      }
    };
  }, [widgetData]);

  const refreshChart = async (data: any) => {
    // Clear the chart before rendering a new one
    if (!chartRef.current) return;
    if (chartRef.current) {
      chartRef.current.innerHTML = "";
    }
    const filterGroupChannel = {
      offset: 0,
      limit: 10,
      name: "",
      status: "enabled",
    };
    const deviceList: any[] = [];
    const tempSensorTypeList: string[] = [];
    for (const device of data.devices) {
      if (device.deviceLabel === "thing") {
        const channelListByThingId = await getThingChannelList(device.deviceValue, filterGroupChannel);
        if (channelListByThingId.groups) {
          const groupsWithThingId = channelListByThingId.groups.map((group: any) => ({
            channelId: group.id,
            thingName: device.deviceName,
            thingId: device.deviceValue,
            sensorType: device.sensorType,
          }));
          if (groupsWithThingId.length > 0) {
            deviceList.push(groupsWithThingId[0]);
          }
        }
      } else {
        const channelListByGroupId = await getChannelThingList(device.deviceValue, filterGroupChannel);
        if (channelListByGroupId.things) {
          const groupsWithChannelId = channelListByGroupId.things.map((thing: any) => ({
            channelId: device.deviceValue,
            thingName: thing.name,
            thingId: thing.id,
            sensorType: device.sensorType,
          }));
          deviceList.push(...groupsWithChannelId);
        }
      }
      console.log("device.sensorType", device.sensorType);
      if (!tempSensorTypeList.includes(device.sensorType)) {
        tempSensorTypeList.push(device.sensorType);
      }
    }
    setSensorTypeList(tempSensorTypeList);
    setDeviceData(deviceList);
    setInputData(data);

    // Set the current time for from and to
    let fromTime: number = 0;
    let toTime: number = 0;
    if (data.timeline === "0") {
      fromTime = moment(data.fromDate).startOf("day").valueOf() * 1000000;
      toTime = moment(data.toDate).endOf("day").valueOf() * 1000000 + 999000;
    } else {
      fromTime = moment(moment().subtract(data.timeline, "days").format("YYYY-MM-DD")).startOf("day").valueOf() * 1000000;
      toTime = moment(moment().format("YYYY-MM-DD")).endOf("day").valueOf() * 1000000 + 999000;
    }

    const allHistoryData = [];
    const filterDevice = {
      limit: 100,
      offset: 0,
      thingId: [],
      status: "enabled",
      name: tempSensorTypeList[0],
      from: Number(String(fromTime).slice(0, 10)),
      to: Number(String(toTime).slice(0, 10)),
      publisher: "",
    };
    for (const device of deviceList) {
      const filterWithPublisher = { ...filterDevice, publisher: device.thingId };
      try {
        const historyData = await getHistoryListAll(device.channelId, filterWithPublisher);
        if (historyData.messages) {
          allHistoryData.push(...historyData.messages);

          // Check device's Alert_Threshold value with history data
          getThing(device.thingId).then((thingData) => {
            if (thingData.metadata) {
              const alertThreshold = thingData.metadata.Alert_Threshold;
              if (alertThreshold) {
                const alertData = historyData.messages.filter((message: any) => message.value > alertThreshold);
                if (alertData.length > 0) {
                  toast.warning(`Widget: ${data.name} - Device: ${device.thingName} has exceeded the alert threshold`);
                }
              }
            }
          });
        }
      } catch (error: any) {
        toast.error(error.message);
      }
    }

    // order by unix time descending
    allHistoryData.sort((a: any, b: any) => sortHistoryData(a, b));

    // Call getChartOptions function
    const chart = new ApexCharts(chartRef.current, getChartOptions(tempSensorTypeList[0], data, deviceList, allHistoryData));
    if (chart) {
      chart.render();
      setSelectedLayout({
        ...selectedLayout,
        title: data.name,
      });
    }
    return chart;
  };

  const submitChart = async (sensorType: string) => {
    // Set the current time for from and to
    let fromTime: number = 0;
    let toTime: number = 0;
    if (inputData.timeline === "0") {
      fromTime = moment(inputData.fromDate).startOf("day").valueOf() * 1000000;
      toTime = moment(inputData.toDate).endOf("day").valueOf() * 1000000 + 999000;
    } else {
      fromTime = moment(moment().subtract(inputData.timeline, "days").format("YYYY-MM-DD")).startOf("day").valueOf() * 1000000;
      toTime = moment(moment().format("YYYY-MM-DD")).endOf("day").valueOf() * 1000000 + 999000;
    }

    const allHistoryData = [];
    const filterDevice = {
      limit: 100,
      offset: 0,
      thingId: [],
      status: "enabled",
      name: sensorType,
      from: Number(String(fromTime).slice(0, 10)),
      to: Number(String(toTime).slice(0, 10)),
      publisher: "",
    };
    for (const device of deviceData) {
      const filterWithPublisher = { ...filterDevice, publisher: device.thingId };
      try {
        const historyData = await getHistoryListAll(device.channelId, filterWithPublisher);
        if (historyData.messages) {
          allHistoryData.push(...historyData.messages);

          // Check device's Alert_Threshold value with history data
          getThing(device.thingId).then((thingData) => {
            if (thingData.metadata) {
              const alertThreshold = thingData.metadata.Alert_Threshold;
              if (alertThreshold) {
                const alertData = historyData.messages.filter((message: any) => message.value > alertThreshold);
                if (alertData.length > 0) {
                  toast.warning(`Widget: ${inputData.name} - Device: ${device.thingName} has exceeded the alert threshold`);
                }
              }
            }
          });
        }
      } catch (error: any) {
        toast.error(error.message);
      }
    }

    // order by unix time descending
    allHistoryData.sort((a: any, b: any) => sortHistoryData(a, b));

    // Call getChartOptions function
    const chart = new ApexCharts(chartRef.current, getChartOptions(sensorType, inputData, deviceData, allHistoryData));
    if (chart) {
      chart.render();
      //   setSelectedLayout({
      //     ...selectedLayout,
      //     title: inputData.name,
      //   });
    }
    return chart;
  };

  const onSelectSensorType = (e: any) => {
    // Clear the chart before rendering a new one
    if (chartRef.current) {
      chartRef.current.innerHTML = "";
    }
    submitChart(e.target.value);
  };

  return (
    <>
      <div
        className="card d-flex flex-column align-items-center justify-content-center p-5"
        style={{
          position: "absolute",
          left: `${selectedLayout.left}px`,
          top: `${selectedLayout.top}px`,
          width: `${selectedLayout.width}px`,
          height: `${selectedLayout.height}px`,
        }}
      >
        <div className="d-flex justify-content-between w-100">
          <h4>{selectedLayout.title}</h4>
          <div className="d-flex">
            {sensorTypeList.length > 0 && (
              <select className="form-select form-select-sm" aria-label=".form-select-sm example" onChange={onSelectSensorType}>
                {sensorTypeList.map((sensorType: any, index: number) => (
                  <option key={index} value={sensorType}>
                    {sensorType}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        <div
          ref={chartRef}
          id="kt_charts_widget"
          className="card-body"
          style={{
            height: `${selectedLayout.height}px`, // Deducting some space for padding/margins if needed
            width: `${selectedLayout.width}px`,
          }}
        ></div>
      </div>
      {/* <Rnd
        bounds="parent"
        style={style}
        className="d-flex flex-column align-items-center justify-content-center px-5"
        default={{ x: selectedLayout.left, y: selectedLayout.top, width: selectedLayout.width, height: selectedLayout.height }}
        size={{ width: selectedLayout.width, height: selectedLayout.height }}
        position={{ x: selectedLayout.left, y: selectedLayout.top }}
      >
        <div className="d-flex justify-content-between w-100">
          <div>
            <h4>{selectedLayout.title}</h4>
          </div>
          <div className="d-flex">
            {sensorTypeList.length > 0 && (
              <select className="form-select form-select-sm" aria-label=".form-select-sm example" onChange={onSelectSensorType}>
                {sensorTypeList.map((sensorType: any, index: number) => (
                  <option key={index} value={sensorType}>
                    {sensorType}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
        <div
          ref={chartRef}
          id="kt_charts_widget"
          style={{
            height: `${selectedLayout.height - 85}px`, // Deducting some space for padding/margins if needed
            width: `${selectedLayout.width - 40}px`,
          }}
        ></div>
      </Rnd> */}
    </>
  );
};

export { WidgetPreviewItem };
