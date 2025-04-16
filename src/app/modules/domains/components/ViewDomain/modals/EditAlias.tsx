import clsx from "clsx";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { KTIcon } from "../../../../../../_metronic/helpers";
import { updateDomain } from "../../../api/DomainsAPI";

interface IEditAliasProps {
  data: {
    id: string;
    alias: string;
  };
  onClose: () => void;
  onDisplay: () => void;
}

const EditAlias = ({ data, onClose, onDisplay }: IEditAliasProps) => {
  const formik = useFormik({
    initialValues: {
      alias: data.alias,
    },
    enableReinitialize: true,
    validationSchema: Yup.object().shape({
      alias: Yup.string().required("Alias is required."),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      updateDomain(data.id, values)
        .then(() => {
          toast.success("Alias updated successfully");
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
              <h2 className="fw-bolder">Edit Alias</h2>
              {/* end::Modal title */}

              {/* begin::Close */}
              <div className="btn btn-icon btn-sm btn-active-icon-primary cursor-pointer" data-kt-domains-modal-action="close" onClick={onClose}>
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
                    {/* Alias */}
                    <div className="col-md-12">
                      <div className="fv-row mb-6">
                        <label className="required fw-bold fs-6 mb-2">Alias</label>
                        <input
                          {...formik.getFieldProps("alias")}
                          type="text"
                          name="alias"
                          className={clsx(
                            "form-control mb-3 mb-lg-0",
                            { "is-invalid": formik.touched.alias && formik.errors.alias },
                            { "is-valid": formik.touched.alias && !formik.errors.alias }
                          )}
                          autoComplete="off"
                        />
                        {formik.touched.alias && formik.errors.alias && (
                          <div className="fv-plugins-message-container">
                            <div className="fv-help-block">
                              <span role="alert">{formik.errors.alias}</span>
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

export { EditAlias };
