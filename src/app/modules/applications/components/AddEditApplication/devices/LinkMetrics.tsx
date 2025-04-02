import ApexCharts, { ApexOptions } from "apexcharts";
import moment from "moment";
import { useEffect, useRef } from "react";
import { ThemeModeComponent } from "../../../../../../_metronic/assets/ts/layout";

interface IWidgetPreviewItemProps {
  layout: string;
  metricName: string;
  groupName: string;
  widgetData: any;
}

const LinkMetrics = ({ layout, metricName, groupName, widgetData }: IWidgetPreviewItemProps) => {
  const chartRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (widgetData) {
      refreshChart();
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.innerHTML = "";
      }
    };
  }, [widgetData]);

  const refreshChart = async () => {
    // Clear the chart before rendering a new one
    if (!chartRef.current) return;
    if (chartRef.current) {
      chartRef.current.innerHTML = "";
    }

    // Call getChartOptions function
    const chart = new ApexCharts(chartRef.current, getChartOptions(layout, widgetData, metricName, groupName));
    if (chart) {
      chart.render();
    }
    return chart;
  };

  return (
    <>
      <div
        ref={chartRef}
        id="kt_charts_widget"
        className="card-body"
        style={{
          width: `100%`,
        }}
      ></div>
    </>
  );
};

export { LinkMetrics };

const getChartOptions = (layout: any, deviceData: any, metricName: string, groupName: string): ApexOptions => {
  // Get the theme mode value
  let ktThemeModeValue = localStorage.getItem("kt_theme_mode_value");
  if (ktThemeModeValue === "system") {
    ktThemeModeValue = ThemeModeComponent.getSystemMode() as "light" | "dark";
  }
  const timestamps: string[] = deviceData.timestamps.map((timestamp: any) =>
    moment(timestamp).format(groupName === "24h" ? "h:mm" : groupName === "31d" ? "DD/MM" : groupName === "1y" ? "MM/YYYY" : "DD/MM/YYYY")
  );
  const datasets: { name: string; data: number[] }[] =
    deviceData.datasets.length > 0
      ? deviceData.datasets.map((dataset: any) => ({
          name: dataset.label,
          data: dataset.data,
        }))
      : [
          {
            name: metricName,
            data: timestamps.map(() => 0), // Default to 0 if no data is available
          },
        ];
  console.log("last12Timestamps", timestamps);
  console.log("last12Datasets", datasets);

  // Default chart type (for other types like line, area, etc.)
  return {
    series: datasets,
    chart: {
      type: layout,
      zoom: {
        enabled: false,
      },
      height: "90%",
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "straight",
    },
    xaxis: {
      categories: timestamps,
      labels: {
        rotate: -45,
        rotateAlways: true,
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
    legend: {
      showForSingleSeries: true,
      labels: {
        colors: ktThemeModeValue === "dark" ? "#ffffff" : "#000000",
      },
    },
    colors: ["#f8c529", "#f9bc34", "#f9a62a", "#f9942a"],
  };
};
