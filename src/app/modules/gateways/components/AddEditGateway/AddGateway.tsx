import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import clsx from "clsx";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { KTCard, KTCardBody, MetadataInputFields, TagInputFields } from "../../../../../_metronic/helpers";
import { getLORAAuth } from "../../../auth/core/LORAHelpers";
import { addGateway } from "../../api/GatewayAPI";

// Google Maps Configuration
const mapContainerStyle = { width: "100%", height: "300px" };
const defaultCenter = { lat: 19.076, lng: 72.8777 };

const AddGateway = () => {
  const navigate = useNavigate();
  const eui64Regex = /^(?:[0-9A-Fa-f]{2}([-:])?){7}[0-9A-Fa-f]{2}$/;
  const gatewaySchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    description: Yup.string(),
    gatewayId: Yup.string().required("Gateway id is required").matches(eui64Regex, "Invalid EUI64 format"),
    statsInterval: Yup.number().required("Stats interval is required"),
    location: Yup.object(),
    metadata: Yup.object(),
    tags: Yup.object(),
  });

  const formik = useFormik({
    initialValues: {
      tenantId: getLORAAuth()?.tenant_id,
      name: "",
      description: "",
      gatewayId: "",
      statsInterval: 0,
      location: {
        accuracy: 0,
        latitude: defaultCenter.lat,
        longitude: defaultCenter.lng,
        altitude: 0,
        source: "UNKNOWN",
      },
      metadata: {},
      tags: {},
    },
    validationSchema: gatewaySchema,
    onSubmit: async (values, { setSubmitting }) => {
      const data = {
        gateway: {
          tenantId: values.tenantId,
          name: values.name,
          description: values.description,
          gatewayId: values.gatewayId,
          statsInterval: values.statsInterval,
          location: values.location,
          metadata: values.metadata,
          tags: values.tags,
        },
      };
      addGateway(data)
        .then(() => {
          toast.success("Gateway created successfully");
          navigate("/gateways");
        })
        .catch((error) => toast.error(error?.response?.data?.message || "Something went wrong"))
        .finally(() => setSubmitting(false));
    },
  });

  const onCloseBackAddGateway = () => {
    navigate("/gateways");
  };

  const handleMarkerDragEnd = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();

      formik.setFieldValue("location.latitude", lat);
      formik.setFieldValue("location.longitude", lng);
    }
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
              <a className="nav-link" data-bs-toggle="tab" href="#kt_tab_tags">
                Tags
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" data-bs-toggle="tab" href="#kt_tab_metadata">
                Metadata
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
                  {/* Gateway Id */}
                  <div className="col-md-6">
                    <div className="fv-row mb-6">
                      <label className="required fw-bold fs-6 mb-2">Gateway ID (EUI64)</label>
                      <input
                        {...formik.getFieldProps("gatewayId")}
                        type="text"
                        name="gatewayId"
                        placeholder="Enter gateway id"
                        className={clsx(
                          "form-control mb-3 mb-lg-0",
                          { "is-invalid": formik.touched.gatewayId && formik.errors.gatewayId },
                          { "is-valid": formik.touched.gatewayId && !formik.errors.gatewayId }
                        )}
                        aria-describedby="basic-addon3"
                        autoComplete="off"
                      />
                      {formik.touched.gatewayId && formik.errors.gatewayId && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            <span role="alert">{formik.errors.gatewayId}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Stats Interval */}
                  <div className="col-md-6">
                    <div className="fv-row mb-6">
                      <label className="required fw-bold fs-6 mb-2">Stats Interval (secs)</label>
                      <input
                        {...formik.getFieldProps("statsInterval")}
                        type="number"
                        name="statsInterval"
                        placeholder="Enter stats interval"
                        className={clsx(
                          "form-control mb-3 mb-lg-0",
                          { "is-invalid": formik.touched.statsInterval && formik.errors.statsInterval },
                          { "is-valid": formik.touched.statsInterval && !formik.errors.statsInterval }
                        )}
                        autoComplete="off"
                      />
                      {formik.touched.statsInterval && formik.errors.statsInterval && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            <span role="alert">{formik.errors.statsInterval}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="row">
                  {/* Location */}
                  <div className="col-md-12">
                    <div className="fv-row mb-6">
                      <label className="fw-bold fs-6 mb-2">Location</label>
                      <LoadScript googleMapsApiKey="">
                        <GoogleMap
                          mapContainerStyle={mapContainerStyle}
                          center={{
                            lat: formik.values.location.latitude,
                            lng: formik.values.location.longitude,
                          }}
                          zoom={11}
                        >
                          <Marker
                            position={{
                              lat: formik.values.location.latitude,
                              lng: formik.values.location.longitude,
                            }}
                            draggable
                            onDragEnd={handleMarkerDragEnd}
                          />
                        </GoogleMap>
                      </LoadScript>
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
            <div className="tab-pane fade" id="kt_tab_metadata" role="tabpanel">
              <div className="d-flex flex-column me-n7 pe-7">
                <div className="row">
                  {/* Metadata */}
                  <div className="col-md-12">
                    <div className="fv-row mb-6">
                      <label className="fw-bold fs-6 mb-2">Metadata</label>
                      <MetadataInputFields metadata={formik.values.metadata} setMetadata={(metadata: any) => formik.setFieldValue("metadata", metadata)} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* begin::Actions */}
          <div className="text-center pt-15">
            <button type="reset" onClick={onCloseBackAddGateway} className="btn btn-light me-3" data-kt-subscription-modal-action="cancel" disabled={formik.isSubmitting}>
              Back
            </button>
            <button type="submit" className="btn btn-primary" disabled={formik.isSubmitting}>
              <span className="indicator-label">Submit</span>
            </button>
          </div>
          {/* end::Actions */}
        </form>
      </KTCardBody>
    </KTCard>
  );
};

export { AddGateway };
