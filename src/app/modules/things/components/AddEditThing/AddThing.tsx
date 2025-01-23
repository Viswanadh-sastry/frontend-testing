import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { useFormik } from "formik";
import { Typeahead } from "react-bootstrap-typeahead";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { AutoEventInputFields, KTIcon, MetadataInputFields } from "../../../../../_metronic/helpers";
import { createDevice, createThing, getDeviceProfileList, getDeviceServiceList } from "../../api/ThingAPI";

interface IAddThingProps {
  onCloseAddThing: () => void;
  onGetThingList: () => void;
}

const AddThing = ({ onCloseAddThing, onGetThingList }: IAddThingProps) => {
  const deviceProfileListQuery = useQuery({
    queryKey: ["deviceProfileList"],
    queryFn: async () => getDeviceProfileList().catch((error) => toast.error(error.message)),
    enabled: true,
  });
  const deviceServiceListQuery = useQuery({
    queryKey: ["deviceServiceList"],
    queryFn: async () => getDeviceServiceList().catch((error) => toast.error(error.message)),
    enabled: true,
  });
  const thingSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    identity: Yup.string(),
    secret: Yup.string(),
    tags: Yup.array(),
    metadata: Yup.object(),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      identity: "",
      secret: "",
      tags: [],
      metadata: {},
      enabledRule: false,
      description: "",
      adminState: "UNLOCKED",
      serviceName: "",
      profileName: "",
      autoEvents: [],
      protocolName: "",
    },
    validationSchema: thingSchema,
    onSubmit: async (values, { setSubmitting }) => {
      if (!isValidateMetadata(values.metadata)) {
        toast.warn("Invalid metadata format");
        setSubmitting(false);
        return;
      }
      const data = {
        name: values.name,
        credentials: {
          identity: values.identity,
          secret: values.secret,
        },
        tags: values.tags.map((tag: any) => (tag.label ? tag.label : tag)),
        metadata: values.metadata,
        status: "enabled",
      };
      createThing(data)
        .then(() => {
          if (values.enabledRule) {
            const deviceData = [
              {
                apiVersion: "v3",
                device: {
                  name: values.name,
                  description: values.description,
                  labels: values.tags.map((tag: any) => (tag.label ? tag.label : tag)),
                  adminState: values.adminState,
                  operatingState: "UP",
                  serviceName: values.serviceName,
                  profileName: values.profileName,
                  autoEvents: values.autoEvents.map((autoEvent: any) => ({
                    interval: autoEvent.interval,
                    unit: autoEvent.unit,
                    onchange: autoEvent.onchange,
                    resource: autoEvent.resource,
                  })),
                  protocolName: values.protocolName,
                },
              },
            ];
            createDevice(deviceData)
              .then(() => {
                toast.success("Device created successfully");
                onCloseAddThing();
                onGetThingList();
              })
              .catch((error) => toast.error(error.message));
          } else {
            toast.success("Device created successfully");
            onCloseAddThing();
            onGetThingList();
          }
        })
        .catch((error) => toast.error(error.message))
        .finally(() => setSubmitting(false));
    },
  });

  const isValidateMetadata = (metadata: any) => {
    if (!metadata || Object.keys(metadata).length === 0) {
      return true;
    }

    return Object.keys(metadata).every((key) => {
      if (key.toLowerCase() === "phone_number") {
        return /^\d{10}$/.test(metadata[key]) && metadata[key] !== "0000000000";
      }
      if (key.toLowerCase() === "update_frequency") {
        return /^\d+$/.test(metadata[key]) && parseInt(metadata[key]) !== 0;
      }
      return true;
    });
  };

  // Ensure that the "Update_Frequency" key is initialized in metadata
  const initialMetadata = {
    Update_Frequency: "",
    ...formik.values.metadata,
  };

  return (
    <>
      <div className="modal fade show d-block" id="kt_modal_add_thing" role="dialog" tabIndex={-1} aria-modal="true">
        {/* begin::Modal dialog */}
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable mw-900px mh-900px">
          {/* begin::Modal content */}
          <div className="modal-content">
            <div className="modal-header d-flex justify-content-between align-items-center">
              {/* begin::Modal title */}
              <h2 className="fw-bolder">Add Device</h2>
              {/* end::Modal title */}

              {/* begin::Close */}
              <div className="btn btn-icon btn-sm btn-active-icon-primary" data-kt-thing-modal-action="close" onClick={onCloseAddThing} style={{ cursor: "pointer" }}>
                <KTIcon iconName="cross" className="fs-1" />
              </div>
              {/* end::Close */}
            </div>
            {/* begin::Modal body */}
            <div className="modal-body mx-5 mx-xl-15 my-7">
              <form id="kt_modal_add_thing_form" className="form" onSubmit={formik.handleSubmit} noValidate>
                {/* begin::Scroll */}
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
                          placeholder="Device Name"
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
                    {/* Identity */}
                    <div className="col-md-12">
                      <div className="fv-row mb-6">
                        <label className="fw-bold fs-6 mb-2">Identity</label>
                        <input
                          {...formik.getFieldProps("identity")}
                          type="text"
                          name="identity"
                          placeholder="Device Identity"
                          className={clsx(
                            "form-control mb-3 mb-lg-0",
                            { "is-invalid": formik.touched.identity && formik.errors.identity },
                            { "is-valid": formik.touched.identity && !formik.errors.identity }
                          )}
                          autoComplete="off"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    {/* Secret */}
                    <div className="col-md-12">
                      <div className="fv-row mb-6">
                        <label className="fw-bold fs-6 mb-2">Secret</label>
                        <input
                          {...formik.getFieldProps("secret")}
                          type="password"
                          name="secret"
                          placeholder="Device Secret"
                          className={clsx(
                            "form-control mb-3 mb-lg-0",
                            { "is-invalid": formik.touched.secret && formik.errors.secret },
                            { "is-valid": formik.touched.secret && !formik.errors.secret }
                          )}
                          autoComplete="off"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    {/* Tags */}
                    <div className="col-md-12">
                      <div className="fv-row mb-6">
                        <label className="fw-bold fs-6 mb-2">Tags</label>
                        <Typeahead
                          id="tags"
                          allowNew
                          multiple
                          options={[]}
                          placeholder="Add a tag"
                          newSelectionPrefix="Add a new tag: "
                          selected={formik.values.tags}
                          onChange={(selected) => formik.setFieldValue("tags", selected)}
                          onKeyDown={(e: any) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              const inputValue = e.target.value.trim();
                              if (inputValue) {
                                if (Array.isArray(formik.values.tags)) {
                                  formik.setFieldValue("tags", [...formik.values.tags, inputValue]);
                                } else {
                                  formik.setFieldValue("tags", [inputValue]);
                                }
                                e.stopPropagation();
                                e.target.select();
                              }
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    {/* Metadata */}
                    <div className="col-md-12">
                      <div className="fv-row mb-6">
                        <label className="fw-bold fs-6 mb-2">Metadata</label>
                        <MetadataInputFields metadata={initialMetadata} setMetadata={(metadata: any) => formik.setFieldValue("metadata", metadata)} />
                        <label className="fs-6 text-muted">Enter device metadata in JSON format.</label>
                      </div>
                    </div>
                  </div>

                  {/* begin::Switch for enabled rule */}
                  <div className="row">
                    <div className="col-md-6">
                      <div className="fv-row">
                        <label className="fw-bold fs-6 mb-2">Enabled Rule</label>
                        <label className="form-check form-switch form-check-custom form-check-solid">
                          <input type="checkbox" {...formik.getFieldProps("enabledRule")} checked={formik.values.enabledRule} className="form-check-input" />
                          <span className="form-check-label fw-bold text-muted">Enable the rule for this device</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {formik.values.enabledRule && (
                    <>
                      {/* begin::Separator */}
                      <div className="separator separator-dashed my-7"></div>
                      {/* end::Separator */}

                      {/* begin::Description */}
                      <div className="row">
                        <div className="col-md-12">
                          <div className="fv-row mb-6">
                            <label className="fw-bold fs-6 mb-2">Description</label>
                            <textarea
                              {...formik.getFieldProps("description")}
                              name="description"
                              placeholder="Device Description"
                              className={clsx(
                                "form-control mb-3 mb-lg-0",
                                { "is-invalid": formik.touched.description && formik.errors.description },
                                { "is-valid": formik.touched.description && !formik.errors.description }
                              )}
                              autoComplete="off"
                            ></textarea>
                          </div>
                        </div>
                      </div>

                      {/* begin::Select options for admin state, operating state and protocol name */}
                      <div className="row">
                        <div className="col-md-6">
                          <div className="fv-row mb-6">
                            <label className="fw-bold fs-6 mb-2">Admin State</label>
                            <select
                              {...formik.getFieldProps("adminState")}
                              className={clsx(
                                "form-select form-select-solid form-select-lg",
                                { "is-invalid": formik.touched.adminState && formik.errors.adminState },
                                { "is-valid": formik.touched.adminState && !formik.errors.adminState }
                              )}
                            >
                              <option value="UNLOCKED">Unlocked</option>
                              <option value="LOCKED">Locked</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="fv-row mb-6">
                            <label className="fw-bold fs-6 mb-2">Protocol Name</label>
                            <Typeahead
                              id="protocolName"
                              labelKey="name"
                              options={deviceServiceListQuery.data?.profiles || []}
                              placeholder="Select a protocol"
                              onChange={(selected) => formik.setFieldValue("protocolName", selected)}
                            />
                          </div>
                        </div>
                      </div>

                      {/* begin::Service Name */}
                      <div className="row">
                        <div className="col-md-12">
                          <div className="fv-row mb-6">
                            <label className="fw-bold fs-6 mb-2">Service Name</label>
                            <Typeahead
                              id="serviceName"
                              labelKey="name"
                              options={deviceServiceListQuery.data?.profiles || []}
                              placeholder="Select a service"
                              onChange={(selected) => formik.setFieldValue("serviceName", selected)}
                            />
                          </div>
                        </div>
                      </div>

                      {/* begin::Profile Name */}
                      <div className="row">
                        <div className="col-md-12">
                          <div className="fv-row mb-6">
                            <div className="accordion accordion-icon-collapse w-100" id="kt_accordion_3">
                              <div className="accordion-header py-1 d-flex collapsed" data-bs-toggle="collapse" data-bs-target="#kt_accordion_3_item_3">
                                <label className="fw-bold fs-6 w-100px mb-2">Profile Name</label>
                                <span className="accordion-icon">
                                  <i className="ki-duotone ki-plus-square fs-3 accordion-icon-off">
                                    <span className="path1"></span>
                                    <span className="path2"></span>
                                    <span className="path3"></span>
                                  </i>
                                  <i className="ki-duotone ki-minus-square fs-3 accordion-icon-on">
                                    <span className="path1"></span>
                                    <span className="path2"></span>
                                  </i>
                                </span>
                              </div>

                              <div id="kt_accordion_3_item_3" className="collapse fs-6 py-5" data-bs-parent="#kt_accordion_3">
                                <div className="card">
                                  <div className="card-body">
                                    <div className="card-px text-center">
                                      <h2 className="fs-2x fw-bold mb-0">Upload Profile</h2>
                                      <p className="text-gray-500 fs-7 fw-semibold py-7">
                                        <input type="file" accept=".yml" />
                                        <br />
                                        Click on the below buttons to upload the file.
                                      </p>
                                      <a href="#" className="btn btn-light-primary er fs-7" data-bs-toggle="modal" data-bs-target="#kt_modal_select_location">
                                        Upload File
                                      </a>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <Typeahead
                              id="profileName"
                              labelKey="name"
                              options={deviceProfileListQuery.data?.profiles || []}
                              placeholder="Select a profile"
                              onChange={(selected) => formik.setFieldValue("profileName", selected)}
                            />
                          </div>
                        </div>
                      </div>

                      {/* begin::Typehead for auto events */}
                      <div className="row">
                        <div className="col-md-12">
                          <div className="fv-row mb-6">
                            <label className="fw-bold fs-6 mb-2">Auto Events</label>
                            {/* Add auto events for the device */}
                            <AutoEventInputFields autoEvents={formik.values.autoEvents} setAutoEvents={(autoEvents: any) => formik.setFieldValue("autoEvents", autoEvents)} />
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* begin::Actions */}
                <div className="text-center pt-15">
                  <button type="reset" onClick={onCloseAddThing} className="btn btn-light me-3" data-kt-thing-modal-action="cancel" disabled={formik.isSubmitting}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <span className="indicator-label">Submit</span>
                  </button>
                </div>
                {/* end::Actions */}
              </form>
            </div>
            {/* end::Modal body */}
          </div>
          {/* end::Modal content */}
        </div>
        {/* end::Modal dialog */}
      </div>
      {/* begin::Modal Backdrop */}
      <div className="modal-backdrop fade show"></div>
      {/* end::Modal Backdrop */}
    </>
  );
};

export { AddThing };
