import { useNavigate, useParams } from "react-router-dom";
import { KTCard, KTCardBody, KTIcon } from "../../../../../_metronic/helpers";
import { getDashboardById } from "../../api/DashboardHelper";

const ViewDashboard = () => {
  const navigate = useNavigate();
  const params = useParams();
  const id = params.id as string;
  const dashboard = getDashboardById(id);
  console.log("dashboard", dashboard);

  const redirectToLayout = () => {
    navigate(`/dashboard/${id}/layout`);
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
          <button type="button" className="btn btn-primary" onClick={redirectToLayout}>
            <KTIcon iconName="plus" className="fs-2" />
            Modify Layout
          </button>
        </div>
      </div>
      <KTCard>
        <KTCardBody className="py-4">
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
        </KTCardBody>
      </KTCard>
    </>
  );
};

export { ViewDashboard };
