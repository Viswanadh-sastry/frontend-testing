import ApexCharts, { ApexOptions } from "apexcharts";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { Rnd } from "react-rnd";
import { toast } from "react-toastify";
import { getChannelThingList } from "../../../../channels/api/ChannelThingAPI";
import { getHistoryList } from "../../../../histories/api/HistoryAPI";
import { getThingChannelList } from "../../../../things/api/ThingChannelAPI";
import { editDashboard } from "../../../api/DashboardHelper";

interface IWidgetItemProps {
  widgetData: any;
  dashboardData: any;
  onSaveDashboard: (inputData: any, selectedLayout: any, deviceList: any[]) => void;
}

const WidgetItem = ({ widgetData, dashboardData }: IWidgetItemProps) => {
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
  const style = {
    // display: "flex",
    // alignItems: "center",
    // justifyContent: "center",
    border: "solid 1px #ddd",
    background: "#f0f0f0",
  };

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
        timeline: metadata.timeline,
        fromDate: metadata.fromDate,
        toDate: metadata.toDate,
        devices: devices,
      };
      refreshChart(data);
    }
  }, [widgetData]);

  const refreshChart = async (data: any) => {
    // Clear the chart before rendering a new one
    if (!chartRef.current) return;
    if (chartRef.current) {
      chartRef.current.innerHTML = "";
    }
    const filterGroupChannel = {
      offset: 0,
      limit: 100,
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
      fromTime = moment.utc(data.fromDate).startOf("day").valueOf() * 1000;
      toTime = moment.utc(data.toDate).endOf("day").valueOf() * 1000;
    } else {
      fromTime = moment.utc(moment().subtract(data.timeline, "days").format("YYYY-MM-DD")).startOf("day").valueOf() * 1000;
      toTime = moment.utc(moment().format("YYYY-MM-DD")).endOf("day").valueOf() * 1000;
    }

    const allHistoryData = [];
    const filterDevice = {
      limit: 100,
      offset: 0,
      thingId: [],
      status: "enabled",
      name: tempSensorTypeList[0],
      from: fromTime,
      to: toTime,
      publisher: "",
    };
    for (const device of deviceList) {
      const filterWithPublisher = { ...filterDevice, publisher: device.thingId };
      try {
        const historyData = await getHistoryList(device.channelId, filterWithPublisher);
        if (historyData.messages) {
          allHistoryData.push(...historyData.messages);
        }
      } catch (error: any) {
        toast.error(error.message);
      }
    }

    // Call getChartOptions function
    const chart = new ApexCharts(chartRef.current, getChartOptions(tempSensorTypeList[0], data, deviceList, allHistoryData));
    if (chart) {
      chart.render();
      setSelectedLayout({
        ...selectedLayout,
        title: data.name,
      });

      // Save the dashboard
      // onSaveDashboard(data, selectedLayout, deviceList);
    }
    return chart;
  };

  const submitChart = async (sensorType: string) => {
    console.log("inputData", inputData);
    // Set the current time for from and to
    let fromTime: number = 0;
    let toTime: number = 0;
    if (inputData.timeline === "0") {
      fromTime = moment.utc(inputData.fromDate).startOf("day").valueOf() * 1000;
      toTime = moment.utc(inputData.toDate).endOf("day").valueOf() * 1000;
    } else {
      fromTime = moment.utc(moment().subtract(inputData.timeline, "days").format("YYYY-MM-DD")).startOf("day").valueOf() * 1000;
      toTime = moment.utc(moment().format("YYYY-MM-DD")).endOf("day").valueOf() * 1000;
    }

    const allHistoryData = [];
    const filterDevice = {
      limit: 100,
      offset: 0,
      thingId: [],
      status: "enabled",
      name: sensorType,
      from: fromTime,
      to: toTime,
      publisher: "",
    };
    for (const device of deviceData) {
      const filterWithPublisher = { ...filterDevice, publisher: device.thingId };
      try {
        const historyData = await getHistoryList(device.channelId, filterWithPublisher);
        if (historyData.messages) {
          allHistoryData.push(...historyData.messages);
        }
      } catch (error: any) {
        toast.error(error.message);
      }
    }

    // Call getChartOptions function
    const chart = new ApexCharts(chartRef.current, getChartOptions(sensorType, inputData, deviceData, allHistoryData));
    if (chart) {
      chart.render();
      setSelectedLayout({
        ...selectedLayout,
        title: inputData.name,
      });
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
      <Rnd
        bounds="parent"
        style={style}
        className="d-flex flex-column align-items-center justify-content-center px-5"
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
          editDashboard({
            ...dashboardData,
            data: {
              ...dashboardData.data,
              widgets: dashboardData.data.widgets.map((item: any) => (item.widgetId === widget.widgetId ? widget : item)),
            },
          });
        }}
      >
        <div className="d-flex justify-content-between w-100">
          <div>
            <h4>{selectedLayout.title}</h4>
          </div>
          <div>
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
      </Rnd>
    </>
  );
};

export { WidgetItem };

// Final code for getChartOptions function
function getChartOptions(sensorType: string, inputData: any, deviceData: any, messages: any): ApexOptions {
  const categories: any = [];
  if (inputData.timeline === "0") {
    for (let i = moment.utc(inputData.fromDate).startOf("day").valueOf(); i <= moment.utc(inputData.toDate).startOf("day").valueOf(); i += 86400000) {
      categories.push({
        timeInFromTimestamp: i * 1000,
        timeInToTimestamp: (i + 86400000) * 1000,
        timeInDisplay: moment.utc(i).format("DD/MM"),
      });
    }
  } else {
    for (let i = inputData.timeline - 1; i >= 0; i--) {
      categories.push({
        timeInFromTimestamp: moment.utc(moment().subtract(i, "days").format("YYYY-MM-DD")).startOf("day").valueOf() * 1000,
        timeInToTimestamp: moment.utc(moment().subtract(i, "days").format("YYYY-MM-DD")).endOf("day").valueOf() * 1000,
        timeInDisplay: moment().subtract(i, "days").format("DD/MM"),
      });
    }
  }
  console.log("categories", categories);

  const series: any = [];
  deviceData.map((device: any) => {
    const categoryData: any = [];
    categories.map((category: any) => {
      // Filter messages per device and category (day)
      const data = messages.filter(
        (message: any) => message.publisher === device.thingId && message.time > category.timeInFromTimestamp && message.time < category.timeInToTimestamp
      );

      // For histogram, we use the count of messages
      categoryData.push(data.length || 0);
    });

    series.push({
      name: device.thingName,
      data: categoryData,
    });
  });
  console.log("deviceData", deviceData);
  console.log("series", series);

  // Chart Options for different layouts
  const { layout } = inputData;
  if (layout === "pie" || layout === "donut") {
    return {
      series: series.map((series: any) => series.data.reduce((a: any, b: any) => a + b, 0)),
      chart: {
        height: 300,
        type: layout,
      },
      dataLabels: {
        enabled: false,
      },
      labels: deviceData.map((device: any) => device.thingName),
      colors: ["#F97E1C", "#F9B32A", "#F9C63E", "#F9D94C", "#F9E75A", "#F9F068", "#FAF576", "#FAF884", "#FBF993", "#FBFAA2"],
    };
  } else if (layout === "histogram") {
    return {
      series: series,
      chart: {
        height: 300,
        type: layout,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          borderRadius: 4,
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: categories.map((category: any) => category.timeInDisplay),
      },
      yaxis: {
        title: {
          text: sensorType,
        },
      },
      colors: ["#F97E1C", "#F9B32A", "#F9C63E", "#F9D94C", "#F9E75A", "#F9F068", "#FAF576", "#FAF884", "#FBF993", "#FBFAA2"],
    };
  } else if (layout === "radialBar") {
    return {
      series: series.map((series: any) => series.data.reduce((a: any, b: any) => a + b, 0)),
      chart: {
        height: 300,
        type: layout,
      },
      plotOptions: {
        radialBar: {
          dataLabels: {
            total: {
              show: true,
              label: "Total",
            },
          },
        },
      },
      labels: deviceData.map((device: any) => device.thingName),
      colors: ["#F97E1C", "#F9B32A", "#F9C63E", "#F9D94C", "#F9E75A", "#F9F068", "#FAF576", "#FAF884", "#FBF993", "#FBFAA2"],
    };
  } else if (layout === "scatter") {
    return {
      series: series,
      chart: {
        height: 300,
        type: layout,
      },
      xaxis: {
        categories: categories.map((category: any) => category.timeInDisplay),
      },
      dataLabels: {
        enabled: false,
      },
      colors: ["#F97E1C", "#F9B32A", "#F9C63E", "#F9D94C", "#F9E75A", "#F9F068", "#FAF576", "#FAF884", "#FBF993", "#FBFAA2"],
    };
  } else if (layout === "heatmap") {
    return {
      series: series,
      chart: {
        height: 300,
        type: layout,
      },
      plotOptions: {
        heatmap: {
          shadeIntensity: 0.5,
          colorScale: {
            ranges: [
              { from: 0, to: 25, color: "#00A100" },
              { from: 26, to: 50, color: "#128FD9" },
              { from: 51, to: 75, color: "#FFB200" },
              { from: 76, to: 100, color: "#FF0000" },
            ],
          },
        },
      },
      xaxis: {
        categories: categories.map((category: any) => category.timeInDisplay),
      },
      dataLabels: {
        enabled: false,
      },
    };
  } else if (layout === "radar") {
    return {
      series: series,
      chart: {
        height: 300,
        type: layout,
      },
      labels: deviceData.map((device: any) => device.thingName),
      dataLabels: {
        enabled: false,
      },
      colors: ["#F97E1C", "#F9B32A", "#F9C63E", "#F9D94C", "#F9E75A", "#F9F068", "#FAF576", "#FAF884", "#FBF993", "#FBFAA2"],
    };
  } else if (layout === "polarArea") {
    const seriesData = series.map((series: any) => {
      // Ensure that we sum up valid numerical data for each device
      return series.data.reduce((a: number, b: number) => a + (b || 0), 0);
    });

    return {
      series: seriesData, // Pass the summed up data
      chart: {
        height: 300,
        type: layout,
      },
      labels: deviceData.map((device: any) => device.thingName),
      dataLabels: {
        enabled: false,
      },
      colors: ["#F97E1C", "#F9B32A", "#F9C63E", "#F9D94C", "#F9E75A", "#F9F068", "#FAF576", "#FAF884", "#FBF993", "#FBFAA2"],
      fill: {
        opacity: 0.8,
      },
      stroke: {
        width: 1,
      },
    };
  } else if (layout === "treemap") {
    return {
      series: [
        {
          data: deviceData.map((device: any) => ({
            x: device.name,
            y: series.find((series: any) => series.name === device.thingName)?.data.reduce((a: any, b: any) => a + b, 0),
          })),
        },
      ],
      chart: {
        height: 300,
        type: layout,
      },
      dataLabels: {
        enabled: false,
      },
      colors: ["#F97E1C", "#F9B32A", "#F9C63E", "#F9D94C", "#F9E75A", "#F9F068", "#FAF576", "#FAF884", "#FBF993", "#FBFAA2"],
    };
  } else if (layout === "rangeBar") {
    return {
      series: deviceData.map((device: any) => ({
        name: device.name,
        data: categories.map((category: any, index: number) => {
          const value = series.find((series: any) => series.name === device.thingName)?.data[index];
          return {
            x: category.timeInDisplay,
            y: value === 0 ? [0, 0] : [value - 5, value + 5],
          };
        }),
      })),
      chart: {
        height: 300,
        type: layout,
      },
      plotOptions: {
        bar: {
          horizontal: true,
        },
      },
      xaxis: {
        categories: categories.map((category: any) => category.timeInDisplay),
      },
      colors: ["#F97E1C", "#F9B32A", "#F9C63E", "#F9D94C", "#F9E75A", "#F9F068", "#FAF576", "#FAF884", "#FBF993", "#FBFAA2"],
    };
  } else if (layout === "candlestick") {
    return {
      series: deviceData.map((device: any) => ({
        name: device.thingName,
        data: categories.map((category: any, index: number) => {
          const value = series.find((series: any) => series.name === device.thingName)?.data[index];
          return {
            x: category.timeInDisplay,
            y: value === 0 ? [0, 0, 0, 0] : [value - 5, value + 5, value - 2, value + 2],
          };
        }),
      })),
      chart: {
        height: 300,
        type: layout,
      },
      xaxis: {
        categories: categories.map((category: any) => category.timeInDisplay),
      },
      colors: ["#F97E1C", "#F9B32A", "#F9C63E", "#F9D94C", "#F9E75A", "#F9F068", "#FAF576", "#FAF884", "#FBF993", "#FBFAA2"],
    };
  } else if (layout === "boxPlot") {
    return {
      series: deviceData.map((device: any) => ({
        name: device.thingName,
        data: categories.map((category: any, index: number) => {
          const value = series.find((series: any) => series.name === device.thingName)?.data[index];
          return {
            x: category.timeInDisplay,
            y: value === 0 ? [0, 0, 0, 0, 0] : [value - 10, value + 10, value - 5, value + 5, value],
          };
        }),
      })),
      chart: {
        height: 300,
        type: layout,
      },
      xaxis: {
        categories: categories.map((category: any) => category.timeInDisplay),
      },
      colors: ["#F97E1C", "#F9B32A", "#F9C63E", "#F9D94C", "#F9E75A", "#F9F068", "#FAF576", "#FAF884", "#FBF993", "#FBFAA2"],
    };
  } else if (layout === "bubble") {
    return {
      series: deviceData.map((device: any) => ({
        name: device.thingName,
        data: categories.map((category: any, index: number) => {
          const value = series.find((series: any) => series.name === device.thingName)?.data[index];
          return {
            x: category.timeInDisplay,
            y: value,
            z: value * 2,
          };
        }),
      })),
      chart: {
        height: 300,
        type: layout,
      },
      xaxis: {
        categories: categories.map((category: any) => category.timeInDisplay),
      },
      colors: ["#F97E1C", "#F9B32A", "#F9C63E", "#F9D94C", "#F9E75A", "#F9F068", "#FAF576", "#FAF884", "#FBF993", "#FBFAA2"],
    };
  } else {
    // Default chart type (for other types like line, area, etc.)
    console.log("series ---> ", series);
    return {
      series: series,
      chart: {
        height: 300,
        type: layout,
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "straight",
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"],
          opacity: 0.5,
        },
      },
      xaxis: {
        categories: categories.map((category: any) => category.timeInDisplay),
      },
      colors: ["#F97E1C", "#F9B32A", "#F9C63E", "#F9D94C", "#F9E75A", "#F9F068", "#FAF576", "#FAF884", "#FBF993", "#FBFAA2"],
    };
  }
}
