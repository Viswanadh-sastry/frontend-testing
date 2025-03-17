import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { useFormik } from "formik";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { KTCard, KTCardBody, SinkInputFields } from "../../../../../_metronic/helpers";
import { getRule, updateRule } from "../../api/RuleAPI";
import { Rule, SinkConfig } from "../../api/_models";
import QueryBuilder from "./QueryBuilder";

const EditRule = () => {
  const params = useParams();
  const navigate = useNavigate();
  const name = params.name as string;
  const [showQueryBuilder, setShowQueryBuilder] = useState(false);
  const ruleQuery = useQuery({
    queryKey: [`rule`, name],
    queryFn: async () => getRule(name).catch((error) => toast.error(error?.response?.data?.error || "Something went wrong")),
    enabled: true,
  });
  const rule = useMemo(() => ruleQuery.data || {}, [ruleQuery.data]);

  const ruleSchema = Yup.object().shape({
    id: Yup.string().required("Name is required"),
    sql: Yup.string().required("SQL is required"),
    sink: Yup.array().min(1, "Sink is required"),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: rule?.id || "",
      sql: rule?.sql || "",
      sink:
        rule?.actions?.map((action: any) => {
          // const sinkType = Object.keys(action)[0] as string;
          const sinkType = "REST";
          const sinkConfig = Object.values(action)[0] as SinkConfig;
          return {
            dataTemplate: sinkConfig?.dataTemplate || "",
            headers: sinkConfig?.headers || {},
            method: sinkConfig?.method || "GET",
            sendSingle: sinkConfig?.sendSingle || false,
            url: sinkConfig?.url || "",
            sinkType,
          };
        }) || null,
    } as Rule,
    validationSchema: ruleSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const data = {
        // triggered: false,
        id: values.id,
        sql: values.sql,
        actions: values.sink.map((sink: SinkConfig) => ({
          [sink.sinkType]: {
            // bodyType: "JSON",
            // debugResp: true,
            // header: {
            //   "Content-Type": "application/json",
            // },
            url: sink?.url,
            method: sink?.method,
            dataTemplate: sink?.dataTemplate,
            headers: sink?.headers,
            sendSingle: sink?.sendSingle,
          },
        })),
      };
      updateRule(name, data)
        .then(() => {
          toast.success("Rule updated successfully");
          navigate("/rule");
        })
        .catch((error) => toast.error(error?.response?.data?.error || "Something went wrong"))
        .finally(() => setSubmitting(false));
    },
  });

  const onBackEditRule = () => {
    navigate("/rule");
  };

  return (
    <KTCard>
      <KTCardBody className="py-4">
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
                    className={clsx("form-control mb-3 mb-lg-0", { "is-invalid": formik.touched.id && formik.errors.id }, { "is-valid": formik.touched.id && !formik.errors.id })}
                    autoComplete="off"
                    readOnly
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
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <label className="required fw-bold fs-6 mb-2">SQL</label>
                    <button
                      type="button"
                      className="btn btn-light-primary"
                      data-kt-element="query-builder"
                      title="Query Builder"
                      onClick={() => setShowQueryBuilder(!showQueryBuilder)}
                    >
                      Query Builder
                    </button>
                  </div>
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
            {formik.values.sink && (
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
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* end::Scroll */}

          {/* begin::Actions */}
          <div className="text-center pt-15">
            <button type="reset" onClick={onBackEditRule} className="btn btn-light me-3" data-kt-rule-modal-action="cancel" disabled={formik.isSubmitting}>
              Back
            </button>
            <button type="submit" className="btn btn-primary" disabled={formik.isSubmitting}>
              <span className="indicator-label">Submit</span>
            </button>
          </div>
          {/* end::Actions */}
        </form>
        {showQueryBuilder && <QueryBuilder onCloseQueryBuilder={() => setShowQueryBuilder(false)} />}
      </KTCardBody>
    </KTCard>
  );
};

export { EditRule };
