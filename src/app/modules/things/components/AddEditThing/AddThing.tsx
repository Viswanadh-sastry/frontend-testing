import clsx from "clsx";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { createThing } from "../../api/ThingAPI";
import { KTIcon, MetadataInputFields } from "../../../../../_metronic/helpers";
import { Typeahead } from "react-bootstrap-typeahead";

interface IAddThingProps {
  onCloseAddThing: () => void;
  onGetThingList: () => void;
}

const AddThing = ({ onCloseAddThing, onGetThingList }: IAddThingProps) => {
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
    },
    validationSchema: thingSchema,
    onSubmit: async (values, { setSubmitting }) => {
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
          toast.success("Device created successfully");
          onCloseAddThing();
          onGetThingList();
        })
        .catch((error) => toast.error(error.message))
        .finally(() => setSubmitting(false));
    },
  });

  // Ensure that the "Update_Frequency" key is initialized in metadata
  const initialMetadata = {
    Update_Frequency: "",
    ...formik.values.metadata,
  };

  return (
    <>
      <div className="modal fade show d-block" id="kt_modal_add_thing" role="dialog" tabIndex={-1} aria-modal="true">
        {/* begin::Modal dialog */}
        <div className="modal-dialog modal-dialog-centered mw-900px">
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
