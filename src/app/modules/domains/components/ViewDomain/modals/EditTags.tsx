import { useFormik } from "formik";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { Typeahead } from "react-bootstrap-typeahead";
import { KTIcon } from "../../../../../../_metronic/helpers";
import { updateDomain } from "../../../api/DomainsAPI";
import "react-bootstrap-typeahead/css/Typeahead.css";

interface IEditTagsProps {
  data: {
    id: string;
    tags: string[];
  };
  onClose: () => void;
  onDisplay: () => void;
}

const EditTags = ({ data, onClose, onDisplay }: IEditTagsProps) => {
  const formik = useFormik({
    initialValues: {
      tags: data.tags,
    },
    enableReinitialize: true,
    validationSchema: Yup.object().shape({
      tags: Yup.array().min(1, "Tags is required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      const domain = {
        tags: values.tags.map((tag: any) => (tag.label ? tag.label : tag)),
      };
      // Validate the duplicate tags
      const uniqueTags = new Set(domain.tags);
      if (uniqueTags.size !== domain.tags.length) {
        toast.warn("Duplicate tags are not allowed");
        setSubmitting(false);
        return;
      }
      updateDomain(data.id, domain)
        .then(() => {
          toast.success("Tags updated successfully");
          onClose();
          onDisplay();
        })
        .catch((error) => toast.error(error?.response?.data?.message || "Something went wrong"))
        .finally(() => setSubmitting(false));
    },
  });

  return (
    <>
      <div className="modal fade show d-block" id="kt_modal_add_domain" role="dialog" tabIndex={-1} aria-modal="true">
        {/* begin::Modal dialog */}
        <div className="modal-dialog modal-dialog-centered mw-600px">
          {/* begin::Modal content */}
          <div className="modal-content">
            <div className="modal-header d-flex justify-content-between align-items-center">
              {/* begin::Modal title */}
              <h2 className="fw-bolder">Edit Tags</h2>
              {/* end::Modal title */}

              {/* begin::Close */}
              <div className="btn btn-icon btn-sm btn-active-icon-primary" data-kt-domains-modal-action="close" onClick={onClose} style={{ cursor: "pointer" }}>
                <KTIcon iconName="cross" className="fs-1" />
              </div>
              {/* end::Close */}
            </div>
            {/* begin::Modal body */}
            <div className="modal-body mx-5 mx-xl-15 my-7">
              <form id="kt_modal_add_domain_form" className="form" onSubmit={formik.handleSubmit} noValidate>
                {/* begin::Scroll */}
                <div className="d-flex flex-column me-n7 pe-7">
                  <div className="row">
                    {/* Tags */}
                    <div className="col-md-12">
                      <div className="fv-row mb-6">
                        <label className="required fw-bold fs-6 mb-2">Tags</label>
                        <Typeahead
                          id="tags"
                          allowNew
                          multiple
                          options={[]}
                          selected={formik.values.tags}
                          onChange={(selected: any) => formik.setFieldValue("tags", selected)}
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
                          placeholder="Add tags..."
                          newSelectionPrefix="Add a new tag: "
                        />
                        {formik.touched.tags && formik.errors.tags && (
                          <div className="fv-plugins-message-container">
                            <div className="fv-help-block">
                              <span role="alert">{formik.errors.tags}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* begin::Actions */}
                <div className="text-center pt-15">
                  <button type="reset" onClick={onClose} className="btn btn-light me-3" data-kt-domains-modal-action="cancel" disabled={formik.isSubmitting}>
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

export { EditTags };
