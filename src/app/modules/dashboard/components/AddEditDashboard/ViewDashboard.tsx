import { useState } from "react";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { useNavigate, useParams } from "react-router-dom";
import { KTCardBody, KTIcon } from "../../../../../_metronic/helpers";
import { getDashboardById } from "../../api/DashboardHelper";
import { WidgetPreviewItem } from "./Widget/WidgetPreviewItem";

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
      <FullScreen handle={handle}>
        <div className="card" style={{ width: "1920px", height: "1080px" }}>
          <KTCardBody className="py-4">
            {dashboard?.data?.widgets?.map((widget: any, index: number) => (
              <WidgetPreviewItem key={index} widgetData={widget} />
            ))}
          </KTCardBody>
        </div>
      </FullScreen>
    </>
  );
};

export { ViewDashboard };
