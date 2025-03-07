import clsx from "clsx";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { KTIcon } from "../../../../../_metronic/helpers";
import { addStream } from "../../api/StreamAPI";

interface IAddStreamProps {
  onCloseAddStream: () => void;
  onGetStreamList: () => void;
}

const AddStream = ({ onCloseAddStream, onGetStreamList }: IAddStreamProps) => {
  const streamSchema = Yup.object().shape({
    sql: Yup.string().required("Query is required"),
  });

  const formik = useFormik({
    initialValues: {
      sql: `CREATE STREAM EdgeXStream () WITH ( FORMAT = "JSON", TYPE = "edgex" )`,
    },
    validationSchema: streamSchema,
    onSubmit: async (values, { setSubmitting }) => {
      addStream(values)
        .then(() => {
          toast.success("Stream created successfully");
          onCloseAddStream();
          onGetStreamList();
        })
        .catch((error) => toast.error(error.message))
        .finally(() => setSubmitting(false));
    },
  });

  return (
    <>
      <div className="modal fade show d-block" id="kt_modal_add_stream" role="dialog" tabIndex={-1} aria-modal="true">
        {/* begin::Modal dialog */}
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable mw-900px mh-900px">
          {/* begin::Modal content */}
          <div className="modal-content">
            <div className="modal-header d-flex justify-content-between align-items-center">
              {/* begin::Modal title */}
              <h2 className="fw-bolder">Add Stream</h2>
              {/* end::Modal title */}

              {/* begin::Close */}
              <div className="btn btn-icon btn-sm btn-active-icon-primary" data-kt-stream-modal-action="close" onClick={onCloseAddStream} style={{ cursor: "pointer" }}>
                <KTIcon iconName="cross" className="fs-1" />
              </div>
              {/* end::Close */}
            </div>
            {/* begin::Modal body */}
            <div className="modal-body mx-5 mx-xl-15 my-7">
              <form id="kt_modal_add_stream_form" className="form" onSubmit={formik.handleSubmit} noValidate>
                {/* begin::Scroll */}
                <div className="d-flex flex-column me-n7 pe-7">
                  <div className="row">
                    {/* SQL */}
                    <div className="col-md-12">
                      <div className="fv-row mb-6">
                        <label className="required fw-bold fs-6 mb-2">SQL</label>
                        <textarea
                          {...formik.getFieldProps("sql")}
                          rows={15}
                          name="sql"
                          placeholder="Enter SQL"
                          className={clsx(
                            "form-control mb-3 mb-lg-0",
                            { "is-invalid": formik.touched.sql && formik.errors.sql },
                            { "is-valid": formik.touched.sql && !formik.errors.sql }
                          )}
                          autoComplete="off"
                        />
                        {formik.touched.sql && formik.errors.sql && (
                          <div className="fv-plugins-message-container">
                            <div className="fv-help-block">
                              <span role="alert">{formik.errors.sql}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* begin::Actions */}
                <div className="text-center pt-15">
                  <button type="reset" onClick={onCloseAddStream} className="btn btn-light me-3" data-kt-stream-modal-action="cancel" disabled={formik.isSubmitting}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
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

export { AddStream };
