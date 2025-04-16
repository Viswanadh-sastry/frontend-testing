import { useFormik } from "formik";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { Typeahead } from "react-bootstrap-typeahead";
import { KTIcon, MetadataInputFields } from "../../../../../_metronic/helpers";
import { createDomain } from "../../api/DomainAPI";
import "react-bootstrap-typeahead/css/Typeahead.css";

interface IAddDomainProps {
  onCloseAddDomain: () => void;
  onGetDomainList: () => void;
}

const AddDomain = ({ onCloseAddDomain, onGetDomainList }: IAddDomainProps) => {
  const domainSchema = Yup.object().shape({
    name: Yup.string().required("Organization Name is required"),
    alias: Yup.string(),
    tags: Yup.array(),
    metadata: Yup.object(),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      alias: "",
      tags: [],
      metadata: {},
    },
    validationSchema: domainSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const data = {
        ...values,
        tags: values.tags.map((tag: any) => (tag.label ? tag.label : tag)),
        metadata: values.metadata,
      };
      createDomain(data)
        .then(() => {
          toast.success("Organization created successfully");
          onCloseAddDomain();
          onGetDomainList();
        })
        .catch((error) => toast.error(error?.response?.data?.message || "Something went wrong"))
        .finally(() => setSubmitting(false));
    },
  });

  return (
    <>
      <div className="modal fade show d-block" id="kt_modal_add_domain" role="dialog" tabIndex={-1} aria-modal="true">
        {/* begin::Modal dialog */}
        <div className="modal-dialog modal-dialog-centered mw-900px">
          {/* begin::Modal content */}
          <div className="modal-content">
            <div className="modal-header d-flex justify-content-between align-items-center">
              {/* begin::Modal title */}
              <h2 className="fw-bolder">Add Organization</h2>
              {/* end::Modal title */}

              {/* begin::Close */}
              <div className="btn btn-icon btn-sm btn-active-icon-primary cursor-pointer" data-kt-domains-modal-action="close" onClick={onCloseAddDomain}>
                <KTIcon iconName="cross" className="fs-1" />
              </div>
              {/* end::Close */}
            </div>
            {/* begin::Modal body */}
            <div className="modal-body mx-5 mx-xl-15 my-7">
              <form id="kt_modal_add_domain_form" className="form" onSubmit={formik.handleSubmit} noValidate>
                {/* begin::Scroll */}
                <div className="w-100">
                  <div className="fv-row mb-8">
                    <label className="d-flex align-items-center fs-6 fw-semibold form-label mb-2">
                      <span className="required">Name</span>
                      <span className="ms-1" data-bs-toggle="tooltip" title="Specify organization name">
                        <i className="ki-duotone ki-information-5 text-gray-500 fs-6">
                          <span className="path1"></span>
                          <span className="path2"></span>
                          <span className="path3"></span>
                        </i>
                      </span>
                    </label>
                    <input {...formik.getFieldProps("name")} type="text" className="form-control form-control" placeholder="Organization Name" name="name" />
                    {formik.touched.name && formik.errors.name && (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">
                          <span role="alert">{formik.errors.name}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="fv-row mb-8">
                    <label className="d-flex align-items-center fs-6 fw-semibold form-label mb-2">
                      <span>Alias</span>
                    </label>
                    <input {...formik.getFieldProps("alias")} type="text" className="form-control form-control" placeholder="Organization Alias" name="alias" />
                  </div>
                  <div className="fv-row mb-8">
                    <label className="d-flex align-items-center fs-6 fw-semibold form-label mb-2">
                      <span>Tags</span>
                    </label>
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
                  <div className="fv-row mb-8">
                    <label className="d-flex align-items-center fs-6 fw-semibold form-label mb-2">
                      <span>Metadata</span>
                    </label>
                    <MetadataInputFields metadata={formik.values.metadata} setMetadata={(metadata: any) => formik.setFieldValue("metadata", metadata)} />
                    <label className="fs-6 text-muted">Enter organization metadata in JSON format.</label>
                  </div>
                </div>

                {/* begin::Actions */}
                <div className="text-center pt-15">
                  <button type="reset" onClick={onCloseAddDomain} className="btn btn-light me-3" data-kt-domains-modal-action="cancel" disabled={formik.isSubmitting}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={formik.isSubmitting}>
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

export { AddDomain };
