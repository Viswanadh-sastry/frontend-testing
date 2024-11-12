import { useState } from "react";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { useNavigate, useParams } from "react-router-dom";
import { KTCardBody, KTIcon } from "../../../../../_metronic/helpers";
import { getDashboardById } from "../../api/DashboardHelper";
import { WidgetPreviewItem } from "./Widget/WidgetPreviewItem";
import { SensorPreviewItem } from "./Widget/SensorPreviewItem";

const ViewDashboard = () => {
  const navigate = useNavigate();
  const params = useParams();
  const id = params.id as string;
  const [dashboard] = useState<any>(getDashboardById(id));
  const handle = useFullScreenHandle();

  const redirectToLayout = () => {
    navigate(`/dashboard/${id}/layout`);
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
          <button type="button" className="btn btn-light-primary mx-2" onClick={handle.enter}>
            <KTIcon iconName="maximize" className="fs-2" />
            Full Screen
          </button>
          <button type="button" className="btn btn-primary" onClick={redirectToLayout}>
            <KTIcon iconName="pencil" className="fs-2" />
            Modify Layout
          </button>
        </div>
      </div>
      <div className="card" style={{ width: "100%", overflowX: "auto" }}>
        <FullScreen handle={handle}>
          <div className="card" style={{ width: "1920px", height: "1080px" }}>
            <KTCardBody className="py-4">
              {dashboard?.data?.widgets?.map((widget: any, index: number) =>
                widget.layouts.widgetType === "SquareCard" ||
                widget.layouts.widgetType === "RectangleCard" ||
                widget.layouts.widgetType === "VerticalCard" ||
                widget.layouts.widgetType === "HorizontalCard" ||
                widget.layouts.widgetType === "TableCard" ||
                widget.layouts.widgetType === "HorizontalLineCard" ? (
                  <SensorPreviewItem key={index} widgetData={widget} />
                ) : (
                  <WidgetPreviewItem key={index} widgetData={widget} />
                )
              )}
            </KTCardBody>
          </div>
        </FullScreen>
      </div>
    </>
  );
};

export { ViewDashboard };
