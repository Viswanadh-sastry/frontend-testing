import { useFormik } from "formik";
import { toast } from "react-toastify";
import { KTIcon, MetadataInputFields } from "../../../../../../_metronic/helpers";
import { updateThing } from "../../../api/ThingAPI";

interface IEditMetadataProps {
  data: {
    id: string;
    metadata: any;
  };
  onClose: () => void;
  onDisplay: () => void;
}

const EditMetadata = ({ data, onClose, onDisplay }: IEditMetadataProps) => {
  const formik = useFormik({
    initialValues: {
      metadata: data?.metadata || {
        "": "",
      },
    },
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      if (!isValidateMetadata(values.metadata)) {
        toast.warn("Invalid metadata format");
        setSubmitting(false);
        return;
      }
      updateThing(data.id, values)
        .then(() => {
          toast.success("Metadata updated successfully");
          onClose();
          onDisplay();
        })
        .catch((error) => toast.error(error?.response?.data?.message || "Something went wrong"))
        .finally(() => setSubmitting(false));
    },
  });

  const isValidateMetadata = (metadata: any) => {
    if (!metadata || Object.keys(metadata).length === 0) {
      return true;
    }

    return Object.keys(metadata).every((key) => {
      if (key.toLowerCase() === "phone_number") {
        return /^\d{10}$/.test(metadata[key]) && metadata[key] !== "0000000000";
      }
      if (key.toLowerCase() === "update_frequency") {
        return /^\d+$/.test(metadata[key]) && parseInt(metadata[key]) !== 0;
      }
      return true;
    });
  };

  return (
    <>
      <div className="modal fade show d-block" id="kt_modal_add_user" role="dialog" tabIndex={-1} aria-modal="true">
        {/* begin::Modal dialog */}
        <div className="modal-dialog modal-dialog-centered mw-600px">
          {/* begin::Modal content */}
          <div className="modal-content">
            <div className="modal-header d-flex justify-content-between align-items-center">
              {/* begin::Modal title */}
              <h2 className="fw-bolder">Edit Metadata</h2>
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
                    {/* Metadata */}
                    <div className="col-md-12">
                      <div className="fv-row mb-6">
                        <label className="fw-bold fs-6 mb-2">Metadata</label>
                        <MetadataInputFields metadata={formik.values.metadata} setMetadata={(metadata: any) => formik.setFieldValue("metadata", metadata)} />
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

export { EditMetadata };
