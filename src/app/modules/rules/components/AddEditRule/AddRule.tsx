import clsx from "clsx";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { KTIcon, SinkInputFields } from "../../../../../_metronic/helpers";
import { addRule } from "../../api/RuleAPI";
import { Rule, SinkConfig } from "../../api/_models";

interface IAddRuleProps {
  onCloseAddRule: () => void;
  onGetRuleList: () => void;
}

const AddRule = ({ onCloseAddRule, onGetRuleList }: IAddRuleProps) => {
  const ruleSchema = Yup.object().shape({
    id: Yup.string().required("Name is required"),
    sql: Yup.string().required("SQL is required"),
    sink: Yup.array().min(1, "Sink is required"),
  });

  const formik = useFormik({
    initialValues: {
      id: "",
      sql: "",
      sink: [],
    } as Rule,
    validationSchema: ruleSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const data = {
        id: values.id,
        sql: values.sql,
        actions: values.sink.map((sink: SinkConfig) => ({
          [sink.sinkType]: {
            url: sink?.url,
            method: sink?.method,
            dataTemplate: sink?.dataTemplate,
            headers: sink?.headers,
            sendSingle: sink?.sendSingle,
          },
        })),
      };
      addRule(data)
        .then(() => {
          toast.success("Rule created successfully");
          onCloseAddRule();
          onGetRuleList();
        })
        .catch((error) => toast.error(error.message))
        .finally(() => setSubmitting(false));
    },
  });

  return (
    <>
      <div className="modal fade show d-block" id="kt_modal_add_rule" role="dialog" tabIndex={-1} aria-modal="true">
        {/* begin::Modal dialog */}
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable mw-900px mh-900px">
          {/* begin::Modal content */}
          <div className="modal-content">
            <div className="modal-header d-flex justify-content-between align-items-center">
              {/* begin::Modal title */}
              <h2 className="fw-bolder">Add Rule</h2>
              {/* end::Modal title */}

              {/* begin::Close */}
              <div className="btn btn-icon btn-sm btn-active-icon-primary" data-kt-rule-modal-action="close" onClick={onCloseAddRule} style={{ cursor: "pointer" }}>
                <KTIcon iconName="cross" className="fs-1" />
              </div>
              {/* end::Close */}
            </div>
            {/* begin::Modal body */}
            <div className="modal-body mx-5 mx-xl-15 my-7">
              <form id="kt_modal_add_rule_form" className="form" onSubmit={formik.handleSubmit} noValidate>
                {/* begin::Scroll */}
                <div className="d-flex flex-column me-n7 pe-7">
                  <div className="row">
                    {/* Name */}
                    <div className="col-md-12">
                      <div className="fv-row mb-6">
                        <label className="required fw-bold fs-6 mb-2">Name</label>
                        <input
                          {...formik.getFieldProps("id")}
                          type="text"
                          name="id"
                          placeholder="Rule Name"
                          className={clsx(
                            "form-control mb-3 mb-lg-0",
                            { "is-invalid": formik.touched.id && formik.errors.id },
                            { "is-valid": formik.touched.id && !formik.errors.id }
                          )}
                          autoComplete="off"
                        />
                        {formik.touched.id && formik.errors.id && (
                          <div className="fv-plugins-message-container">
                            <div className="fv-help-block">
                              <span role="alert">{formik.errors.id}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    {/* SQL */}
                    <div className="col-md-12">
                      <div className="fv-row mb-6">
                        <label className="required fw-bold fs-6 mb-2">SQL</label>
                        <textarea
                          {...formik.getFieldProps("sql")}
                          rows={10}
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
                  <div className="row">
                    {/* Sink */}
                    <div className="col-md-12">
                      <div className="fv-row mb-6">
                        <label className="required fw-bold fs-6 mb-2">Sink</label>
                        <SinkInputFields sink={formik.values.sink} setSink={(sink: SinkConfig[]) => formik.setFieldValue("sink", sink)} />
                        {formik.touched.sink && formik.errors.sink && (
                          <div className="fv-plugins-message-container">
                            <div className="fv-help-block">
                              <span role="alert">{Array.isArray(formik.errors.sink) ? formik.errors.sink.join(", ") : formik.errors.sink}</span>
                            </div>
                          </div>
                        )}
                        {/* {formik.values.sink.map((sink: SinkConfig, index: number) => (
                          <div key={index} className="border border-dashed border-gray-300 rounded p-5 mb-5">
                            <div className="row">
                              <div className="col-md-6">
                                <div className="fv-row mb-6">
                                  <label className="required fw-bold fs-6 mb-2">Sink Type</label>
                                  <select
                                    {...formik.getFieldProps(`sink.${index}.sinkType`)}
                                    className={clsx(
                                      "form-select form-select-solid form-select-lg",
                                      {
                                        "is-invalid":
                                          (formik.touched.sink as FormikErrors<SinkConfig>[])[index]?.sinkType &&
                                          (formik.errors.sink as FormikErrors<SinkConfig>[])[index]?.sinkType,
                                      },
                                      {
                                        "is-valid":
                                          (formik.touched.sink as FormikErrors<SinkConfig>[])[index]?.sinkType &&
                                          !(formik.errors.sink as FormikErrors<SinkConfig>[])[index]?.sinkType,
                                      }
                                    )}
                                  >
                                    <option value="">Select Sink Type</option>
                                    <option value="rest">REST</option>
                                  </select>
                                  {(formik.touched.sink as FormikErrors<SinkConfig>[])[index]?.sinkType && (formik.errors.sink as FormikErrors<SinkConfig>[])[index]?.sinkType && (
                                    <div className="fv-plugins-message-container">
                                      <div className="fv-help-block">
                                        <span role="alert">{(formik.errors.sink as FormikErrors<SinkConfig>[])[index]?.sinkType}</span>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="fv-row mb-6">
                                  <label className="required fw-bold fs-6 mb-2">URL</label>
                                  <input
                                    {...formik.getFieldProps(`sink.${index}.restConfig.url`)}
                                    type="text"
                                    name={`sink.${index}.restConfig.url`}
                                    placeholder="Enter URL"
                                    className={clsx(
                                      "form-control mb-3 mb-lg-0",
                                      {
                                        "is-invalid":
                                          (formik.touched.sink as FormikErrors<SinkConfig>[])[index]?.restConfig?.url &&
                                          (formik.errors.sink as FormikErrors<SinkConfig>[])[index]?.restConfig?.url,
                                      },
                                      {
                                        "is-valid":
                                          (formik.touched.sink as FormikErrors<SinkConfig>[])[index]?.restConfig?.url &&
                                          !(formik.errors.sink as FormikErrors<SinkConfig>[])[index]?.restConfig?.url,
                                      }
                                    )}
                                    autoComplete="off"
                                  />
                                  {(formik.touched.sink as FormikErrors<SinkConfig>[])[index]?.restConfig?.url &&
                                    (formik.errors.sink as FormikErrors<SinkConfig>[])[index]?.restConfig?.url && (
                                      <div className="fv-plugins-message-container">
                                        <div className="fv-help-block">
                                          <span role="alert">{(formik.errors.sink as FormikErrors<SinkConfig>[])[index]?.restConfig?.url}</span>
                                        </div>
                                      </div>
                                    )}
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="fv-row mb-6">
                                  <label className="required fw-bold fs-6 mb-2">Method</label>
                                  <input
                                    {...formik.getFieldProps(`sink.${index}.restConfig.method`)}
                                    type="text"
                                    name={`sink.${index}.restConfig.method`}
                                    placeholder="Enter Method"
                                    className={clsx(
                                      "form-control mb-3 mb-lg-0",
                                      {
                                        "is-invalid":
                                          (formik.touched.sink as FormikErrors<SinkConfig>[])[index]?.restConfig?.method &&
                                          (formik.errors.sink as FormikErrors<SinkConfig>[])[index]?.restConfig?.method,
                                      },
                                      {
                                        "is-valid":
                                          (formik.touched.sink as FormikErrors<SinkConfig>[])[index]?.restConfig?.method &&
                                          !(formik.errors.sink as FormikErrors<SinkConfig>[])[index]?.restConfig?.method,
                                      }
                                    )}
                                    autoComplete="off"
                                  />
                                  {(formik.touched.sink as FormikErrors<SinkConfig>[])[index]?.restConfig?.method &&
                                    (formik.errors.sink as FormikErrors<SinkConfig>[])[index]?.restConfig?.method && (
                                      <div className="fv-plugins-message-container">
                                        <div className="fv-help-block">
                                          <span role="alert">{(formik.errors.sink as FormikErrors<SinkConfig>[])[index]?.restConfig?.method}</span>
                                        </div>
                                      </div>
                                    )}
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="fv-row mb-6">
                                  <label className="required fw-bold fs-6 mb-2">Data Template</label>
                                  <input
                                    {...formik.getFieldProps(`sink.${index}.restConfig.dataTemplate`)}
                                    type="text"
                                    name={`sink.${index}.restConfig.dataTemplate`}
                                    placeholder="Enter Data Template"
                                    className={clsx(
                                      "form-control mb-3 mb-lg-0",
                                      {
                                        "is-invalid":
                                          (formik.touched.sink as FormikErrors<SinkConfig>[])[index]?.restConfig?.dataTemplate &&
                                          (formik.errors.sink as FormikErrors<SinkConfig>[])[index]?.restConfig?.dataTemplate,
                                      },
                                      {
                                        "is-valid":
                                          (formik.touched.sink as FormikErrors<SinkConfig>[])[index]?.restConfig?.dataTemplate &&
                                          !(formik.errors.sink as FormikErrors<SinkConfig>[])[index]?.restConfig?.dataTemplate,
                                      }
                                    )}
                                    autoComplete="off"
                                  />
                                  {(formik.touched.sink as FormikErrors<SinkConfig>[])[index]?.restConfig?.dataTemplate &&
                                    (formik.errors.sink as FormikErrors<SinkConfig>[])[index]?.restConfig?.dataTemplate && (
                                      <div className="fv-plugins-message-container">
                                        <div className="fv-help-block">
                                          <span role="alert">{(formik.errors.sink as FormikErrors<SinkConfig>[])[index]?.restConfig?.dataTemplate}</span>
                                        </div>
                                      </div>
                                    )}
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="fv-row mb-6">
                                  <label className="required fw-bold fs-6 mb-2">Headers</label>
                                  <input
                                    {...formik.getFieldProps(`sink.${index}.restConfig.headers`)}
                                    type="text"
                                    name={`sink.${index}.restConfig.headers`}
                                    placeholder="Enter Headers"
                                    className={clsx(
                                      "form-control mb-3 mb-lg-0",
                                      {
                                        "is-invalid":
                                          (formik.touched.sink as FormikErrors<SinkConfig>[])[index]?.restConfig?.headers &&
                                          (formik.errors.sink as FormikErrors<SinkConfig>[])[index]?.restConfig?.headers,
                                      },
                                      {
                                        "is-valid":
                                          (formik.touched.sink as FormikErrors<SinkConfig>[])[index]?.restConfig?.headers &&
                                          !(formik.errors.sink as FormikErrors<SinkConfig>[])[index]?.restConfig?.headers,
                                      }
                                    )}
                                    autoComplete="off"
                                  />
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="fv-row mb-6">
                                  <label className="required fw-bold fs-6 mb-2">Send Single</label>
                                  <input
                                    {...formik.getFieldProps(`sink.${index}.restConfig.sendSingle`)}
                                    type="checkbox"
                                    name={`sink.${index}.restConfig.sendSingle`}
                                    className={clsx(
                                      "form-check-input mb-3 mb-lg-0",
                                      {
                                        "is-invalid":
                                          (formik.touched.sink as FormikErrors<SinkConfig>[])[index]?.restConfig?.sendSingle &&
                                          (formik.errors.sink as FormikErrors<SinkConfig>[])[index]?.restConfig?.sendSingle,
                                      },
                                      {
                                        "is-valid":
                                          (formik.touched.sink as FormikErrors<SinkConfig>[])[index]?.restConfig?.sendSingle &&
                                          !(formik.errors.sink as FormikErrors<SinkConfig>[])[index]?.restConfig?.sendSingle,
                                      }
                                    )}
                                    autoComplete="off"
                                  />
                                  {(formik.touched.sink as FormikErrors<SinkConfig>[])[index]?.restConfig?.sendSingle &&
                                    (formik.errors.sink as FormikErrors<SinkConfig>[])[index]?.restConfig?.sendSingle && (
                                      <div className="fv-plugins-message-container">
                                        <div className="fv-help-block">
                                          <span role="alert">{(formik.errors.sink as FormikErrors<SinkConfig>[])[index]?.restConfig?.sendSingle}</span>
                                        </div>
                                      </div>
                                    )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))} */}
                      </div>
                    </div>
                  </div>
                </div>
                {/* end::Scroll */}

                {/* begin::Actions */}
                <div className="text-center pt-15">
                  <button type="reset" onClick={onCloseAddRule} className="btn btn-light me-3" data-kt-rule-modal-action="cancel" disabled={formik.isSubmitting}>
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

export { AddRule };
