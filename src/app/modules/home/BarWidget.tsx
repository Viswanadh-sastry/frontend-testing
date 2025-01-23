import ApexCharts, { ApexOptions } from "apexcharts";
import { useEffect, useRef } from "react";
import { ThemeModeComponent } from "../../../_metronic/assets/ts/layout";

interface IBarWidgetProps {
  userData: any;
  groupData: any;
  assetData: any;
  deviceData: any;
  disabledUserData: any;
  disabledGroupData: any;
  disabledAssetData: any;
  disabledDeviceData: any;
}

const BarWidget = ({ userData, groupData, assetData, deviceData, disabledUserData, disabledGroupData, disabledAssetData, disabledDeviceData }: IBarWidgetProps) => {
  const chartRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (chartRef.current && userData && groupData && assetData && deviceData && disabledUserData && disabledGroupData && disabledAssetData && disabledDeviceData) {
      const chart = refreshChart();

      return () => {
        if (chart) {
          chart.destroy();
        }
      };
    }
  }, [chartRef, userData, groupData, assetData, deviceData, disabledUserData, disabledGroupData, disabledAssetData, disabledDeviceData]);

  const refreshChart = () => {
    if (!chartRef.current) {
      return;
    }

    const chart = new ApexCharts(
      chartRef.current,
      getChartOptions(userData, groupData, assetData, deviceData, disabledUserData, disabledGroupData, disabledAssetData, disabledDeviceData)
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
        <div ref={chartRef} id="kt_charts_widget_1_chart" style={{ height: "300px" }} />
        {/* end::Chart */}
      </div>
      {/* end::Body */}
    </div>
  );
};

export { BarWidget };

function getChartOptions(
  userData: any,
  groupData: any,
  assetData: any,
  deviceData: any,
  disabledUserData: any,
  disabledGroupData: any,
  disabledAssetData: any,
  disabledDeviceData: any
): ApexOptions {
  let ktThemeModeValue = localStorage.getItem("kt_theme_mode_value");
  if (ktThemeModeValue === "system") {
    ktThemeModeValue = ThemeModeComponent.getSystemMode() as "light" | "dark";
  }
  return {
    series: [
      {
        name: "Enabled",
        data: [
          {
            x: "Users",
            y: userData.length,
            fillColor: "#f8c529",
          },
          {
            x: "Devices",
            y: deviceData.length,
            fillColor: "#f9bc34",
          },
          {
            x: "Asset Groups",
            y: groupData.length,
            fillColor: "#f9a62a",
          },
          {
            x: "Assets",
            y: assetData.length,
            fillColor: "#f9942a",
          },
        ],
      },
      {
        name: "Disabled",
        data: [
          {
            x: "Users",
            y: disabledUserData.length,
            fillColor: "#F4572C",
          },
          {
            x: "Devices",
            y: disabledDeviceData.length,
            fillColor: "#F4572C",
          },
          {
            x: "Asset Groups",
            y: disabledGroupData.length,
            fillColor: "#F4572C",
          },
          {
            x: "Assets",
            y: disabledAssetData.length,
            fillColor: "#F4572C",
          },
        ],
      },
    ],
    chart: {
      type: "bar",
      height: 300,
      stacked: true,
      toolbar: {
        show: true,
      },
      zoom: {
        enabled: true,
      },
    },
    legend: {
      show: true,
      position: "bottom",
      labels: {
        colors: ktThemeModeValue === "dark" ? "#ffffff" : "#000000",
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "40%",
        borderRadius: [5, 5, 5, 5],
      },
    },
    fill: {
      opacity: 1,
    },
    xaxis: {
      labels: {
        style: {
          colors: ktThemeModeValue === "dark" ? "#ffffff" : "#000000",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: ktThemeModeValue === "dark" ? "#ffffff" : "#000000",
        },
      },
    },
    colors: ["#f9bc34", "#F4572C"],
  };
}
