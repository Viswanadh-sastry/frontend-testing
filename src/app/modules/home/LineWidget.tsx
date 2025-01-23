import ApexCharts, { ApexOptions } from "apexcharts";
import { useEffect, useRef } from "react";
import moment from "moment";
import { ThemeModeComponent } from "../../../_metronic/assets/ts/layout";

interface ILineWidgetProps {
  userData: any;
  groupData: any;
  assetData: any;
  deviceData: any;
}

const LineWidget = ({ userData, groupData, assetData, deviceData }: ILineWidgetProps) => {
  const chartRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (chartRef.current && userData && groupData && assetData && deviceData) {
      const chart = refreshChart();

      return () => {
        if (chart) {
          chart.destroy();
        }
      };
    }
  }, [chartRef, userData, groupData, assetData, deviceData]);

  const refreshChart = () => {
    if (!chartRef.current) {
      return;
    }
    const chart = new ApexCharts(chartRef.current, getChartOptions(userData, groupData, assetData, deviceData));
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

export { LineWidget };

function getChartOptions(userData: any, groupData: any, assetData: any, deviceData: any): ApexOptions {
  let ktThemeModeValue = localStorage.getItem("kt_theme_mode_value");
  if (ktThemeModeValue === "system") {
    ktThemeModeValue = ThemeModeComponent.getSystemMode() as "light" | "dark";
  }
  // get last 7 days data for each user, group, asset, device using moment.js
  const last0DayUserData = userData.filter((item: any) => moment(item.created_at).format("YYYY-MM-DD") === moment().format("YYYY-MM-DD"));
  const last1DayUserData = userData.filter((item: any) => moment(item.created_at).format("YYYY-MM-DD") === moment().subtract(1, "days").format("YYYY-MM-DD"));
  const last2DayUserData = userData.filter((item: any) => moment(item.created_at).format("YYYY-MM-DD") === moment().subtract(2, "days").format("YYYY-MM-DD"));
  const last3DayUserData = userData.filter((item: any) => moment(item.created_at).format("YYYY-MM-DD") === moment().subtract(3, "days").format("YYYY-MM-DD"));
  const last4DayUserData = userData.filter((item: any) => moment(item.created_at).format("YYYY-MM-DD") === moment().subtract(4, "days").format("YYYY-MM-DD"));
  const last5DayUserData = userData.filter((item: any) => moment(item.created_at).format("YYYY-MM-DD") === moment().subtract(5, "days").format("YYYY-MM-DD"));
  const last6DayUserData = userData.filter((item: any) => moment(item.created_at).format("YYYY-MM-DD") === moment().subtract(6, "days").format("YYYY-MM-DD"));

  const last0DayGroupData = groupData.filter((item: any) => moment(item.created_at).format("YYYY-MM-DD") === moment().format("YYYY-MM-DD"));
  const last1DayGroupData = groupData.filter((item: any) => moment(item.created_at).format("YYYY-MM-DD") === moment().subtract(1, "days").format("YYYY-MM-DD"));
  const last2DayGroupData = groupData.filter((item: any) => moment(item.created_at).format("YYYY-MM-DD") === moment().subtract(2, "days").format("YYYY-MM-DD"));
  const last3DayGroupData = groupData.filter((item: any) => moment(item.created_at).format("YYYY-MM-DD") === moment().subtract(3, "days").format("YYYY-MM-DD"));
  const last4DayGroupData = groupData.filter((item: any) => moment(item.created_at).format("YYYY-MM-DD") === moment().subtract(4, "days").format("YYYY-MM-DD"));
  const last5DayGroupData = groupData.filter((item: any) => moment(item.created_at).format("YYYY-MM-DD") === moment().subtract(5, "days").format("YYYY-MM-DD"));
  const last6DayGroupData = groupData.filter((item: any) => moment(item.created_at).format("YYYY-MM-DD") === moment().subtract(6, "days").format("YYYY-MM-DD"));

  const last0DayAssetData = assetData.filter((item: any) => moment(item.created_at).format("YYYY-MM-DD") === moment().format("YYYY-MM-DD"));
  const last1DayAssetData = assetData.filter((item: any) => moment(item.created_at).format("YYYY-MM-DD") === moment().subtract(1, "days").format("YYYY-MM-DD"));
  const last2DayAssetData = assetData.filter((item: any) => moment(item.created_at).format("YYYY-MM-DD") === moment().subtract(2, "days").format("YYYY-MM-DD"));
  const last3DayAssetData = assetData.filter((item: any) => moment(item.created_at).format("YYYY-MM-DD") === moment().subtract(3, "days").format("YYYY-MM-DD"));
  const last4DayAssetData = assetData.filter((item: any) => moment(item.created_at).format("YYYY-MM-DD") === moment().subtract(4, "days").format("YYYY-MM-DD"));
  const last5DayAssetData = assetData.filter((item: any) => moment(item.created_at).format("YYYY-MM-DD") === moment().subtract(5, "days").format("YYYY-MM-DD"));
  const last6DayAssetData = assetData.filter((item: any) => moment(item.created_at).format("YYYY-MM-DD") === moment().subtract(6, "days").format("YYYY-MM-DD"));

  const last0DayDeviceData = deviceData.filter((item: any) => moment(item.created_at).format("YYYY-MM-DD") === moment().format("YYYY-MM-DD"));
  const last1DayDeviceData = deviceData.filter((item: any) => moment(item.created_at).format("YYYY-MM-DD") === moment().subtract(1, "days").format("YYYY-MM-DD"));
  const last2DayDeviceData = deviceData.filter((item: any) => moment(item.created_at).format("YYYY-MM-DD") === moment().subtract(2, "days").format("YYYY-MM-DD"));
  const last3DayDeviceData = deviceData.filter((item: any) => moment(item.created_at).format("YYYY-MM-DD") === moment().subtract(3, "days").format("YYYY-MM-DD"));
  const last4DayDeviceData = deviceData.filter((item: any) => moment(item.created_at).format("YYYY-MM-DD") === moment().subtract(4, "days").format("YYYY-MM-DD"));
  const last5DayDeviceData = deviceData.filter((item: any) => moment(item.created_at).format("YYYY-MM-DD") === moment().subtract(5, "days").format("YYYY-MM-DD"));
  const last6DayDeviceData = deviceData.filter((item: any) => moment(item.created_at).format("YYYY-MM-DD") === moment().subtract(6, "days").format("YYYY-MM-DD"));

  return {
    series: [
      {
        name: "Users",
        data: [
          last6DayUserData.length,
          last5DayUserData.length,
          last4DayUserData.length,
          last3DayUserData.length,
          last2DayUserData.length,
          last1DayUserData.length,
          last0DayUserData.length,
        ],
      },
      {
        name: "Devices",
        data: [
          last6DayDeviceData.length,
          last5DayDeviceData.length,
          last4DayDeviceData.length,
          last3DayDeviceData.length,
          last2DayDeviceData.length,
          last1DayDeviceData.length,
          last0DayDeviceData.length,
        ],
      },
      {
        name: "Asset Groups",
        data: [
          last6DayGroupData.length,
          last5DayGroupData.length,
          last4DayGroupData.length,
          last3DayGroupData.length,
          last2DayGroupData.length,
          last1DayGroupData.length,
          last0DayGroupData.length,
        ],
      },
      {
        name: "Assets",
        data: [
          last6DayAssetData.length,
          last5DayAssetData.length,
          last4DayAssetData.length,
          last3DayAssetData.length,
          last2DayAssetData.length,
          last1DayAssetData.length,
          last0DayAssetData.length,
        ],
      },
    ],
    chart: {
      height: 300,
      type: "area",
      zoom: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      labels: {
        colors: ktThemeModeValue === "dark" ? "#ffffff" : "#000000",
      },
    },
    stroke: {
      curve: "straight",
    },
    xaxis: {
      categories: [
        moment().subtract(6, "days").format("DD/MM"),
        moment().subtract(5, "days").format("DD/MM"),
        moment().subtract(4, "days").format("DD/MM"),
        moment().subtract(3, "days").format("DD/MM"),
        moment().subtract(2, "days").format("DD/MM"),
        moment().subtract(1, "days").format("DD/MM"),
        moment().format("DD/MM"),
      ],
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
    colors: ["#f8c529", "#f9bc34", "#f9a62a", "#f9942a"],
  };
}
