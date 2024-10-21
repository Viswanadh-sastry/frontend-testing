import moment from "moment";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { KTCard, KTCardBody, KTIcon } from "../../../../../_metronic/helpers";
import { useAuth } from "../../../auth";
import { getHistoryList } from "../../../histories/api/HistoryAPI";
import { updateDashboard } from "../../api/DashboardAPI";
import { editDashboard, getDashboard, getDashboardById } from "../../api/DashboardHelper";
import { WidgetDrawer } from "./Widget/WidgetDrawer";
import { WidgetItem } from "./Widget/WidgetItem";

const LayoutBuilder = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { id: userId } = currentUser || { id: "" };
  const params = useParams();
  const id = params.id as string;
  const dashboard = getDashboardById(id);

  const refreshChart = async (data: any) => {
    // Set the current time for from and to
    let fromTime: number = 0;
    let toTime: number = 0;
    if (data.timeline === "0") {
      fromTime = moment.utc(data.fromDate).startOf("day").valueOf() * 1000;
      toTime = moment.utc(data.toDate).startOf("day").valueOf() * 1000;
    } else {
      fromTime = moment.utc(moment().subtract(data.timeline, "days").format("YYYY-MM-DD")).startOf("day").valueOf() * 1000;
      toTime = moment.utc(moment().format("YYYY-MM-DD")).startOf("day").valueOf() * 1000;
    }

    const allHistoryData = [];
    const filterDevice = {
      limit: 100,
      offset: 0,
      thingId: [],
      status: "enabled",
      name: data.tempSensorTypeList[0],
      from: fromTime,
      to: toTime,
      publisher: "",
    };
    for (const device of data.uniqueDeviceList) {
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

    // Save the dashboard
    const selectedLayout = {
      height: 400,
      width: 500,
      left: 0,
      top: 0,
      order: 0,
      title: data.name,
      name: data.layout,
      imageUrl: "",
    };
    saveDashboard(data, selectedLayout, data.uniqueDeviceList);
  };

  const saveDashboard = async (inputData: any, selectedLayout: any, deviceList: any[]) => {
    try {
      const widgetData = convertToJson(inputData, selectedLayout, deviceList);
      const payload = editDashboard({
        id: id,
        name: dashboard.name,
        description: dashboard.description,
        layout: dashboard.layout,
        data: {
          widgets: [...dashboard.data.widgets, ...widgetData],
        },
      });
      await updateDashboard(userId, payload);
      toast.success("Widget saved successfully");
      navigate(`/dashboard/${id}/layout`);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const onClickSaveLayout = () => {
    const payload = getDashboard();
    updateDashboard(userId, payload)
      .then(() => toast.success("Layout saved successfully"))
      .catch((error: any) => toast.error(error.message));
  };

  return (
    <>
      <div className="card-header d-flex justify-content-between py-6 px-9">
        <div className="card-title"></div>
        <div className="card-toolbar">
          <button type="button" className="btn btn-light" onClick={() => window.history.back()}>
            <i className="bi bi-arrow-left"></i>
            Back
          </button>
          <button
            id="kt_widget_toggle"
            type="button"
            className="btn btn-primary mx-2"
            data-bs-toggle="tooltip"
            data-bs-placement="left"
            data-bs-dismiss="click"
            data-bs-trigger="hover"
          >
            <KTIcon iconName="plus" className="fs-2" />
            Add New Widget
          </button>
          <button type="button" className="btn btn-light-primary" onClick={onClickSaveLayout}>
            <KTIcon iconName="save" className="fs-2" />
            Save Layout
          </button>
        </div>
      </div>
      <KTCard className="h-1000px">
        <KTCardBody className="py-4">
          {dashboard?.data?.widgets?.map((widget: any, index: number) => (
            <WidgetItem
              key={index}
              widgetData={widget}
              dashboardData={dashboard}
              onSaveDashboard={(inputData: any, selectedLayout: any, deviceList: any[]) => saveDashboard(inputData, selectedLayout, deviceList)}
            />
          ))}
        </KTCardBody>
      </KTCard>
      <WidgetDrawer onGetPreviewWidget={(data) => refreshChart(data)} />
    </>
  );
};

export { LayoutBuilder };

const convertToJson = (inputData: any, selectedLayout: any, deviceList: any[]) => {
  return [
    {
      widgetId: `${inputData.layout}-${new Date().getTime()}`,
      layouts: {
        widgetType: inputData.layout,
        widgetSize: {
          width: selectedLayout.width,
          height: selectedLayout.height,
          minWidth: 500,
          minHeight: 400,
        },
        widgetPosition: {
          left: selectedLayout.left,
          top: selectedLayout.top,
          transform: "translateX(0px) translateY(0px)",
        },
        orderBy: selectedLayout.order,
      },
      metadata: {
        parameters: inputData.devices.map((device: any) => {
          if (device.deviceLabel === "thing") {
            return {
              type: device.deviceLabel,
              thing: device.deviceValue,
              thingName: device.deviceName,
              sensorType: device.sensorType,
            };
          } else {
            return {
              type: device.deviceLabel,
              channel: device.deviceValue,
              thing: deviceList
                .filter((deviceItem: any) => deviceItem.channelId === device.deviceValue)
                .map((deviceItem: any) => {
                  return {
                    thingId: deviceItem.thingId,
                    thingName: deviceItem.thingName,
                  };
                }),
              sensorType: device.sensorType,
            };
          }
        }),
        updateInterval: inputData.interval,
        timeline: inputData.timeline,
        fromDate: inputData.fromDate,
        toDate: inputData.toDate,
        aggregationType: "",
        title: inputData.name,
      },
    },
  ];
};
