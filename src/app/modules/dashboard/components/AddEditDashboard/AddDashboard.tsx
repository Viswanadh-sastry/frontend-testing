import clsx from "clsx";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import * as Yup from "yup";
import { KTIcon } from "../../../../../_metronic/helpers";
import { useAuth } from "../../../auth";
import { updateDashboard } from "../../api/DashboardAPI";
import { addDashboard } from "../../api/DashboardHelper";

interface IAddDashboardProps {
  onCloseAddDashboard: () => void;
  onGetDashboardList: () => void;
}

const AddDashboard = ({ onCloseAddDashboard, onGetDashboardList }: IAddDashboardProps) => {
  const { currentUser } = useAuth();
  const { id: userId } = currentUser || { id: "" };
  const dashboardSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    description: Yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
    },
    validationSchema: dashboardSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const payload = addDashboard({
        id: uuidv4(),
        ...values,
        layout: "",
        data: {
          widgets: [],
        },
      });
      updateDashboard(userId, payload)
        .then(() => {
          toast.success("Dashboard created successfully");
          onCloseAddDashboard();
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
              <h2 className="fw-bolder">Add New Dashboard</h2>
              {/* end::Modal title */}

              {/* begin::Close */}
              <div className="btn btn-icon btn-sm btn-active-icon-primary" data-kt-dashboard-modal-action="close" onClick={onCloseAddDashboard} style={{ cursor: "pointer" }}>
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
                      <div className="fv-row mb-6">
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
                              <span role="alert">{formik.errors.name}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="fv-row mb-6">
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
                  <button type="reset" onClick={onCloseAddDashboard} className="btn btn-light me-3" data-kt-dashboard-modal-action="cancel" disabled={formik.isSubmitting}>
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

export { AddDashboard };
