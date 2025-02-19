import { Navigate, NavLink, Route, Routes, useParams } from "react-router-dom";
import { KTCard, KTCardBody } from "../../../../../_metronic/helpers";

import { ApplicationConfiguration } from "./ApplicationConfiguration";
import { AddDevice } from "./devices/AddDevice";
import { DeviceTable } from "./devices/DeviceTable";
import { EditDevice } from "./devices/EditDevice";
import { IntegrationTable } from "./integrations/IntegrationTable";
import { AddIntegration } from "./integrations/AddIntegration";
import { EditIntegration } from "./integrations/EditIntegration";

const EditApplication = () => {
  const params = useParams();
  const id = params.id as string;
  return (
    <KTCard>
      <KTCardBody className="py-4">
        <ul className="nav nav-tabs nav-line-tabs mb-5 fs-6">
          <li className="nav-item">
            <NavLink className="nav-link" to={`/applications/${id}/overview`}>
              Overview
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to={`/applications/${id}/devices`}>
              Devices
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to={`/applications/${id}/integrations`}>
              Integrations
            </NavLink>
          </li>
        </ul>
        <div className="tab-content" id="myTabContent">
          <Routes>
            <Route path="/" element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<ApplicationConfiguration />} />
            <Route path="devices" element={<DeviceTable />} />
            <Route path="devices/add" element={<AddDevice />} />
            <Route path="devices/:id" element={<EditDevice />} />
            <Route path="integrations" element={<IntegrationTable />} />
            <Route path="integrations/add" element={<AddIntegration />} />
            <Route path="integrations/:kind" element={<EditIntegration />} />
          </Routes>
        </div>
      </KTCardBody>
    </KTCard>
  );
};

export { EditApplication };
