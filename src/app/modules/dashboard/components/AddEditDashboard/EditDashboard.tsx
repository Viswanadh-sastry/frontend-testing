import clsx from "clsx";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { KTIcon } from "../../../../../_metronic/helpers";
import { useAuth } from "../../../auth";
import { updateDashboard } from "../../api/DashboardAPI";
import { editDashboard, getDashboardById } from "../../api/DashboardHelper";

interface IEditDashboardProps {
  id: string;
  onCloseEditDashboard: () => void;
  onGetDashboardList: () => void;
}

const EditDashboard = ({ id, onCloseEditDashboard, onGetDashboardList }: IEditDashboardProps) => {
  const { currentUser } = useAuth();
  const { id: userId } = currentUser || { id: "" };
  const dashboard = getDashboardById(id);
  const dashboardSchema = Yup.object().shape({
    id: Yup.string().required("Id is required"),
    name: Yup.string().required("Name is required"),
    description: Yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      id: dashboard?.id || "",
      name: dashboard?.name || "",
      description: dashboard?.description || "",
    },
    enableReinitialize: true,
    validationSchema: dashboardSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const payload = editDashboard({
        ...values,
        layout: dashboard?.layout,
        data: dashboard?.data,
      });
      updateDashboard(userId, payload)
        .then(() => {
          toast.success("Dashboard updated successfully");
          onCloseEditDashboard();
          onGetDashboardList();
        })
        .catch((error) => toast.error(error?.response?.data?.error || "Something went wrong"))
        .finally(() => setSubmitting(false));
    },
  });

  return (
    <>
      <div className="modal fade show d-block" id="kt_modal_add_dashboard" role="dialog" tabIndex={-1} aria-modal="true">
        {/* begin::Modal dialog */}
        <div className="modal-dialog modal-dialog-centered mw-900px">
          {/* begin::Modal content */}
          <div className="modal-content">
            <div className="modal-header d-flex justify-content-between align-items-center">
              {/* begin::Modal title */}
              <h2 className="fw-bolder">Edit Dashboard</h2>
              {/* end::Modal title */}

              {/* begin::Close */}
              <div className="btn btn-icon btn-sm btn-active-icon-primary" data-kt-dashboard-modal-action="close" onClick={onCloseEditDashboard} style={{ cursor: "pointer" }}>
                <KTIcon iconName="cross" className="fs-1" />
              </div>
              {/* end::Close */}
            </div>
            {/* begin::Modal body */}
            <div className="modal-body mx-5 mx-xl-15 my-7">
              <form id="kt_modal_add_dashboard_form" className="form" onSubmit={formik.handleSubmit} noValidate>
                {/* begin::Scroll */}
                <div className="d-flex flex-column me-n7 pe-7">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="fv-row text-start mb-6">
                        <label className="required fw-bold fs-6 mb-2">Name</label>
                        <input
                          {...formik.getFieldProps("name")}
                          type="text"
                          name="name"
                          placeholder="Dashboard Name"
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
                              <span role="alert">{typeof formik.errors.name === "string" ? formik.errors.name : ""}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="fv-row text-start mb-6">
                        <label className="fw-bold fs-6 mb-2">Description</label>
                        <textarea
                          {...formik.getFieldProps("description")}
                          rows={4}
                          name="description"
                          placeholder="Dashboard Description"
                          className="form-control mb-3 mb-lg-0"
                          autoComplete="off"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* begin::Actions */}
                <div className="text-center pt-15">
                  <button type="reset" onClick={onCloseEditDashboard} className="btn btn-light me-3" data-kt-dashboard-modal-action="cancel" disabled={formik.isSubmitting}>
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

export { EditDashboard };
