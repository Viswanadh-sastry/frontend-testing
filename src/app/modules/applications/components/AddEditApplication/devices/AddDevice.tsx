import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { useFormik } from "formik";
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { KTCardBody, TagInputFields, VariableInputFields } from "../../../../../../_metronic/helpers";
import { getLORAAuth } from "../../../../auth/core/LORAHelpers";
import { getDeviceProfile } from "../../../../device-profiles/api/DeviceProfileAPI";
import { Device } from "../../../api/_models";
import { addDevice } from "../../../api/DeviceAPI";

const AddDevice = () => {
  const navigate = useNavigate();
  const params = useParams();
  const id = params.id as string;
  const filterDeviceProfile = {
    limit: 10,
    offset: 0,
    tenantId: getLORAAuth()?.tenant_id || "",
  };
  const deviceProfileListQuery = useQuery({
    queryKey: [`deviceProfileList`, filterDeviceProfile],
    queryFn: async () => getDeviceProfile(filterDeviceProfile),
    enabled: true,
  });
  const deviceProfileData = useMemo(() => deviceProfileListQuery.data?.result || [], [deviceProfileListQuery.data]);
  const eui64Regex = /^(?:[0-9A-Fa-f]{2}([-:])?){7}[0-9A-Fa-f]{2}$/;
  const deviceSchema = Yup.object().shape({
    devEui: Yup.string().required("Device EUI is required").matches(eui64Regex, "Invalid EUI64 format"),
    name: Yup.string().required("Name is required"),
    description: Yup.string(),
    deviceProfileId: Yup.string().required("Device Profile is required"),
    skipFcntCheck: Yup.boolean(),
    isDisabled: Yup.boolean(),
    tags: Yup.object(),
    variables: Yup.object(),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      applicationId: id,
      devEui: "",
      name: "",
      description: "",
      deviceProfileId: "",
      skipFcntCheck: false,
      isDisabled: false,
      tags: {},
      variables: {},
    } as Device,
    validationSchema: deviceSchema,
    onSubmit: async (values, { setSubmitting }) => {
      // if (!values.variables || Object.keys(values.variables).length === 0) {
      //   toast.error("Variables is required");
      //   setSubmitting(false);
      //   return;
      // }
      const data = {
        device: {
          applicationId: values.applicationId,
          devEui: values.devEui,
          name: values.name,
          description: values.description,
          deviceProfileId: values.deviceProfileId,
          skipFcntCheck: values.skipFcntCheck,
          isDisabled: values.isDisabled,
          tags: values.tags,
          variables: values.variables,
        },
      };
      addDevice(data)
        .then(() => {
          toast.success("Device created successfully");
          navigate(`/applications/${values.applicationId}/devices`);
        })
        .catch((error) => toast.error(error.message))
        .finally(() => setSubmitting(false));
    },
  });

  const onCloseBackAddDevice = () => {
    navigate(`/applications/${formik.values.applicationId}/devices`);
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
            <a className="nav-link" data-bs-toggle="tab" href="#kt_tab_tags">
              Tags
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" data-bs-toggle="tab" href="#kt_tab_variables">
              Variables
            </a>
          </li>
        </ul>
        <div className="tab-content" id="myTabContent">
          <div className="tab-pane fade show active" id="kt_tab_general" role="tabpanel">
            <div className="d-flex flex-column me-n7 pe-7">
              <div className="row">
                {/* Name */}
                <div className="col-md-12">
                  <div className="fv-row mb-6">
                    <label className="required fw-bold fs-6 mb-2">Name</label>
                    <input
                      {...formik.getFieldProps("name")}
                      type="text"
                      name="name"
                      placeholder="Enter name"
                      className={clsx(
                        "form-control mb-3 mb-lg-0",
                        { "is-invalid": formik.touched.name && formik.errors.name },
                        { "is-valid": formik.touched.name && !formik.errors.name }
                      )}
                      autoComplete="off"
                    />
                    {formik.touched.name && formik.errors.name && (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">
                          <span role="alert">{formik.errors.name}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="row">
                {/* Description */}
                <div className="col-md-12">
                  <div className="fv-row mb-6">
                    <label className="fw-bold fs-6 mb-2">Description</label>
                    <textarea
                      {...formik.getFieldProps("description")}
                      className={clsx(
                        "form-control mb-3 mb-lg-0",
                        { "is-invalid": formik.touched.description && formik.errors.description },
                        { "is-valid": formik.touched.description && !formik.errors.description }
                      )}
                      placeholder="Enter description"
                      autoComplete="off"
                      rows={3}
                    ></textarea>
                  </div>
                </div>
              </div>
              <div className="row">
                {/* Device EUI */}
                <div className="col-md-6">
                  <div className="fv-row mb-6">
                    <label className="required fw-bold fs-6 mb-2">Device EUI (EUI64)</label>
                    <input
                      {...formik.getFieldProps("devEui")}
                      type="text"
                      name="devEui"
                      placeholder="Enter device EUI"
                      className={clsx(
                        "form-control mb-3 mb-lg-0",
                        { "is-invalid": formik.touched.devEui && formik.errors.devEui },
                        { "is-valid": formik.touched.devEui && !formik.errors.devEui }
                      )}
                      aria-describedby="basic-addon3"
                      autoComplete="off"
                    />
                    {formik.touched.devEui && formik.errors.devEui && (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">
                          <span role="alert">{formik.errors.devEui}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {/* Device Profile */}
                <div className="col-md-6">
                  <div className="fv-row mb-6">
                    <label className="required fw-bold fs-6 mb-2">Device Profile</label>
                    <select
                      {...formik.getFieldProps("deviceProfileId")}
                      className={clsx(
                        "form-select form-select form-select-lg",
                        { "is-invalid": formik.touched.deviceProfileId && formik.errors.deviceProfileId },
                        { "is-valid": formik.touched.deviceProfileId && !formik.errors.deviceProfileId }
                      )}
                    >
                      <option value="">Select a device profile</option>
                      {deviceProfileData.map((deviceProfile: any) => (
                        <option key={deviceProfile.id} value={deviceProfile.id}>
                          {deviceProfile.name}
                        </option>
                      ))}
                    </select>
                    {formik.touched.deviceProfileId && formik.errors.deviceProfileId && (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">
                          <span role="alert">{formik.errors.deviceProfileId}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="row">
                {/* Disable frame-counter validation */}
                <div className="col-md-6">
                  <div className="fv-row mb-6">
                    <label className="fw-bold fs-6 mb-2">Disable frame-counter validation</label>
                    <label className="form-check form-switch form-check-custom form-check-solid">
                      <input type="checkbox" {...formik.getFieldProps("skipFcntCheck")} checked={formik.values.skipFcntCheck} className="form-check-input" />
                      <span className="form-check-label fw-bold text-muted">Disable frame-counter validation</span>
                    </label>
                  </div>
                </div>
                {/* Device is disabled */}
                <div className="col-md-6">
                  <div className="fv-row mb-6">
                    <label className="fw-bold fs-6 mb-2">Device is disabled</label>
                    <label className="form-check form-switch form-check-custom form-check-solid">
                      <input type="checkbox" {...formik.getFieldProps("isDisabled")} checked={formik.values.isDisabled} className="form-check-input" />
                      <span className="form-check-label fw-bold text-muted">Device is disabled</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="tab-pane fade" id="kt_tab_tags" role="tabpanel">
            <div className="d-flex flex-column me-n7 pe-7">
              <div className="row">
                {/* Tags */}
                <div className="col-md-12">
                  <div className="fv-row mb-6">
                    <label className="fw-bold fs-6 mb-2">Tags</label>
                    <TagInputFields tags={formik.values.tags} setTags={(tags: any) => formik.setFieldValue("tags", tags)} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="tab-pane fade" id="kt_tab_variables" role="tabpanel">
            <div className="d-flex flex-column me-n7 pe-7">
              <div className="row">
                {/* Variables */}
                <div className="col-md-12">
                  <div className="fv-row mb-6">
                    <label className="fw-bold fs-6 mb-2">Variables</label>
                    <VariableInputFields variables={formik.values.variables} setVariables={(variables: any) => formik.setFieldValue("variables", variables)} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* begin::Actions */}
        <div className="text-center pt-15">
          <button type="reset" onClick={onCloseBackAddDevice} className="btn btn-light me-3" data-kt-subscription-modal-action="cancel" disabled={formik.isSubmitting}>
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

export { AddDevice };
