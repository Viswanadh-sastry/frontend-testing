import { useFormik } from "formik";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { KTIcon } from "../../../../../../_metronic/helpers";
import { updateUserRole } from "../../../api/UserAPI";

interface IEditRoleProps {
  data: {
    id: string;
    role: string;
  };
  onClose: () => void;
  onDisplay: () => void;
}

const EditRole = ({ data, onClose, onDisplay }: IEditRoleProps) => {
  const formik = useFormik({
    initialValues: {
      role: data.role,
    },
    enableReinitialize: true,
    validationSchema: Yup.object().shape({
      role: Yup.string().required("Role is required."),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      updateUserRole(data.id, values.role)
        .then(() => {
          toast.success("Role updated successfully");
          onClose();
          onDisplay();
        })
        .catch((error) => toast.error(error?.response?.data?.message || "Something went wrong"))
        .finally(() => setSubmitting(false));
    },
  });

  return (
    <>
      <div className="modal fade show d-block" role="dialog" tabIndex={-1} aria-modal="true">
        {/* begin::Modal dialog */}
        <div className="modal-dialog modal-dialog-centered mw-600px">
          {/* begin::Modal content */}
          <div className="modal-content">
            <div className="modal-header d-flex justify-content-between align-items-center">
              {/* begin::Modal title */}
              <h2 className="fw-bolder">Edit Role</h2>
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
                    {/* Role */}
                    <div className="col-md-12">
                      <div className="fv-row mb-6">
                        <label className="required fw-bold fs-6 mb-2">Are you sure you want to update the role of this user?</label>
                        <div className="form-check">
                          <input
                            type="radio"
                            className="form-check-input"
                            name="role"
                            id="role"
                            checked={formik.values.role === "admin" || formik.values.role === "administrator"}
                            onChange={() => formik.setFieldValue("role", "admin")}
                            onBlur={formik.handleBlur}
                            value={formik.values.role}
                          />
                          <label htmlFor="role" className="fw-bold fs-6">
                            Admin
                          </label>
                          <div className="form-text" id="roleHelp">
                            This will make the user a super admin in the system
                          </div>
                        </div>
                        {formik.touched.role && formik.errors.role && (
                          <div className="fv-plugins-message-container">
                            <div className="fv-help-block">
                              <span role="alert">{formik.errors.role}</span>
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

export { EditRole };
