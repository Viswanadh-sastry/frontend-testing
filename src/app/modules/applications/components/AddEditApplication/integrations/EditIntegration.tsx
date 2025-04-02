import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { useFormik } from "formik";
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { HeaderInputFields, KTCardBody } from "../../../../../../_metronic/helpers";
import { Integration } from "../../../api/_models";
import { getIntegration, updateIntegration } from "../../../api/IntegrationAPI";

const EditIntegration = () => {
  const navigate = useNavigate();
  const params = useParams();
  const id = params.id as string;
  const kind = (params.kind as string).toLowerCase();
  const integrationQuery = useQuery({
    queryKey: [`integration`, id],
    queryFn: async () => getIntegration({ applicationId: id, kind: kind }).catch((error) => toast.error(error?.response?.data?.message || "Something went wrong")),
    enabled: true,
  });
  const integration = useMemo(() => integrationQuery.data?.integration || {}, [integrationQuery.data]);
  const integrationSchema = Yup.object().shape({
    kind: Yup.string().required("Name is required"),
    encoding: Yup.string().required("Encoding is required"),
    eventEndpointUrl: Yup.string().required("Event Endpoint Url is required"),
    headers: Yup.object(),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      applicationId: integration.applicationId || "",
      kind: kind || "",
      encoding: integration.encoding || "",
      eventEndpointUrl: integration.eventEndpointUrl || "",
      headers: integration.headers || null,
    } as Integration,
    validationSchema: integrationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const data = {
        applicationId: values.applicationId,
        kind: values.kind,
        encoding: values.encoding,
        eventEndpointUrl: values.eventEndpointUrl,
        headers: values.headers,
      };
      updateIntegration(data)
        .then(() => {
          toast.success("Integration updated successfully");
          navigate(`/applications/${values.applicationId}/integrations`);
        })
        .catch((error) => toast.error(error?.response?.data?.message || "Something went wrong"))
        .finally(() => setSubmitting(false));
    },
  });

  const onCloseBackEditIntegration = () => {
    navigate(`/applications/${id}/integrations`);
  };

  return (
    <KTCardBody className="py-4">
      <form className="form" onSubmit={formik.handleSubmit} noValidate>
        <ul className="nav nav-tabs nav-line-tabs mb-5 fs-6">
          <li className="nav-item">
            <a className="nav-link active" data-bs-toggle="tab" href="#kt_tab_general">
              General
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" data-bs-toggle="tab" href="#kt_tab_headers">
              Headers
            </a>
          </li>
        </ul>
        <div className="tab-content" id="myTabContent">
          <div className="tab-pane fade show active" id="kt_tab_general" role="tabpanel">
            <div className="d-flex flex-column me-n7 pe-7">
              <div className="row">
                {/* Kind */}
                <div className="col-md-12">
                  <div className="fv-row mb-6">
                    <label className="required fw-bold fs-6 mb-2">Kind</label>
                    <select
                      {...formik.getFieldProps("kind")}
                      className={clsx(
                        "form-select form-select-lg",
                        { "is-invalid": formik.touched.kind && formik.errors.kind },
                        { "is-valid": formik.touched.kind && !formik.errors.kind }
                      )}
                      disabled
                    >
                      <option value="">Select Kind</option>
                      <option value="http">HTTP</option>
                      <option value="mqtt_global">MQTT_GLOBAL</option>
                    </select>
                    {formik.touched.kind && formik.errors.kind && (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">{formik.errors.kind}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="row">
                {/* Encoding */}
                <div className="col-md-12">
                  <div className="fv-row mb-6">
                    <label className="required fw-bold fs-6 mb-2">Encoding</label>
                    <select
                      {...formik.getFieldProps("encoding")}
                      className={clsx(
                        "form-select form-select-lg",
                        { "is-invalid": formik.touched.encoding && formik.errors.encoding },
                        { "is-valid": formik.touched.encoding && !formik.errors.encoding }
                      )}
                    >
                      <option value="">Select Encoding</option>
                      <option value="JSON">JSON</option>
                      <option value="PROTOBUF">Protobuf (binary)</option>
                    </select>
                    {formik.touched.encoding && formik.errors.encoding && (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">{formik.errors.encoding}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="row">
                {/* Event Endpoint Url */}
                <div className="col-md-12">
                  <div className="fv-row mb-6">
                    <label className="required fw-bold fs-6 mb-2">Event Endpoint Url</label>
                    <input
                      {...formik.getFieldProps("eventEndpointUrl")}
                      type="text"
                      className={clsx(
                        "form-control mb-3 mb-lg-0",
                        { "is-invalid": formik.touched.eventEndpointUrl && formik.errors.eventEndpointUrl },
                        { "is-valid": formik.touched.eventEndpointUrl && !formik.errors.eventEndpointUrl }
                      )}
                      placeholder="Enter event endpoint url"
                      autoComplete="off"
                    />
                    {formik.touched.eventEndpointUrl && formik.errors.eventEndpointUrl && (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">{formik.errors.eventEndpointUrl}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {formik.values.headers && (
            <div className="tab-pane fade" id="kt_tab_headers" role="tabpanel">
              <div className="d-flex flex-column me-n7 pe-7">
                <div className="row">
                  {/* Headers */}
                  <div className="col-md-12">
                    <div className="fv-row mb-6">
                      <label className="fw-bold fs-6 mb-2">Headers</label>
                      <HeaderInputFields headers={formik.values.headers} setHeaders={(headers: any) => formik.setFieldValue("headers", headers)} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* begin::Actions */}
        <div className="text-center pt-15">
          <button type="reset" onClick={onCloseBackEditIntegration} className="btn btn-light me-3" data-kt-subscription-modal-action="cancel" disabled={formik.isSubmitting}>
            Back
          </button>
          <button type="submit" className="btn btn-primary" disabled={formik.isSubmitting}>
            <span className="indicator-label">Submit</span>
          </button>
        </div>
        {/* end::Actions */}
      </form>
    </KTCardBody>
  );
};

export { EditIntegration };
