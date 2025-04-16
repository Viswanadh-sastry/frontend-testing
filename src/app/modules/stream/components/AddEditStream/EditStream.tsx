import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { useFormik } from "formik";
import { useMemo } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { KTIcon } from "../../../../../_metronic/helpers";
import { updateStream, getStream, getStreamList } from "../../api/StreamAPI";

interface IEditStreamProps {
  row: any;
  onCloseEditStream: () => void;
}

const EditStream = ({ row, onCloseEditStream }: IEditStreamProps) => {
  const streamListQuery = useQuery({
    queryKey: [`streamList`],
    queryFn: async () => getStreamList().catch((error) => toast.error(error?.response?.data?.message || "Something went wrong")),
    enabled: false,
  });
  const streamQuery = useQuery({
    queryKey: [`stream`, row.original.name],
    queryFn: async () => getStream(row.original.name).catch((error) => toast.error(error?.response?.data?.message || "Something went wrong")),
    enabled: true,
  });
  const stream = useMemo(() => streamQuery.data || {}, [streamQuery.data]);

  const streamSchema = Yup.object().shape({
    sql: Yup.string().required("Query is required"),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      sql: `CREATE STREAM ${stream?.Name} () WITH ( FORMAT = "${stream?.Options?.format}", TYPE = "${stream?.Options?.type}" )`,
    },
    validationSchema: streamSchema,
    onSubmit: async (values, { setSubmitting }) => {
      updateStream(stream.Name, values)
        .then(() => {
          toast.success("Stream updated successfully");
          onCloseEditStream();
          streamListQuery.refetch();
        })
        .catch((error) => toast.error(error?.response?.data?.message || "Something went wrong"))
        .finally(() => setSubmitting(false));
    },
  });

  return (
    <>
      <div className="text-start modal fade show d-block" id="kt_modal_edit_stream" role="dialog" tabIndex={-1} aria-modal="true">
        {/* begin::Modal dialog */}
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable mw-900px mh-900px">
          {/* begin::Modal content */}
          <div className="modal-content">
            <div className="modal-header d-flex justify-content-between align-items-center">
              {/* begin::Modal title */}
              <h2 className="fw-bolder">Edit Stream</h2>
              {/* end::Modal title */}

              {/* begin::Close */}
              <div className="btn btn-icon btn-sm btn-active-icon-primary cursor-pointer" data-kt-stream-modal-action="close" onClick={onCloseEditStream}>
                <KTIcon iconName="cross" className="fs-1" />
              </div>
              {/* end::Close */}
            </div>
            {/* begin::Modal body */}
            <div className="modal-body mx-5 mx-xl-15 my-7">
              <form id="kt_modal_edit_stream_form" className="form" onSubmit={formik.handleSubmit} noValidate>
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
                  <button type="reset" onClick={onCloseEditStream} className="btn btn-light me-3" data-kt-stream-modal-action="cancel" disabled={formik.isSubmitting}>
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

export { EditStream };
