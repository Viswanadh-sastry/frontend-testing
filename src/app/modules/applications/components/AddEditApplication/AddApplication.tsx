import clsx from "clsx";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { KTCard, KTCardBody, TagInputFields } from "../../../../../_metronic/helpers";
import { getLORAAuth } from "../../../auth/core/LORAHelpers";
import { addApplication } from "../../api/ApplicationAPI";

const AddApplication = () => {
  const navigate = useNavigate();
  const applicationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    description: Yup.string(),
    tags: Yup.object(),
  });

  const formik = useFormik({
    initialValues: {
      tenantId: getLORAAuth()?.tenant_id,
      name: "",
      description: "",
      tags: {},
    },
    validationSchema: applicationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const data = {
        application: {
          tenantId: values.tenantId,
          name: values.name,
          description: values.description,
          tags: values.tags,
        },
      };
      addApplication(data)
        .then(() => {
          toast.success("Application created successfully");
          navigate("/applications");
        })
        .catch((error) => toast.error(error.message))
        .finally(() => setSubmitting(false));
    },
  });

  const onCloseBackAddApplication = () => {
    navigate("/applications");
  };

  return (
    <KTCard>
      <KTCardBody className="py-4">
        <form className="form" onSubmit={formik.handleSubmit} noValidate>
          <ul className="nav nav-tabs nav-line-tabs mb-5 fs-6">
            <li className="nav-item">
              <a className="nav-link active" data-bs-toggle="tab" href="#kt_tab_general">
                General
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" data-bs-toggle="tab" href="#kt_tab_tags">
                Tags
              </a>
            </li>
          </ul>
          <div className="tab-content" id="myTabContent">
            <div className="tab-pane fade show active" id="kt_tab_general" role="tabpanel">
              <div className="d-flex flex-column me-n7 pe-7">
                <div className="row">
                  {/* Name */}
                  <div className="col-md-12">
                    <div className="fv-row mb-6">
                      <label className="required fw-bold fs-6 mb-2">Name</label>
                      <input
                        {...formik.getFieldProps("name")}
                        type="text"
                        name="name"
                        placeholder="Enter name"
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
                  {/* Description */}
                  <div className="col-md-12">
                    <div className="fv-row mb-6">
                      <label className="fw-bold fs-6 mb-2">Description</label>
                      <textarea
                        {...formik.getFieldProps("description")}
                        className={clsx(
                          "form-control mb-3 mb-lg-0",
                          { "is-invalid": formik.touched.description && formik.errors.description },
                          { "is-valid": formik.touched.description && !formik.errors.description }
                        )}
                        placeholder="Enter description"
                        autoComplete="off"
                        rows={3}
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="tab-pane fade" id="kt_tab_tags" role="tabpanel">
              <div className="d-flex flex-column me-n7 pe-7">
                <div className="row">
                  {/* Tags */}
                  <div className="col-md-12">
                    <div className="fv-row mb-6">
                      <label className="fw-bold fs-6 mb-2">Tags</label>
                      <TagInputFields tags={formik.values.tags} setTags={(tags: any) => formik.setFieldValue("tags", tags)} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* begin::Actions */}
          <div className="text-center pt-15">
            <button type="reset" onClick={onCloseBackAddApplication} className="btn btn-light me-3" data-kt-subscription-modal-action="cancel" disabled={formik.isSubmitting}>
              Back
            </button>
            <button type="submit" className="btn btn-primary">
              <span className="indicator-label">Submit</span>
            </button>
          </div>
          {/* end::Actions */}
        </form>
      </KTCardBody>
    </KTCard>
  );
};

export { AddApplication };
