import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { useFormik } from "formik";
import moment from "moment";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { KTCardBody, TagInputFields, VariableInputFields } from "../../../../../../_metronic/helpers";
import { getLORAAuth } from "../../../../auth/core/LORAHelpers";
import { getDeviceProfile } from "../../../../device-profiles/api/DeviceProfileAPI";
import { Device } from "../../../api/_models";
import { createKeysById, deleteKeysById, getDeviceById, getKeysById, getLinkMetrics, updateDevice } from "../../../api/DeviceAPI";
import { LinkMetrics } from "./LinkMetrics";

const EditDevice = () => {
  const navigate = useNavigate();
  const params = useParams();
  const id = params.id as string;
  const [groupName, setGroupName] = useState<string>("24h");
  const filterDeviceProfile = {
    limit: 10,
    offset: 0,
    tenantId: getLORAAuth()?.tenant_id || "",
  };
  const deviceProfileListQuery = useQuery({
    queryKey: [`deviceProfileList`, filterDeviceProfile],
    queryFn: async () => getDeviceProfile(filterDeviceProfile).catch((error) => toast.error(error?.response?.data?.message || "Something went wrong")),
    enabled: true,
  });
  const deviceProfileData = useMemo(() => deviceProfileListQuery.data?.result || [], [deviceProfileListQuery.data]);
  const keyDeviceQuery = useQuery({
    queryKey: [`keyDevice`, id],
    queryFn: async () => getKeysById(id).catch((error) => toast.error(error?.response?.data?.message || "Something went wrong")),
    enabled: true,
  });
  const keys = useMemo(() => keyDeviceQuery.data?.deviceKeys || {}, [keyDeviceQuery.data]);
  const deviceQuery = useQuery({
    queryKey: [`device`, id],
    queryFn: async () => getDeviceById(id).catch((error) => toast.error(error?.response?.data?.message || "Something went wrong")),
    enabled: true,
  });
  const device = useMemo(() => deviceQuery.data?.device || {}, [deviceQuery.data]);
  const [filterLinkMetrics, setFilterLinkMetrics] = useState({
    start: moment().subtract(1, "days").toISOString(),
    end: moment().toISOString(),
    aggregation: "HOUR",
  });
  const linkMetrics = useQuery({
    queryKey: [`linkMetrics`, id, filterLinkMetrics],
    queryFn: async () => getLinkMetrics(id, filterLinkMetrics).catch((error) => toast.error(error?.response?.data?.message || "Something went wrong")),
    enabled: true,
  });
  const metrics = useMemo(() => linkMetrics.data || null, [linkMetrics.data]);

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
    nwkKey: Yup.string(),
  });
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      applicationId: device?.applicationId || "",
      devEui: device?.devEui || "",
      name: device?.name || "",
      description: device?.description || "",
      deviceProfileId: device?.deviceProfileId || "",
      skipFcntCheck: device?.skipFcntCheck || false,
      isDisabled: device?.isDisabled || false,
      tags: device?.tags || null,
      variables: device?.variables || null,
      nwkKey: keys.nwkKey || "",
    } as Device,
    validationSchema: deviceSchema,
    onSubmit: async (values, { setSubmitting }) => {
      // if keys tab is active
      if ((document.querySelector("#lnkKeys.nav-link.active")?.textContent?.trim() ?? "") === "OTAA Keys") {
        if (!values.nwkKey) {
          toast.warn("Network key is required");
          setSubmitting(false);
          return;
        }
        const data = {
          deviceKeys: {
            nwkKey: values.nwkKey,
          },
        };
        if (!keys.nwkKey) {
          createKeysById(String(values.devEui), data)
            .then(() => {
              toast.success("Keys created successfully");
            })
            .catch((error) => toast.error(error?.response?.data?.message || "Something went wrong"))
            .finally(() => setSubmitting(false));
        } else {
          deleteKeysById(String(values.devEui)).catch((error) => toast.error(error?.response?.data?.message || "Something went wrong"));
          createKeysById(String(values.devEui), data)
            .then(() => {
              toast.success("Keys updated successfully");
            })
            .catch((error) => toast.error(error?.response?.data?.message || "Something went wrong"))
            .finally(() => setSubmitting(false));
        }
        return;
      }
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
      updateDevice(String(values.devEui), data)
        .then(() => {
          toast.success("Device updated successfully");
          navigate(`/applications/${values.applicationId}/devices`);
        })
        .catch((error) => toast.error(error?.response?.data?.message || "Something went wrong"))
        .finally(() => setSubmitting(false));
    },
  });

  const onCloseBackEditDevice = () => {
    navigate(`/applications/${formik.values.applicationId}/devices`);
  };

  const onClickDuration = (duration: string) => {
    setGroupName(duration);
    if (duration === "24h") {
      setFilterLinkMetrics({
        start: moment().subtract(1, "days").toISOString(),
        end: moment().toISOString(),
        aggregation: "HOUR",
      });
    } else if (duration === "31d") {
      setFilterLinkMetrics({
        start: moment().subtract(31, "days").toISOString(),
        end: moment().toISOString(),
        aggregation: "DAY",
      });
    } else if (duration === "1y") {
      setFilterLinkMetrics({
        start: moment().subtract(1, "years").toISOString(),
        end: moment().toISOString(),
        aggregation: "MONTH",
      });
    }
  };

  return (
    <KTCardBody className="py-4">
      <form className="form" onSubmit={formik.handleSubmit} noValidate>
        <ul className="nav nav-tabs nav-line-tabs mb-5 fs-6">
          <li className="nav-item">
            <a className="nav-link active" data-bs-toggle="tab" href="#kt_tab_dashboard">
              Dashboard
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" data-bs-toggle="tab" href="#kt_tab_general">
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
          <li className="nav-item">
            <a id="lnkKeys" className="nav-link" data-bs-toggle="tab" href="#kt_tab_otaa_keys">
              OTAA Keys
            </a>
          </li>
        </ul>
        <div className="tab-content" id="myTabContent">
          <div className="tab-pane fade show active" id="kt_tab_dashboard" role="tabpanel">
            {metrics && (
              <div className="d-flex flex-column me-n7 pe-7">
                <div className="row mb-5">
                  <div className="btn-toolbar justify-content-between" role="toolbar" aria-label="Metrics with button groups">
                    <div></div>
                    <div className="btn-group" role="group" aria-label="Metrics group">
                      <input
                        type="radio"
                        className="btn-check"
                        name="btnradio"
                        id="btn24h"
                        autoComplete="off"
                        checked={groupName === "24h"}
                        onClick={() => onClickDuration("24h")}
                      />
                      <label className={`btn ${groupName === "24h" ? "btn-primary" : "btn-outline-primary"}`} htmlFor="btn24h">
                        24h
                      </label>

                      <input
                        type="radio"
                        className="btn-check"
                        name="btnradio"
                        id="btn31d"
                        autoComplete="off"
                        checked={groupName === "31d"}
                        onClick={() => onClickDuration("31d")}
                      />
                      <label className={`btn ${groupName === "31d" ? "btn-primary" : "btn-outline-primary"}`} htmlFor="btn31d">
                        31d
                      </label>

                      <input type="radio" className="btn-check" name="btnradio" id="btn1y" autoComplete="off" checked={groupName === "1y"} onClick={() => onClickDuration("1y")} />
                      <label className={`btn ${groupName === "1y" ? "btn-primary" : "btn-outline-primary"}`} htmlFor="btn1y">
                        1y
                      </label>
                    </div>
                  </div>
                </div>
                <div className="row mb-5">
                  {/* Errors */}
                  <div className="col-md-6">
                    <div className="card">
                      <div className="card-header border-0">
                        <h3 className="card-title fw-bolder text-dark">Errors</h3>
                      </div>
                      <LinkMetrics layout="line" metricName="errors" groupName={groupName} widgetData={metrics.errors} />
                    </div>
                  </div>
                  {/* RSSI */}
                  <div className="col-md-6">
                    <div className="card">
                      <div className="card-header border-0">
                        <h3 className="card-title fw-bolder text-dark">RSSI</h3>
                      </div>
                      <LinkMetrics layout="line" metricName="rssi" groupName={groupName} widgetData={metrics.gwRssi} />
                    </div>
                  </div>
                </div>
                <div className="row mb-5">
                  {/* SNR */}
                  <div className="col-md-6">
                    <div className="card">
                      <div className="card-header border-0">
                        <h3 className="card-title fw-bolder text-dark">SNR</h3>
                      </div>
                      <LinkMetrics layout="line" metricName="snr" groupName={groupName} widgetData={metrics.gwSnr} />
                    </div>
                  </div>
                  {/* Received */}
                  <div className="col-md-6">
                    <div className="card">
                      <div className="card-header border-0">
                        <h3 className="card-title fw-bolder text-dark">Received</h3>
                      </div>
                      <LinkMetrics layout="line" metricName="received" groupName={groupName} widgetData={metrics.rxPackets} />
                    </div>
                  </div>
                </div>
                <div className="row">
                  {/* Received / DR */}
                  <div className="col-md-6">
                    <div className="card">
                      <div className="card-header border-0">
                        <h3 className="card-title fw-bolder text-dark">Received / DR</h3>
                      </div>
                      <LinkMetrics layout="line" metricName="received_dr" groupName={groupName} widgetData={metrics.rxPacketsPerDr} />
                    </div>
                  </div>
                  {/* Received / frequency */}
                  <div className="col-md-6">
                    <div className="card">
                      <div className="card-header border-0">
                        <h3 className="card-title fw-bolder text-dark">Received / frequency</h3>
                      </div>
                      <LinkMetrics layout="line" metricName="received_frequency" groupName={groupName} widgetData={metrics.rxPacketsPerFreq} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="tab-pane fade" id="kt_tab_general" role="tabpanel">
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
          {formik.values.tags && (
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
          )}
          {formik.values.variables && (
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
          )}
          <div className="tab-pane fade" id="kt_tab_otaa_keys" role="tabpanel">
            <div className="d-flex flex-column me-n7 pe-7">
              <div className="row">
                {/* NwkKey */}
                <div className="col-md-6">
                  <div className="fv-row mb-6">
                    <label className="required fw-bold fs-6 mb-2">Network key</label>
                    <input
                      type="text"
                      {...formik.getFieldProps("nwkKey")}
                      className={clsx(
                        "form-control mb-3 mb-lg-0",
                        { "is-invalid": formik.touched.nwkKey && formik.errors.nwkKey },
                        { "is-valid": formik.touched.nwkKey && !formik.errors.nwkKey }
                      )}
                      placeholder="Enter network key"
                      autoComplete="off"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* begin::Actions */}
        <div className="text-center pt-15">
          <button type="reset" onClick={onCloseBackEditDevice} className="btn btn-light me-3" data-kt-subscription-modal-action="cancel" disabled={formik.isSubmitting}>
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

export { EditDevice };
