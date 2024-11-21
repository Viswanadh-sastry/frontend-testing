import { useState } from "react";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { KTCardBody, KTIcon } from "../../../../../_metronic/helpers";
import { useAuth } from "../../../auth";
import { updateDashboard } from "../../api/DashboardAPI";
import { deleteWidgetById, editDashboard, getDashboard, getDashboardById, updateWidgetById } from "../../api/DashboardHelper";
import { EditView } from "./Widget/EditView";
import { WidgetDrawer } from "./Widget/WidgetDrawer";
import { WidgetItem } from "./Widget/WidgetItem";
import { ViewSensor } from "./Widget/ViewSensor";

const LayoutBuilder = () => {
  const { currentUser } = useAuth();
  const { id: userId } = currentUser || { id: "" };
  const handle = useFullScreenHandle();
  const params = useParams();
  const id = params.id as string;
  const [dashboard, setDashboard] = useState<any>(getDashboardById(id));
  const [editWidget, setEditWidget] = useState({
    open: false,
    data: null,
  });

  const refreshSensor = async (data: any) => {
    // Save the dashboard
    const selectedLayout = {
      height:
        data.layout === "SquareCard"
          ? 300
          : data.layout === "RectangleCard"
          ? 200
          : data.layout === "VerticalCard"
          ? 450
          : data.layout === "HorizontalCard"
          ? 200
          : data.layout === "TableCard"
          ? 330
          : 400,
      width:
        data.layout === "SquareCard"
          ? 300
          : data.layout === "RectangleCard"
          ? 500
          : data.layout === "VerticalCard"
          ? 200
          : data.layout === "HorizontalCard"
          ? 450
          : data.layout === "TableCard"
          ? 300
          : 500,
      left: 0,
      top: 0,
      order: 0,
      title: data.name,
      name: data.layout,
      imageUrl: "",
    };
    saveDashboard(data, selectedLayout, data.uniqueDeviceList);
  };

  const refreshChart = async (data: any) => {
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
      setDashboard(getDashboardById(id));
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

  const onOpenWidget = (data: any) => {
    const layout = data.layouts;
    const metadata = data.metadata;
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
    const payload: any = {
      id: data.widgetId,
      name: metadata.title,
      devices: devices,
      timeline: metadata.timeline,
      fromDate: metadata.fromDate,
      toDate: metadata.toDate,
      interval: metadata.updateInterval,
      aggregationType: metadata.aggregationType,
      layout: layout.widgetType,
      uniqueDeviceList: [],
      tempSensorTypeList: [],
    };
    setEditWidget({ open: true, data: payload });
  };

  const onCloseWidget = () => {
    setEditWidget({ open: false, data: null });
  };

  const onSaveWidget = (data: any) => {
    const widgetData = updateToMetadata(data, data.uniqueDeviceList);
    const payload = updateWidgetById(id, widgetData);
    updateDashboard(userId, payload)
      .then(() => {
        toast.success("Widget updated successfully");
        setEditWidget({ open: false, data: null });
        setDashboard(getDashboardById(id));
      })
      .catch((error: any) => toast.error(error.message));
  };

  const onRemoveWidget = (widgetId: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Are you sure you want to delete this record?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      customClass: {
        confirmButton: "btn btn-danger",
        cancelButton: "btn btn-secondary",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const payload = deleteWidgetById(id, widgetId);
        updateDashboard(userId, payload)
          .then(() => {
            toast.success("Widget removed successfully");
            setDashboard(getDashboardById(id));
          })
          .catch((error: any) => toast.error(error.message));
      }
    });
  };

  return (
    <>
      <div className="card-header d-flex justify-content-between py-6 px-9">
        <div className="card-title"></div>
        <div className="card-toolbar">
          <button type="button" className="btn btn-light mx-2" onClick={() => window.history.back()}>
            <i className="bi bi-arrow-left"></i>
            Back
          </button>
          <button type="button" className="btn btn-light-primary" onClick={handle.enter}>
            <KTIcon iconName="maximize" className="fs-2" />
            Full Screen
          </button>
          <button type="button" className="btn btn-light-primary mx-2" onClick={onClickSaveLayout}>
            <KTIcon iconName="save-2" className="fs-2" />
            Save Layout
          </button>
          <button id="kt_widget_toggle" type="button" className="btn btn-primary" data-bs-toggle="tooltip" data-bs-placement="left" data-bs-dismiss="click" data-bs-trigger="hover">
            <KTIcon iconName="plus" className="fs-2" />
            Add New Widget
          </button>
        </div>
      </div>
      <div className="card" style={{ width: "100%", overflowX: "auto" }}>
        <FullScreen handle={handle}>
          <div
            className="card"
            style={{
              width: "1920px",
              height: "1080px",
              background: `
            linear-gradient(-90deg, rgba(0, 0, 0, .04) 1px, transparent 1px),
            linear-gradient(rgba(0, 0, 0, .04) 1px, transparent 1px),
            #f2f2f2
          `,
              backgroundSize: `
            12px 12px,
            12px 12px,
            80px 80px,
            80px 80px,
            80px 80px,
            80px 80px,
            80px 80px,
            80px 80px
          `,
              backgroundColor: "#f2f2f2",
            }}
          >
            <KTCardBody className="py-4">
              {dashboard?.data?.widgets?.map((widget: any, index: number) =>
                widget.layouts.widgetType === "SquareCard" ||
                widget.layouts.widgetType === "RectangleCard" ||
                widget.layouts.widgetType === "VerticalCard" ||
                widget.layouts.widgetType === "HorizontalCard" ||
                widget.layouts.widgetType === "TableCard" ||
                widget.layouts.widgetType === "HorizontalLineCard" ? (
                  <ViewSensor key={index} widgetData={widget} editWidget={(data) => onOpenWidget(data)} removeWidget={(id) => onRemoveWidget(id)} />
                ) : (
                  <WidgetItem key={index} widgetData={widget} editWidget={(data) => onOpenWidget(data)} removeWidget={(id) => onRemoveWidget(id)} />
                )
              )}
            </KTCardBody>
          </div>
          {editWidget.open && <EditView inputData={editWidget.data} onEditView={(data) => onSaveWidget(data)} onClose={onCloseWidget} />}
        </FullScreen>
      </div>
      <WidgetDrawer onGetChartWidget={(data) => refreshChart(data)} onGetSensorWidget={(data) => refreshSensor(data)} />
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
        aggregationType: inputData.aggregationType,
        timeline: inputData.timeline,
        fromDate: inputData.fromDate,
        toDate: inputData.toDate,
        title: inputData.name,
      },
    },
  ];
};

const updateToMetadata = (inputData: any, deviceList: any[]) => ({
  widgetId: inputData.id,
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
    aggregationType: inputData.aggregationType,
    timeline: inputData.timeline,
    fromDate: inputData.fromDate,
    toDate: inputData.toDate,
    title: inputData.name,
  },
});
