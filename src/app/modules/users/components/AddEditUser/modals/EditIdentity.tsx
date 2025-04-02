import clsx from "clsx";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { KTIcon } from "../../../../../../_metronic/helpers";
import { updateUserIdentity } from "../../../api/UserAPI";

interface IEditIdentityProps {
  data: {
    id: string;
    credentials: {
      identity: string;
    };
  };
  onClose: () => void;
  onDisplay: () => void;
}

const EditIdentity = ({ data, onClose, onDisplay }: IEditIdentityProps) => {
  const formik = useFormik({
    initialValues: {
      identity: data.credentials.identity,
    },
    enableReinitialize: true,
    validationSchema: Yup.object().shape({
      identity: Yup.string()
        .email("Invalid email format")
        .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid email format")
        .required("Identity is required."),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      updateUserIdentity(data.id, values.identity)
        .then(() => {
          toast.success("Identity updated successfully");
          onClose();
          onDisplay();
        })
        .catch((error) => toast.error(error?.response?.data?.message || "Something went wrong"))
        .finally(() => setSubmitting(false));
    },
  });

  return (
    <>
      <div className="modal fade show d-block" id="kt_modal_add_user" role="dialog" tabIndex={-1} aria-modal="true">
        {/* begin::Modal dialog */}
        <div className="modal-dialog modal-dialog-centered mw-600px">
          {/* begin::Modal content */}
          <div className="modal-content">
            <div className="modal-header d-flex justify-content-between align-items-center">
              {/* begin::Modal title */}
              <h2 className="fw-bolder">Edit Identity</h2>
              {/* end::Modal title */}

              {/* begin::Close */}
              <div className="btn btn-icon btn-sm btn-active-icon-primary" data-kt-users-modal-action="close" onClick={onClose} style={{ cursor: "pointer" }}>
                <KTIcon iconName="cross" className="fs-1" />
              </div>
              {/* end::Close */}
            </div>
            {/* begin::Modal body */}
            <div className="modal-body mx-5 mx-xl-15 my-7">
              <form id="kt_modal_add_user_form" className="form" onSubmit={formik.handleSubmit} noValidate>
                {/* begin::Scroll */}
                <div className="d-flex flex-column me-n7 pe-7">
                  <div className="row">
                    {/* Identity */}
                    <div className="col-md-12">
                      <div className="fv-row mb-6">
                        <label className="required fw-bold fs-6 mb-2">Identity</label>
                        <input
                          {...formik.getFieldProps("identity")}
                          type="text"
                          name="identity"
                          className={clsx(
                            "form-control mb-3 mb-lg-0",
                            { "is-invalid": formik.touched.identity && formik.errors.identity },
                            { "is-valid": formik.touched.identity && !formik.errors.identity }
                          )}
                          autoComplete="off"
                        />
                        {formik.touched.identity && formik.errors.identity && (
                          <div className="fv-plugins-message-container">
                            <div className="fv-help-block">
                              <span role="alert">{formik.errors.identity}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* begin::Actions */}
                <div className="text-center pt-15">
                  <button type="reset" onClick={onClose} className="btn btn-light me-3" data-kt-users-modal-action="cancel" disabled={formik.isSubmitting}>
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

export { EditIdentity };
