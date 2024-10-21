import { ApexOptions } from "apexcharts"
import moment from "moment"

const DASH_LOCAL_STORAGE_KEY = 'rapid-dashboard'

const getDashboard = (): any => {
    if (!localStorage) {
        return
    }

    const lsValue: string | null = localStorage.getItem(DASH_LOCAL_STORAGE_KEY)
    if (!lsValue) {
        return
    }

    try {
        const dash: any = JSON.parse(lsValue) as any
        if (dash) {
            return dash
        }
    } catch (error) {
        console.error('DASH LOCAL STORAGE PARSE ERROR', error)
    }
}

const setDashboard = (dash: any) => {
    if (!localStorage) {
        return
    }

    try {
        const lsValue = JSON.stringify(dash)
        localStorage.setItem(DASH_LOCAL_STORAGE_KEY, lsValue)
    } catch (error) {
        console.error('DASH LOCAL STORAGE SAVE ERROR', error)
    }
}

const clearDashboard = () => {
    if (!localStorage) {
        return
    }

    try {
        localStorage.removeItem(DASH_LOCAL_STORAGE_KEY)
    } catch (error) {
        console.error('DASH LOCAL STORAGE REMOVE ERROR', error)
    }
}

const addDashboard = (dash: any) => {
    if (!localStorage) {
        return
    }

    try {
        const dashboards = getDashboard()
        if (dashboards) {
            dashboards.push(dash)
            const lsValue = JSON.stringify(dashboards)
            localStorage.setItem(DASH_LOCAL_STORAGE_KEY, lsValue)
        }
        return dashboards
    } catch (error) {
        console.error('DASH LOCAL STORAGE ADD ERROR', error)
    }
}

const editDashboard = (dash: any) => {
    if (!localStorage) {
        return
    }

    try {
        const dashboards = getDashboard()
        if (dashboards) {
            const index = dashboards.findIndex((d: any) => d.id === dash.id)
            dashboards[index] = dash
            const lsValue = JSON.stringify(dashboards)
            localStorage.setItem(DASH_LOCAL_STORAGE_KEY, lsValue)
        }
        return dashboards
    } catch (error) {
        console.error('DASH LOCAL STORAGE EDIT ERROR', error)
    }
}

const removeDashboard = (dash: any) => {
    if (!localStorage) {
        return
    }

    try {
        const dashboards = getDashboard()
        if (dashboards) {
            const index = dashboards.findIndex((d: any) => d.id === dash.id)
            dashboards.splice(index, 1)
            const lsValue = JSON.stringify(dashboards)
            localStorage.setItem(DASH_LOCAL_STORAGE_KEY, lsValue)
        }
        return dashboards
    } catch (error) {
        console.error('DASH LOCAL STORAGE REMOVE ERROR', error)
    }
}

const getDashboardById = (id: string) => {
    if (!localStorage) {
        return
    }

    const dashboards = getDashboard()
    if (dashboards) {
        return dashboards.find((d: any) => d.id === id)
    }
}

const updateWidgetById = (id: string, widget: any) => {
    if (!localStorage) {
        return
    }

    try {
        const dashboards = getDashboard()
        if (dashboards) {
            const dash = dashboards.find((d: any) => d.id === id)
            if (dash) {
                const index = dash.data.widgets.findIndex((w: any) => w.widgetId === widget.widgetId)
                dash.data.widgets[index] = {
                    widgetId: widget.widgetId,
                    layouts: dash.data.widgets[index].layouts,
                    metadata: widget.metadata,
                }
                const lsValue = JSON.stringify(dashboards)
                localStorage.setItem(DASH_LOCAL_STORAGE_KEY, lsValue)
            }
        }
        return dashboards
    } catch (error) {
        console.error('DASH LOCAL STORAGE EDIT ERROR', error)
    }
}

const deleteWidgetById = (id: string, widgetId: string) => {
    if (!localStorage) {
        return
    }

    try {
        const dashboards = getDashboard()
        if (dashboards) {
            const dash = dashboards.find((d: any) => d.id === id)
            if (dash) {
                const index = dash.data.widgets.findIndex((w: any) => w.widgetId === widgetId)
                dash.data.widgets.splice(index, 1)
                const lsValue = JSON.stringify(dashboards)
                localStorage.setItem(DASH_LOCAL_STORAGE_KEY, lsValue)
            }
        }
        return dashboards
    } catch (error) {
        console.error('DASH LOCAL STORAGE EDIT ERROR', error)
    }
}

// Final code for getChartOptions function
const getChartOptions = (sensorType: string, inputData: any, deviceData: any, messages: any): ApexOptions => {
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
                        x: device.thingName,
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
                name: device.thingName,
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


export { getDashboard, setDashboard, clearDashboard, addDashboard, editDashboard, removeDashboard, getDashboardById, updateWidgetById, deleteWidgetById, getChartOptions, DASH_LOCAL_STORAGE_KEY }
