import { useState } from "react";
import * as Yup from "yup";
import clsx from "clsx";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { login } from "../core/_requests";
import * as domainHelper from "../core/DomainHelpers";
import * as credHelper from "../core/CredentialHelpers";
import * as vaultHelper from "../core/VaultHelpers";
import * as loraHelper from "../core/LORAHelpers";
import { toAbsoluteUrl } from "../../../../_metronic/helpers";
import { ThemeModeComponent } from "../../../../_metronic/assets/ts/layout";
import { getJWTToken, getVaultToken } from "../../users/api/VaultAPI";

const LORA_ACCESS_TOKEN = import.meta.env.VITE_APP_LORA_ACCESS_TOKEN;
const LORA_TENANT_ID = import.meta.env.VITE_APP_LORA_TENANT_ID;

const loginSchema = Yup.object().shape({
  identity: Yup.string().min(3, "Minimum 3 symbols").max(50, "Maximum 50 symbols").required("Email/Username is required"),
  secret: Yup.string().min(3, "Minimum 3 symbols").max(50, "Maximum 50 symbols").required("Password is required"),
});

const initialValues = {
  identity: "",
  secret: "",
};

export function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  let ktThemeModeValue = localStorage.getItem("kt_theme_mode_value");
  if (ktThemeModeValue === "system") {
    ktThemeModeValue = ThemeModeComponent.getSystemMode() as "light" | "dark";
  }

  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      try {
        const auth = await login(values.identity, values.secret);
        if (!auth.access_token) {
          throw new Error("No access token found");
        }
        const username = values.identity.split("@")[0];
        const vault = await getVaultToken({ username: username, password: values.secret });
        if (!vault.auth.client_token) {
          throw new Error("No client token found");
        }
        const vaultToken = await getJWTToken(username, vault.auth.client_token);
        if (!vaultToken.data.token) {
          throw new Error("No token found");
        }
        vaultHelper.setVaultToken(vaultToken.data.token);
        vaultHelper.setVaultClientToken(vault.auth.client_token);
        const loraAuth = loraHelper.getLORAAuth();
        if (!loraAuth) {
          loraHelper.setLORAAuth({
            access_token: LORA_ACCESS_TOKEN,
            tenant_id: LORA_TENANT_ID,
          });
        }
        // vaultHelper.setVaultToken(
        //   "eyJhbGciOiJFUzM4NCIsImtpZCI6ImJkMjJjZTlmLTY2MjAtNjQ3Ny03ZjFmLTBmZWE2YjNlMzI1MyJ9.eyJhdWQiOiJlZGdleCIsImV4cCI6MTczODEzMTQzNywiaWF0IjoxNzM4MTI0Mjk3LCJpc3MiOiIvdjEvaWRlbnRpdHkvb2lkYyIsIm5hbWUiOiJleDEiLCJuYW1lc3BhY2UiOiJyb290Iiwic3ViIjoiYTg3MTA5MjAtNjEwZS02MTllLWEzNTQtYWU5M2Y3ZGY0NDEwIn0.EYzEHdPwd-o5QHsGYYnwC-iHUARUSIWeQ-Ohyn118NUykXPAxYF3pXde_XZKR33Ewlu6-wiIQg2Q7ByikY9RfOGqvloAlJVaWG-EhU7g_pylXxfn4aeTVeP8Q7krhL92"
        // );
        domainHelper.setDAuth(auth);
        credHelper.setCred(values);
        navigate("/domain/list");
      } catch (error) {
        console.error(error);
        // error logs in json format
        console.log("error", JSON.stringify(error));
        setStatus("The login details are incorrect");
        setSubmitting(false);
        setLoading(false);
      }
    },
  });

  return (
    <form className="form w-100" onSubmit={formik.handleSubmit} noValidate id="kt_login_signin_form">
      {/* begin::Heading */}
      <div className="text-center mb-11">
        {/* begin::Logo */}
        <Link to="/" className="mb-12">
          <img
            alt="Logo"
            src={toAbsoluteUrl(ktThemeModeValue === "dark" ? "media/logos/honeycomb_dark_vertical.png" : "media/logos/honeycomb_light_vertical.png")}
            className="h-200px"
          />
        </Link>
        {/* end::Logo */}
        <h1 className="text-gray-900 fw-bolder mb-3">Sign In</h1>
        <div className="text-gray-500 fw-semibold fs-6">Sign in with email/username</div>
      </div>
      {/* begin::Heading */}

      {formik.status && (
        <div className="mb-lg-15 alert alert-danger">
          <div className="alert-text font-weight-bold">{formik.status}</div>
        </div>
      )}

      {/* begin::Form group */}
      <div className="fv-row mb-8">
        <label className="form-label fs-6 fw-bolder text-gray-900">Email/Username</label>
        <input
          placeholder="Email/Username"
          {...formik.getFieldProps("identity")}
          className={clsx(
            "form-control bg-transparent",
            { "is-invalid": formik.touched.identity && formik.errors.identity },
            {
              "is-valid": formik.touched.identity && !formik.errors.identity,
            }
          )}
          type="text"
          name="identity"
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
      {/* end::Form group */}

      {/* begin::Form group */}
      <div className="fv-row mb-3">
        <label className="form-label fw-bolder text-gray-900 fs-6 mb-0">Password</label>
        <input
          type="password"
          autoComplete="off"
          placeholder="Password"
          {...formik.getFieldProps("secret")}
          className={clsx(
            "form-control bg-transparent",
            {
              "is-invalid": formik.touched.secret && formik.errors.secret,
            },
            {
              "is-valid": formik.touched.secret && !formik.errors.secret,
            }
          )}
        />
        {formik.touched.secret && formik.errors.secret && (
          <div className="fv-plugins-message-container">
            <div className="fv-help-block">
              <span role="alert">{formik.errors.secret}</span>
            </div>
          </div>
        )}
      </div>
      {/* end::Form group */}

      {/* begin::Wrapper */}
      <div className="d-flex flex-stack flex-wrap gap-3 fs-base fw-semibold mb-8">
        <div />

        {/* begin::Link */}
        <Link to="/auth/forgot-password" className="link-primary">
          Forgot Password ?
        </Link>
        {/* end::Link */}
      </div>
      {/* end::Wrapper */}

      {/* begin::Action */}
      <div className="d-grid mb-10">
        <button type="submit" id="kt_sign_in_submit" className="btn btn-primary" disabled={formik.isSubmitting || !formik.isValid}>
          {!loading && <span className="indicator-label">Continue</span>}
          {loading && (
            <span className="indicator-progress d-block">
              Please wait...
              <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
            </span>
          )}
        </button>
      </div>
      {/* end::Action */}
    </form>
  );
}
