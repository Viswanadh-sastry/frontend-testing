import clsx from "clsx";
import { useFormik } from "formik";
import { FC } from "react";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { updateProfilePassword } from "../api/ProfileAPI";
import * as credHelper from "../../auth/core/CredentialHelpers";

const changePasswordSchema = Yup.object().shape({
  oldPassword: Yup.string().required("Old Password is required."),
  password: Yup.string().required("Password is required."),
  confirmPassword: Yup.string()
    .required("Confirm Password is required.")
    .oneOf([Yup.ref("password"), ""], "Password and Confirm Password didn't match."),
});

const ChangePassword: FC = () => {
  const formik = useFormik({
    initialValues: {
      oldPassword: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: changePasswordSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const { secret } = credHelper.getCred() || {};
      if (values.oldPassword !== secret) {
        toast.error("Old Password is incorrect");
        setSubmitting(false);
        return;
      }
      const data = {
        old_secret: secret,
        new_secret: values.password,
      };
      updateProfilePassword(data)
        .then(() => {
          toast.success("Password changed successfully");
          formik.resetForm();
        })
        .catch((error) => toast.error(error?.response?.data?.message || "Something went wrong"))
        .finally(() => setSubmitting(false));
    },
  });

  return (
    <>
      <form id="kt_modal_add_user_form" className="form" onSubmit={formik.handleSubmit} noValidate>
        <div className="card-body p-9">
          <div className="row">
            {/* old password */}
            <div className="col-md-12">
              <div className="fv-row mb-6">
                <label className="required fw-bold fs-6 mb-2">Old Password</label>
                <input
                  {...formik.getFieldProps("oldPassword")}
                  type="password"
                  name="oldPassword"
                  className={clsx(
                    "form-control mb-3 mb-lg-0",
                    { "is-invalid": formik.touched.oldPassword && formik.errors.oldPassword },
                    { "is-valid": formik.touched.oldPassword && !formik.errors.oldPassword }
                  )}
                  autoComplete="off"
                />
                {formik.touched.oldPassword && formik.errors.oldPassword && (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      <span role="alert">{formik.errors.oldPassword}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* password */}
            <div className="col-md-12">
              <div className="fv-row mb-6">
                <label className="required fw-bold fs-6 mb-2">Password</label>
                <input
                  {...formik.getFieldProps("password")}
                  type="password"
                  name="password"
                  className={clsx(
                    "form-control mb-3 mb-lg-0",
                    { "is-invalid": formik.touched.password && formik.errors.password },
                    { "is-valid": formik.touched.password && !formik.errors.password }
                  )}
                  autoComplete="off"
                />
                {formik.touched.password && formik.errors.password && (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      <span role="alert">{formik.errors.password}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* Confirm Password */}
            <div className="col-md-12">
              <div className="fv-row mb-6">
                <label className="required fw-bold fs-6 mb-2">Confirm Password</label>
                <input
                  {...formik.getFieldProps("confirmPassword")}
                  type="password"
                  name="confirmPassword"
                  className={clsx(
                    "form-control mb-3 mb-lg-0",
                    { "is-invalid": formik.touched.confirmPassword && formik.errors.confirmPassword },
                    { "is-valid": formik.touched.confirmPassword && !formik.errors.confirmPassword }
                  )}
                  autoComplete="off"
                />
                {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      <span role="alert">{formik.errors.confirmPassword}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="card-footer d-flex justify-content-end py-6 px-9">
          <button type="button" className="btn btn-secondary mx-2" onClick={() => formik.resetForm()}>
            <span className="indicator-label">Clear</span>
          </button>
          <button type="submit" className="btn btn-primary" disabled={formik.isSubmitting}>
            <span className="indicator-label">Submit</span>
          </button>
        </div>
      </form>
    </>
  );
};

export { ChangePassword };
