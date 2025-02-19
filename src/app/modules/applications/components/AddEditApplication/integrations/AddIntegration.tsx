import clsx from "clsx";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { HeaderInputFields, KTCardBody } from "../../../../../../_metronic/helpers";
import { Integration } from "../../../api/_models";
import { addIntegration } from "../../../api/IntegrationAPI";

const AddIntegration = () => {
  const navigate = useNavigate();
  const params = useParams();
  const id = params.id as string;
  const integrationSchema = Yup.object().shape({
    kind: Yup.string().required("Name is required"),
    encoding: Yup.string().required("Encoding is required"),
    eventEndpointUrl: Yup.string().required("Event Endpoint Url is required"),
    headers: Yup.object(),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      applicationId: id,
      kind: "",
      encoding: "",
      eventEndpointUrl: "",
      headers: {},
    } as Integration,
    validationSchema: integrationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const data = {
        integration: {
          applicationId: values.applicationId,
          kind: values.kind,
          encoding: values.encoding,
          eventEndpointUrl: values.eventEndpointUrl,
          headers: values.headers,
        },
      };
      addIntegration(data)
        .then(() => {
          toast.success("Integration created successfully");
          navigate(`/applications/${values.applicationId}/integrations`);
        })
        .catch((error) => toast.error(error.message))
        .finally(() => setSubmitting(false));
    },
  });

  const onCloseBackAddIntegration = () => {
    navigate(`/applications/${formik.values.applicationId}/integrations`);
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
                    <input
                      {...formik.getFieldProps("kind")}
                      type="text"
                      className={clsx(
                        "form-control mb-3 mb-lg-0",
                        { "is-invalid": formik.touched.kind && formik.errors.kind },
                        { "is-valid": formik.touched.kind && !formik.errors.kind }
                      )}
                      placeholder="Enter kind"
                      autoComplete="off"
                    />
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
                    <input
                      {...formik.getFieldProps("encoding")}
                      type="text"
                      className={clsx(
                        "form-control mb-3 mb-lg-0",
                        { "is-invalid": formik.touched.encoding && formik.errors.encoding },
                        { "is-valid": formik.touched.encoding && !formik.errors.encoding }
                      )}
                      placeholder="Enter encoding"
                      autoComplete="off"
                    />
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
        </div>

        {/* begin::Actions */}
        <div className="text-center pt-15">
          <button type="reset" onClick={onCloseBackAddIntegration} className="btn btn-light me-3" data-kt-subscription-modal-action="cancel" disabled={formik.isSubmitting}>
            Back
          </button>
          <button type="submit" className="btn btn-primary">
            <span className="indicator-label">Submit</span>
          </button>
        </div>
        {/* end::Actions */}
      </form>
    </KTCardBody>
  );
};

export { AddIntegration };
