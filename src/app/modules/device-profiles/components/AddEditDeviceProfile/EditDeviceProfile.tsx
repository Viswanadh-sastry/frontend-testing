import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { useFormik } from "formik";
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { KTCard, KTCardBody, TagInputFields } from "../../../../../_metronic/helpers";
import { DeviceProfile } from "../../api/_models";
import { getDeviceProfileById, updateDeviceProfile } from "../../api/DeviceProfileAPI";

const EditDeviceProfile = () => {
  const navigate = useNavigate();
  const params = useParams();
  const id = params.id as string;
  const deviceProfileQuery = useQuery({
    queryKey: [`deviceProfile`, id],
    queryFn: async () => getDeviceProfileById(id).catch((error) => toast.error(error.message)),
    enabled: true,
  });
  const deviceProfile = useMemo(() => deviceProfileQuery.data?.deviceProfile || {}, [deviceProfileQuery.data]);
  const deviceProfileSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    description: Yup.string(),
    region: Yup.string().required("Region is required"),
    macVersion: Yup.string().required("Mac version is required"),
    regParamsRevision: Yup.string().required("Reg params revision is required"),
    adrAlgorithmId: Yup.string().required("Adr algorithm id is required"),
    payloadCodecRuntime: Yup.string(),
    payloadCodecScript: Yup.string(),
    flushQueueOnActivate: Yup.boolean(),
    uplinkInterval: Yup.number().required("Uplink interval is required"),
    deviceStatusReqInterval: Yup.number(),
    supportsOtaa: Yup.boolean(),
    tags: Yup.object(),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      tenantId: deviceProfile?.tenantId || "",
      id: deviceProfile?.id || "",
      name: deviceProfile?.name || "",
      description: deviceProfile?.description || "",
      region: deviceProfile?.region || "EU868",
      macVersion: deviceProfile?.macVersion || "LORAWAN_1_0_3",
      regParamsRevision: deviceProfile?.regParamsRevision || "A",
      adrAlgorithmId: deviceProfile?.adrAlgorithmId || "Default ADR algorithm (LoRa only)",
      payloadCodecRuntime: deviceProfile?.payloadCodecRuntime || "None",
      payloadCodecScript: deviceProfile?.payloadCodecScript || "",
      flushQueueOnActivate: deviceProfile?.flushQueueOnActivate || false,
      uplinkInterval: deviceProfile?.uplinkInterval || 3600,
      deviceStatusReqInterval: deviceProfile?.deviceStatusReqInterval || 1,
      supportsOtaa: deviceProfile?.supportsOtaa || false,
      tags: deviceProfile?.tags || null,
    } as DeviceProfile,
    validationSchema: deviceProfileSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const data = {
        deviceProfile: {
          tenantId: values.tenantId,
          name: values.name,
          description: values.description,
          region: values.region,
          macVersion: values.macVersion,
          regParamsRevision: values.regParamsRevision,
          adrAlgorithmId: values.adrAlgorithmId,
          payloadCodecRuntime: values.payloadCodecRuntime,
          payloadCodecScript: values.payloadCodecScript,
          flushQueueOnActivate: values.flushQueueOnActivate,
          uplinkInterval: values.uplinkInterval,
          deviceStatusReqInterval: values.deviceStatusReqInterval,
          supportsOtaa: values.supportsOtaa,
          tags: values.tags,
        },
      };
      updateDeviceProfile(String(values.id), data)
        .then(() => {
          toast.success("Device Profile updated successfully");
          navigate("/device-profiles");
        })
        .catch((error) => toast.error(error.message))
        .finally(() => setSubmitting(false));
    },
  });

  const onCloseBackEditDeviceProfile = () => {
    navigate("/device-profiles");
  };

  return (
    <KTCard>
      <KTCardBody className="py-4">
        <form className="form" onSubmit={formik.handleSubmit} noValidate>
          <ul className="nav nav-tabs nav-line-tabs mb-5 fs-6">
            <li className="nav-item">
              <a className="nav-link active" data-bs-toggle="tab" href="#kt_tab_general">
                General
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" data-bs-toggle="tab" href="#kt_tab_join">
                Join (OTAA / ABP)
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" data-bs-toggle="tab" href="#kt_tab_codec">
                Codec
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" data-bs-toggle="tab" href="#kt_tab_tags">
                Tags
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
                  {/* Region */}
                  <div className="col-md-6">
                    <div className="fv-row mb-6">
                      <label className="required fw-bold fs-6 mb-2">Region</label>
                      <select
                        {...formik.getFieldProps("region")}
                        className={clsx(
                          "form-select form-select form-select-lg",
                          { "is-invalid": formik.touched.region && formik.errors.region },
                          { "is-valid": formik.touched.region && !formik.errors.region }
                        )}
                      >
                        <option value="">Select a region</option>
                        <option value="AS923">AS923</option>
                        <option value="AS923_2">AS923_2</option>
                        <option value="AS923_3">AS923_3</option>
                        <option value="AS923_4">AS923_4</option>
                        <option value="AU915">AU915</option>
                        <option value="CN470">CN470</option>
                        <option value="CN779">CN779</option>
                        <option value="EU433">EU433</option>
                        <option value="EU868">EU868</option>
                        <option value="IN865">IN865</option>
                        <option value="ISM2400">ISM2400</option>
                        <option value="KR920">KR920</option>
                        <option value="RU864">RU864</option>
                        <option value="US915">US915</option>
                      </select>
                      {formik.touched.region && formik.errors.region && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            <span role="alert">{formik.errors.region}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Mac Version */}
                  <div className="col-md-6">
                    <div className="fv-row mb-6">
                      <label className="required fw-bold fs-6 mb-2">MAC Version</label>
                      <select
                        {...formik.getFieldProps("macVersion")}
                        className={clsx(
                          "form-select form-select form-select-lg",
                          { "is-invalid": formik.touched.macVersion && formik.errors.macVersion },
                          { "is-valid": formik.touched.macVersion && !formik.errors.macVersion }
                        )}
                      >
                        <option value="">Select MAC version</option>
                        <option value="LORAWAN_1_0_0">LORAWAN_1_0_0</option>
                        <option value="LORAWAN_1_0_1">LORAWAN_1_0_1</option>
                        <option value="LORAWAN_1_0_2">LORAWAN_1_0_2</option>
                        <option value="LORAWAN_1_0_3">LORAWAN_1_0_3</option>
                        <option value="LORAWAN_1_0_4">LORAWAN_1_0_4</option>
                        <option value="LORAWAN_1_1_0">LORAWAN_1_1_0</option>
                      </select>
                      {formik.touched.macVersion && formik.errors.macVersion && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            <span role="alert">{formik.errors.macVersion}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="row">
                  {/* Reg Params Revision */}
                  <div className="col-md-6">
                    <div className="fv-row mb-6">
                      <label className="required fw-bold fs-6 mb-2">Regional Parameters Revision</label>
                      <select
                        {...formik.getFieldProps("regParamsRevision")}
                        className={clsx(
                          "form-select form-select form-select-lg",
                          { "is-invalid": formik.touched.regParamsRevision && formik.errors.regParamsRevision },
                          { "is-valid": formik.touched.regParamsRevision && !formik.errors.regParamsRevision }
                        )}
                      >
                        <option value="">Select regional parameters revision</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="RP002_1_0_0">RP002_1_0_0</option>
                        <option value="RP002_1_0_1">RP002_1_0_1</option>
                        <option value="RP002_1_0_2">RP002_1_0_2</option>
                        <option value="RP002_1_0_3">RP002_1_0_3</option>
                        <option value="RP002_1_0_4">RP002_1_0_4</option>
                      </select>
                      {formik.touched.regParamsRevision && formik.errors.regParamsRevision && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            <span role="alert">{formik.errors.regParamsRevision}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* ADR Algorithm Id */}
                  <div className="col-md-6">
                    <div className="fv-row mb-6">
                      <label className="required fw-bold fs-6 mb-2">ADR Algorithm Id</label>
                      <select
                        {...formik.getFieldProps("adrAlgorithmId")}
                        className={clsx(
                          "form-select form-select form-select-lg",
                          { "is-invalid": formik.touched.adrAlgorithmId && formik.errors.adrAlgorithmId },
                          { "is-valid": formik.touched.adrAlgorithmId && !formik.errors.adrAlgorithmId }
                        )}
                      >
                        <option value="">Select ADR algorithm id</option>
                        <option value="Default ADR algorithm (LoRa only)">Default ADR algorithm (LoRa only)</option>
                        <option value="LR-FHSS only ADR algorithm">LR-FHSS only ADR algorithm</option>
                        <option value="LoRa & LR-FHSS ADR algorithm">LoRa & LR-FHSS ADR algorithm</option>
                      </select>
                      {formik.touched.adrAlgorithmId && formik.errors.adrAlgorithmId && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            <span role="alert">{formik.errors.adrAlgorithmId}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="row">
                  {/* Flush Queue On Activate */}
                  <div className="col-md-12">
                    <div className="fv-row mb-6">
                      <label className="fw-bold fs-6 mb-2">Flush Queue On Activate</label>
                      <label className="form-check form-switch form-check-custom form-check-solid">
                        <input type="checkbox" {...formik.getFieldProps("flushQueueOnActivate")} checked={formik.values.flushQueueOnActivate} className="form-check-input" />
                        <span className="form-check-label fw-bold text-muted">Flush queue on activate</span>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="row">
                  {/* Uplink Interval */}
                  <div className="col-md-6">
                    <div className="fv-row mb-6">
                      <label className="required fw-bold fs-6 mb-2">Expected Uplink Interval (secs)</label>
                      <input
                        {...formik.getFieldProps("uplinkInterval")}
                        type="number"
                        name="uplinkInterval"
                        placeholder="Enter uplink interval"
                        className={clsx(
                          "form-control mb-3 mb-lg-0",
                          { "is-invalid": formik.touched.uplinkInterval && formik.errors.uplinkInterval },
                          { "is-valid": formik.touched.uplinkInterval && !formik.errors.uplinkInterval }
                        )}
                        autoComplete="off"
                      />
                      {formik.touched.uplinkInterval && formik.errors.uplinkInterval && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            <span role="alert">{formik.errors.uplinkInterval}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Device Status Req Interval */}
                  <div className="col-md-6">
                    <div className="fv-row mb-6">
                      <label className="fw-bold fs-6 mb-2">Device-status Request Frequency (req/day)</label>
                      <input
                        {...formik.getFieldProps("deviceStatusReqInterval")}
                        type="number"
                        name="deviceStatusReqInterval"
                        placeholder="Enter device-status request frequency"
                        className={clsx(
                          "form-control mb-3 mb-lg-0",
                          { "is-invalid": formik.touched.deviceStatusReqInterval && formik.errors.deviceStatusReqInterval },
                          { "is-valid": formik.touched.deviceStatusReqInterval && !formik.errors.deviceStatusReqInterval }
                        )}
                        autoComplete="off"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="tab-pane fade" id="kt_tab_join" role="tabpanel">
              <div className="d-flex flex-column me-n7 pe-7">
                <div className="row">
                  {/* Supports Otaa */}
                  <div className="col-md-12">
                    <div className="fv-row mb-6">
                      <label className="fw-bold fs-6 mb-2">Device Supports OTAA</label>
                      <label className="form-check form-switch form-check-custom form-check-solid">
                        <input type="checkbox" {...formik.getFieldProps("supportsOtaa")} checked={formik.values.supportsOtaa} className="form-check-input" />
                        <span className="form-check-label fw-bold text-muted">Device supports OTAA</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="tab-pane fade" id="kt_tab_codec" role="tabpanel">
              <div className="d-flex flex-column me-n7 pe-7">
                <div className="row">
                  {/* Payload Codec Runtime */}
                  <div className="col-md-12">
                    <div className="fv-row mb-6">
                      <label className="fw-bold fs-6 mb-2">Payload Codec Runtime</label>
                      <select
                        {...formik.getFieldProps("payloadCodecRuntime")}
                        className={clsx(
                          "form-select form-select form-select-lg",
                          { "is-invalid": formik.touched.payloadCodecRuntime && formik.errors.payloadCodecRuntime },
                          { "is-valid": formik.touched.payloadCodecRuntime && !formik.errors.payloadCodecRuntime }
                        )}
                      >
                        {/* <option value="">Select payload codec runtime</option> */}
                        <option value="NONE">None</option>
                        <option value="CAYENNE_LPP">Cayenne LPP</option>
                        <option value="JS">Javascript functions</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="row">
                  {/* Payload Codec Script */}
                  <div className="col-md-12">
                    <div className="fv-row mb-6">
                      <label className="fw-bold fs-6 mb-2">Payload Codec Script</label>
                      <textarea
                        {...formik.getFieldProps("payloadCodecScript")}
                        className={clsx(
                          "form-control mb-3 mb-lg-0",
                          { "is-invalid": formik.touched.payloadCodecScript && formik.errors.payloadCodecScript },
                          { "is-valid": formik.touched.payloadCodecScript && !formik.errors.payloadCodecScript }
                        )}
                        placeholder="Enter payload codec script"
                        autoComplete="off"
                        rows={5}
                      ></textarea>
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
          </div>

          {/* begin::Actions */}
          <div className="text-center pt-15">
            <button type="reset" onClick={onCloseBackEditDeviceProfile} className="btn btn-light me-3" data-kt-subscription-modal-action="cancel" disabled={formik.isSubmitting}>
              Back
            </button>
            <button type="submit" className="btn btn-primary">
              <span className="indicator-label">Submit</span>
            </button>
          </div>
          {/* end::Actions */}
        </form>
      </KTCardBody>
    </KTCard>
  );
};

export { EditDeviceProfile };
