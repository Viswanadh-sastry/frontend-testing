import ApexCharts, { ApexOptions } from "apexcharts";
import { useEffect, useRef } from "react";
import { ThemeModeComponent } from "../../../_metronic/assets/ts/layout";

interface IDonutWidgetProps {
  chartParams: { dataPointIndex: any; originalState: boolean };
  userData: any;
  groupData: any;
  assetData: any;
  deviceData: any;
  disabledUserData: any;
  disabledGroupData: any;
  disabledAssetData: any;
  disabledDeviceData: any;
}

const DonutWidget = ({
  chartParams,
  userData,
  groupData,
  assetData,
  deviceData,
  disabledUserData,
  disabledGroupData,
  disabledAssetData,
  disabledDeviceData,
}: IDonutWidgetProps) => {
  const chartRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (chartRef.current && chartParams && userData && groupData && assetData && deviceData && disabledUserData && disabledGroupData && disabledAssetData && disabledDeviceData) {
      const chart = refreshChart(chartParams.dataPointIndex, chartParams.originalState);

      return () => {
        if (chart) {
          chart.destroy();
        }
      };
    }
  }, [chartRef, chartParams, userData, groupData, assetData, deviceData, disabledUserData, disabledGroupData, disabledAssetData, disabledDeviceData]);

  const refreshChart = (dataPointIndex = null, originalState = true) => {
    if (!chartRef.current) {
      return;
    }
    const chart = new ApexCharts(
      chartRef.current,
      getChartOptions(userData, groupData, assetData, deviceData, disabledUserData, disabledGroupData, disabledAssetData, disabledDeviceData, dataPointIndex, originalState)
    );
    if (chart) {
      chart.render();
    }
    return chart;
  };

  return (
    <div className="card mb-xl-8">
      {/* begin::Body */}
      <div className="card-body">
        {/* begin::Chart */}
        <div ref={chartRef} style={{ height: "315px" }} />
        {/* end::Chart */}
      </div>
      {/* end::Body */}
    </div>
  );
};

export { DonutWidget };

function getChartOptions(
  userData: any,
  groupData: any,
  assetData: any,
  deviceData: any,
  disabledUserData: any,
  disabledGroupData: any,
  disabledAssetData: any,
  disabledDeviceData: any,
  dataPointIndex = null,
  originalState = true
): ApexOptions {
  let ktThemeModeValue = localStorage.getItem("kt_theme_mode_value");
  if (ktThemeModeValue === "system") {
    ktThemeModeValue = ThemeModeComponent.getSystemMode() as "light" | "dark";
  }
  const originalSeries = [userData?.length ?? 0, deviceData?.length ?? 0, groupData?.length ?? 0, assetData?.length ?? 0];
  const originalLabels = ["Users", "Devices", "Asset Groups", "Assets"];
  const isOriginalState = originalState; // Flag to track the current state

  if (isOriginalState) {
    return {
      series:
        dataPointIndex === 0
          ? [userData.length, disabledUserData.length]
          : dataPointIndex === 1
          ? [deviceData.length, disabledDeviceData.length]
          : dataPointIndex === 2
          ? [groupData.length, disabledGroupData.length]
          : dataPointIndex === 3
          ? [assetData.length, disabledAssetData.length]
          : [],
      labels: ["Enabled", "Disabled"],
      chart: {
        type: "donut",
        height: 315,
        // events: {
        //   dataPointSelection: (event, chartContext) => {
        //     // Switch back to the original view
        //     chartContext.updateOptions({
        //       series: originalSeries,
        //       labels: originalLabels,
        //       chart: {
        //         type: "donut",
        //       },
        //       plotOptions: {
        //         pie: {
        //           donut: {
        //             labels: {
        //               show: false,
        //             },
        //           },
        //         },
        //       },
        //     });
        //   },
        // },
      },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              total: {
                show: true,
                showAlways: true,
                label: dataPointIndex === 0 ? "Users" : dataPointIndex === 1 ? "Devices" : dataPointIndex === 2 ? "Asset Groups" : dataPointIndex === 3 ? "Assets" : "",
                color: ktThemeModeValue === "dark" ? "#ffffff" : "#000000",
                formatter: function (w: any) {
                  return w.globals.seriesTotals.reduce((a: any, b: any) => {
                    return a + b;
                  }, 0);
                },
              },
              value: {
                show: true,
                color: ktThemeModeValue === "dark" ? "#ffffff" : "#000000",
              },
            },
          },
        },
      },
      legend: {
        position: "bottom",
        labels: {
          colors: ktThemeModeValue === "dark" ? "#ffffff" : "#000000",
        },
      },
      fill: {
        type: "gradient",
        opacity: 1,
      },
      responsive: [
        {
          breakpoint: 315,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
      colors: [dataPointIndex === 0 ? "#f8c529" : dataPointIndex === 1 ? "#f9bc34" : dataPointIndex === 2 ? "#f9a62a" : dataPointIndex === 3 ? "#f9942a" : "#f8c529", "#F4572C"],
    };
  } else {
    return {
      series: originalSeries,
      labels: originalLabels,
      chart: {
        type: "donut",
        height: 315,
        // events: {
        //   dataPointSelection: (event, chartContext, config) => {
        //     // Switch to "Enabled/Disabled" view
        //     chartContext.updateOptions({
        //       series:
        //         dataPointIndex === 0 && config.dataPointIndex === 0
        //           ? [userData.length, disabledUserData.length]
        //           : dataPointIndex === 1 && config.dataPointIndex === 1
        //           ? [deviceData.length, disabledDeviceData.length]
        //           : dataPointIndex === 2 && config.dataPointIndex === 2
        //           ? [groupData.length, disabledGroupData.length]
        //           : dataPointIndex === 3 && config.dataPointIndex === 3
        //           ? [assetData.length, disabledAssetData.length]
        //           : config.dataPointIndex === 0
        //           ? [userData.length, disabledUserData.length]
        //           : config.dataPointIndex === 1
        //           ? [deviceData.length, disabledDeviceData.length]
        //           : config.dataPointIndex === 2
        //           ? [groupData.length, disabledGroupData.length]
        //           : config.dataPointIndex === 3
        //           ? [assetData.length, disabledAssetData.length]
        //           : [],
        //       labels: ["Enabled", "Disabled"],
        //       chart: {
        //         type: "donut",
        //       },
        //       plotOptions: {
        //         pie: {
        //           donut: {
        //             labels: {
        //               show: true,
        //               total: {
        //                 show: true,
        //                 showAlways: true,
        //                 label:
        //                   config.dataPointIndex === 0
        //                     ? "Users"
        //                     : config.dataPointIndex === 1
        //                     ? "Devices"
        //                     : config.dataPointIndex === 2
        //                     ? "Asset Groups"
        //                     : config.dataPointIndex === 3
        //                     ? "Assets"
        //                     : "",
        //                 formatter: function (w: any) {
        //                   return w.globals.seriesTotals.reduce((a: any, b: any) => {
        //                     return a + b;
        //                   }, 0);
        //                 },
        //               },
        //             },
        //           },
        //         },
        //       },
        //     });
        //   },
        // },
      },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: false,
            },
          },
        },
      },
      legend: {
        position: "bottom",
        labels: {
          colors: ktThemeModeValue === "dark" ? "#ffffff" : "#000000",
        },
      },
      fill: {
        type: "gradient",
        opacity: 1,
      },
      responsive: [
        {
          breakpoint: 315,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
      colors: ["#f8c529", "#f9bc34", "#f9a62a", "#f9942a"],
    };
  }
}
