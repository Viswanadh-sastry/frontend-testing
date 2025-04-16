import clsx from "clsx";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { KTIcon } from "../../../../../../_metronic/helpers";
import { updateChannel } from "../../../api/ChannelsAPI";

interface IEditDescriptionProps {
  data: {
    id: string;
    description: string;
  };
  onClose: () => void;
  onDisplay: () => void;
}

const EditDescription = ({ data, onClose, onDisplay }: IEditDescriptionProps) => {
  const formik = useFormik({
    initialValues: {
      description: data.description,
    },
    enableReinitialize: true,
    validationSchema: Yup.object().shape({
      description: Yup.string().required("Description is required."),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      updateChannel(data.id, values)
        .then(() => {
          toast.success("Description updated successfully");
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
              <h2 className="fw-bolder">Edit Description</h2>
              {/* end::Modal title */}

              {/* begin::Close */}
              <div className="btn btn-icon btn-sm btn-active-icon-primary cursor-pointer" data-kt-users-modal-action="close" onClick={onClose}>
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
                    {/* Object Type Name */}
                    <div className="col-md-12">
                      <div className="fv-row mb-6">
                        <label className="required fw-bold fs-6 mb-2">Description</label>
                        <input
                          {...formik.getFieldProps("description")}
                          type="text"
                          name="description"
                          className={clsx(
                            "form-control mb-3 mb-lg-0",
                            { "is-invalid": formik.touched.description && formik.errors.description },
                            { "is-valid": formik.touched.description && !formik.errors.description }
                          )}
                          autoComplete="off"
                        />
                        {formik.touched.description && formik.errors.description && (
                          <div className="fv-plugins-message-container">
                            <div className="fv-help-block">
                              <span role="alert">{formik.errors.description}</span>
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

export { EditDescription };
