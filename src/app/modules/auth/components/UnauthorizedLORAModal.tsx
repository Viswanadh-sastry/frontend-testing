import { useFormik } from "formik";
import { Modal } from "react-bootstrap";
import * as Yup from "yup";
import * as loraHelper from "../core/LORAHelpers";
import clsx from "clsx";

export function UnauthorizedLORAModal() {
  const loraAuth = loraHelper.getLORAAuth();
  // const filterTenant = {
  //   limit: 10,
  //   offset: 0,
  // };
  // const tenantListQuery = useQuery({
  //   queryKey: [`tenantList`, filterTenant],
  //   queryFn: async () => getTenantList(filterTenant),
  //   enabled: true,
  // });
  // const tenants = useMemo(() => tenantListQuery.data?.result || [], [tenantListQuery.data]);

  const loraSchema = Yup.object().shape({
    token: Yup.string().required("Token is required"),
    tenant: Yup.string().required("Tenant is required"),
  });
  const formik = useFormik({
    initialValues: {
      token: "",
      tenant: loraAuth?.tenant_id || "",
    },
    validationSchema: loraSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        loraHelper.setLORAAuth({
          access_token: values.token,
          tenant_id: values.tenant,
        });
        localStorage.setItem("lora_unauthorized", "false");
        window.location.reload();
      } catch (error) {
        console.error(error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const onHide = () => {
    window.location.reload();
  };

  return (
    <Modal show={true} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>LORA Authorization</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={formik.handleSubmit} noValidate>
          <div className="form-group">
            <label>Token</label>
            <textarea
              {...formik.getFieldProps("token")}
              placeholder="Token"
              className={clsx(
                "form-control mb-3 mb-lg-0",
                { "is-invalid": formik.touched.token && formik.errors.token },
                { "is-valid": formik.touched.token && !formik.errors.token }
              )}
              name="token"
              autoComplete="off"
              rows={5}
            />
            {formik.touched.token && formik.errors.token ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">{formik.errors.token}</div>
              </div>
            ) : null}
          </div>
          <div className="form-group">
            <label>Tenant</label>
            <input
              {...formik.getFieldProps("tenant")}
              placeholder="Tenant"
              className={clsx("form-control", { "is-invalid": formik.touched.tenant && formik.errors.tenant }, { "is-valid": formik.touched.tenant && !formik.errors.tenant })}
              type="text"
              name="tenant"
              autoComplete="off"
            />
            {formik.touched.tenant && formik.errors.tenant ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">{formik.errors.tenant}</div>
              </div>
            ) : null}
          </div>
          <div className="text-center pt-10">
            <button type="submit" className="btn btn-primary" disabled={formik.isSubmitting}>
              Authorize
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}
