import clsx from "clsx";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { ConditionInputFields, KTIcon } from "../../../../../_metronic/helpers";

interface IQueryBuilderProps {
  onCloseQueryBuilder: () => void;
}

const QueryBuilder = ({ onCloseQueryBuilder }: IQueryBuilderProps) => {
  const queryBuilderSchema = Yup.object().shape({
    entity: Yup.string().required("Device Type is required"),
    filterCondition: Yup.array().of(
      Yup.object().shape({
        device: Yup.string().required("Device is required"),
        parameter: Yup.string().required("Parameter is required"),
        isCondition: Yup.boolean().required("Condition is required"),
        isAndOrCondition: Yup.boolean(),
        conditions: Yup.array(),
      })
    ),
  });

  const formik = useFormik({
    initialValues: {
      entity: "",
      filterCondition: [
        {
          device: "",
          parameter: "",
          isCondition: true,
          isAndOrCondition: false,
          conditions: [
            {
              conditionText: "",
              conditionValue: "",
            },
          ],
        },
      ],
    },
    validationSchema: queryBuilderSchema,
    onSubmit: (values, { setSubmitting }) => {
      // Update state
      setSubmitting(false);
      // Close modal
      onCloseQueryBuilder();
      // Show notification
      toast.success("Query Builder has been added.");
    },
  });

  return (
    <>
      <div className="modal fade show d-block" id="kt_modal_add_query_builder" role="dialog" tabIndex={-1} aria-modal="true">
        {/* begin::Modal dialog */}
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable mw-900px mh-900px">
          {/* begin::Modal content */}
          <div className="modal-content">
            <div className="modal-header d-flex justify-content-between align-items-center">
              {/* begin::Modal title */}
              <h2 className="fw-bolder">Generate Query Builder</h2>
              {/* end::Modal title */}

              {/* begin::Close */}
              <div className="btn btn-icon btn-sm btn-active-icon-primary" data-kt-query-builder-modal-action="close" onClick={onCloseQueryBuilder} style={{ cursor: "pointer" }}>
                <KTIcon iconName="cross" className="fs-1" />
              </div>
              {/* end::Close */}
            </div>
            {/* begin::Modal body */}
            <div className="modal-body mx-5 mx-xl-15 my-7">
              <form id="kt_modal_add_query_builder_form" className="form" onSubmit={formik.handleSubmit} noValidate>
                {/* begin::Scroll */}
                <div className="d-flex flex-column me-n7 pe-7">
                  <div className="row">
                    {/* Entity */}
                    <div className="col-md-12">
                      <div className="fv-row mb-6">
                        <label className="fw-bold fs-6 mb-2">Entity</label>
                        <select
                          {...formik.getFieldProps("entity")}
                          className={clsx(
                            "form-select form-select form-select-lg",
                            { "is-invalid": formik.touched.entity && formik.errors.entity },
                            { "is-valid": formik.touched.entity && !formik.errors.entity }
                          )}
                        >
                          <option value="">Select</option>
                          <option value="Asset">Asset</option>
                          <option value="Device">Device</option>
                        </select>
                        {formik.touched.entity && formik.errors.entity && (
                          <div className="fv-plugins-message-container">
                            <div className="fv-help-block">
                              <span role="alert">{formik.errors.entity}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {formik.values.filterCondition.map((conditions, index) => (
                    <>
                      {index > 0 && (
                        <div className="row my-3" key={index}>
                          <div className="col-md-12 d-flex justify-content-center align-items-center">
                            <div className="form-check form-switch form-check-custom form-check-solid me-10">
                              <input
                                type="checkbox"
                                id={`and-or-condition-${index}`}
                                checked={formik.values.filterCondition[index].isAndOrCondition}
                                onChange={() => formik.setFieldValue(`filterCondition.${index}.isAndOrCondition`, !formik.values.filterCondition[index].isAndOrCondition)}
                                className="form-check-input h-30px w-50px"
                              />
                              <label htmlFor={`and-or-condition-${index}`} className="form-check-label">
                                {formik.values.filterCondition[index].isAndOrCondition ? "AND" : "OR"}
                              </label>
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="row" key={index}>
                        {/* Device */}
                        <div className="col-md-12">
                          <div className="card card-custom gutter-b">
                            <div className="card-header d-flex justify-content-between align-items-center">
                              <h4 className="card-title font-weight-bold">Filter Condition</h4>
                              <button
                                className="btn btn-light-danger btn-sm"
                                onClick={() => {
                                  const newArray = [...formik.values.filterCondition];
                                  newArray.splice(index, 1);
                                  formik.setFieldValue("filterCondition", newArray);
                                }}
                              >
                                <i className="bi bi-trash p-0"></i>
                              </button>
                            </div>
                            <div className="card-body">
                              <select
                                {...formik.getFieldProps(`filterCondition.${index}.device`)}
                                className={clsx(
                                  "form-select form-select form-select-lg",
                                  {
                                    "is-invalid":
                                      formik.touched.filterCondition?.[index]?.device &&
                                      typeof formik.errors.filterCondition?.[index] === "object" &&
                                      formik.errors.filterCondition?.[index]?.device,
                                  },
                                  {
                                    "is-valid":
                                      formik.touched.filterCondition?.[index]?.device &&
                                      typeof formik.errors.filterCondition?.[index] === "object" &&
                                      !formik.errors.filterCondition?.[index]?.device,
                                  }
                                )}
                              >
                                <option>Select Asset/Device</option>
                              </select>
                              {formik.touched.filterCondition?.[index]?.device &&
                                typeof formik.errors.filterCondition?.[index] === "object" &&
                                formik.errors.filterCondition?.[index]?.device && (
                                  <div className="fv-plugins-message-container">
                                    <div className="fv-help-block">
                                      <span role="alert">{formik.errors.filterCondition?.[index]?.device}</span>
                                    </div>
                                  </div>
                                )}
                              <select
                                {...formik.getFieldProps(`filterCondition.${index}.parameter`)}
                                className={clsx(
                                  "form-select form-select form-select-lg mt-3",
                                  {
                                    "is-invalid":
                                      formik.touched.filterCondition?.[index]?.parameter &&
                                      typeof formik.errors.filterCondition?.[index] === "object" &&
                                      formik.errors.filterCondition?.[index]?.parameter,
                                  },
                                  {
                                    "is-valid":
                                      formik.touched.filterCondition?.[index]?.parameter &&
                                      typeof formik.errors.filterCondition?.[index] === "object" &&
                                      !formik.errors.filterCondition?.[index]?.parameter,
                                  }
                                )}
                              >
                                <option>Select Parameter (Type of Sensor)</option>
                              </select>
                              {formik.touched.filterCondition?.[index]?.parameter &&
                                typeof formik.errors.filterCondition?.[index] === "object" &&
                                formik.errors.filterCondition?.[index]?.parameter && (
                                  <div className="fv-plugins-message-container">
                                    <div className="fv-help-block">
                                      <span role="alert">{formik.errors.filterCondition?.[index]?.parameter}</span>
                                    </div>
                                  </div>
                                )}
                              <div className="mt-3">
                                <div className="form-check form-check-inline">
                                  <input
                                    type="radio"
                                    id={`static-${index}`}
                                    name={`static-${index}`}
                                    checked={formik.values.filterCondition[index].isCondition}
                                    onChange={() => formik.setFieldValue(`filterCondition.${index}.isCondition`, true)}
                                    className="form-check-input"
                                  />
                                  <label htmlFor={`static-${index}`} className="form-check-label">
                                    Static
                                  </label>
                                </div>
                                <div className="form-check form-check-inline">
                                  <input
                                    type="radio"
                                    id={`dynamic-${index}`}
                                    name={`dynamic-${index}`}
                                    checked={!formik.values.filterCondition[index].isCondition}
                                    onChange={() => formik.setFieldValue(`filterCondition.${index}.isCondition`, false)}
                                    className="form-check-input"
                                  />
                                  <label htmlFor={`dynamic-${index}`} className="form-check-label">
                                    Dynamic
                                  </label>
                                </div>
                              </div>
                              {formik.values.filterCondition[index].isCondition && (
                                <div className="mt-3">
                                  <ConditionInputFields
                                    conditions={formik.values.filterCondition[index].conditions}
                                    setConditions={(value: any) => formik.setFieldValue(`filterCondition.${index}.conditions`, value)}
                                  />
                                </div>
                              )}
                              {!formik.values.filterCondition[index].isCondition && (
                                <div className="mt-3">
                                  <select
                                    {...formik.getFieldProps(`filterCondition.${index}.device`)}
                                    className={clsx(
                                      "form-select form-select form-select-lg",
                                      {
                                        "is-invalid":
                                          formik.touched.filterCondition?.[index]?.device &&
                                          typeof formik.errors.filterCondition?.[index] === "object" &&
                                          formik.errors.filterCondition?.[index]?.device,
                                      },
                                      {
                                        "is-valid":
                                          formik.touched.filterCondition?.[index]?.device &&
                                          typeof formik.errors.filterCondition?.[index] === "object" &&
                                          !formik.errors.filterCondition?.[index]?.device,
                                      }
                                    )}
                                  >
                                    <option>Select Asset/Device</option>
                                  </select>
                                  {formik.touched.filterCondition?.[index]?.device &&
                                    typeof formik.errors.filterCondition?.[index] === "object" &&
                                    formik.errors.filterCondition?.[index]?.device && (
                                      <div className="fv-plugins-message-container">
                                        <div className="fv-help-block">
                                          <span role="alert">{formik.errors.filterCondition?.[index]?.device}</span>
                                        </div>
                                      </div>
                                    )}
                                  <select
                                    {...formik.getFieldProps(`filterCondition.${index}.parameter`)}
                                    className={clsx(
                                      "form-select form-select form-select-lg mt-3",
                                      {
                                        "is-invalid":
                                          formik.touched.filterCondition?.[index]?.parameter &&
                                          typeof formik.errors.filterCondition?.[index] === "object" &&
                                          formik.errors.filterCondition?.[index]?.parameter,
                                      },
                                      {
                                        "is-valid":
                                          formik.touched.filterCondition?.[index]?.parameter &&
                                          typeof formik.errors.filterCondition?.[index] === "object" &&
                                          !formik.errors.filterCondition?.[index]?.parameter,
                                      }
                                    )}
                                  >
                                    <option>Select Parameter (Type of Sensor)</option>
                                  </select>
                                  {formik.touched.filterCondition?.[index]?.parameter &&
                                    typeof formik.errors.filterCondition?.[index] === "object" &&
                                    formik.errors.filterCondition?.[index]?.parameter && (
                                      <div className="fv-plugins-message-container">
                                        <div className="fv-help-block">
                                          <span role="alert">{formik.errors.filterCondition?.[index]?.parameter}</span>
                                        </div>
                                      </div>
                                    )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ))}
                  <div className="row">
                    <div className="col-md-12">
                      <button
                        type="button"
                        className="btn btn-light-primary mt-3 w-100"
                        onClick={() =>
                          formik.setFieldValue("filterCondition", [
                            ...formik.values.filterCondition,
                            {
                              device: "",
                              parameter: "",
                              isCondition: true,
                              conditions: [
                                {
                                  conditionText: "",
                                  conditionValue: "",
                                },
                              ],
                            },
                          ])
                        }
                      >
                        + Add Filter
                      </button>
                    </div>
                  </div>
                </div>

                {/* begin::Actions */}
                <div className="text-center pt-15">
                  <button type="reset" onClick={onCloseQueryBuilder} className="btn btn-light me-3" data-kt-query-builder-modal-action="cancel" disabled={formik.isSubmitting}>
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

export default QueryBuilder;
