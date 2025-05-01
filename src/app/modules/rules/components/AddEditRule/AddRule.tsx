import clsx from "clsx";
import { useFormik } from "formik";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { KTCard, KTCardBody, SinkInputFields } from "../../../../../_metronic/helpers";
import { addRule } from "../../api/RuleAPI";
import { Rule, SinkConfig } from "../../api/_models";
import QueryBuilder from "./QueryBuilder";

const AddRule = () => {
  const navigate = useNavigate();
  const [showQueryBuilder, setShowQueryBuilder] = useState(false);
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
      options: {
        isEventTime: false,
        sendMetaToSink: false,
        sendError: true,
        qos: 0,
        debug: false,
        logFilename: "",
        lateTolerance: 1000,
        concurrency: 1,
        bufferLength: 1024,
        checkpointInterval: 300000,
        restartStrategy: {
          attempts: 0,
          delay: 1000,
          multiplier: 2,
          maxDelay: 30000,
          jitter: 0.1,
        },
        cron: "",
        duration: "",
        cronDatetimeRange: null,
      },
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
            bodyType: sink?.bodyType,
            dataTemplate: sink?.dataTemplate,
            headers: sink?.headers,
            timeout: sink?.timeout,
            debugResp: String(sink?.debugResp) === "true" || sink?.debugResp === true ? true : false,
            insecureSkipVerify: String(sink?.insecureSkipVerify) === "true" || sink?.insecureSkipVerify === true ? true : false,
            sendSingle: String(sink?.sendSingle) === "true" || sink?.sendSingle === true ? true : false,
            options: {
              concurrency: sink?.options?.concurrency,
              bufferLength: sink?.options?.bufferLength,
              retryInterval: sink?.options?.retryInterval,
              retryCount: sink?.options?.retryCount,
              cacheLength: sink?.options?.cacheLength,
              cacheSaveInterval: sink?.options?.cacheSaveInterval,
              runAsync: String(sink?.options?.runAsync) === "true" || sink?.options?.runAsync === true ? true : false,
              omitIfEmpty: String(sink?.options?.omitIfEmpty) === "true" || sink?.options?.omitIfEmpty === true ? true : false,
            },
          },
        })),
        options: {
          isEventTime: String(values.options?.isEventTime) === "true" || values.options?.isEventTime === true ? true : false,
          sendMetaToSink: String(values.options?.sendMetaToSink) === "true" || values.options?.sendMetaToSink === true ? true : false,
          sendError: String(values.options?.sendError) === "true" || values.options?.sendError === true ? true : false,
          qos: values.options?.qos,
          debug: false,
          logFilename: "",
          lateTolerance: values.options?.lateTolerance,
          concurrency: values.options?.concurrency,
          bufferLength: values.options?.bufferLength,
          checkpointInterval: values.options?.checkpointInterval,
          restartStrategy: {
            attempts: 0,
            delay: 1000,
            multiplier: 2,
            maxDelay: 30000,
            jitter: 0.1,
          },
          cron: "",
          duration: "",
          cronDatetimeRange: null,
        },
      };
      addRule(data)
        .then(() => {
          toast.success("Rule created successfully");
          navigate("/rule");
        })
        .catch((error) => toast.error(error?.response?.data?.message || "Something went wrong"))
        .finally(() => setSubmitting(false));
    },
  });

  const onBackAddRule = () => {
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
            <div className="row">
              <div className="col-md-12">
                <div className="accordion" id="kt_options">
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="kt_advanced_options_header">
                      <button
                        className="accordion-button fs-4 fw-semibold collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#kt_advanced_options"
                        aria-expanded="false"
                        aria-controls="kt_advanced_options"
                      >
                        Advanced Options
                      </button>
                    </h2>
                    <div id="kt_advanced_options" className="accordion-collapse collapse" aria-labelledby="kt_advanced_options_header" data-bs-parent="#kt_options">
                      <div className="accordion-body">
                        {/* IsEventTime */}
                        <div className="fv-row mb-6">
                          <label className="fw-bold fs-6 mb-2">Is Event Time</label>
                          <select {...formik.getFieldProps("options.isEventTime")} name="options.isEventTime" className="form-select mb-3 mb-lg-0" autoComplete="off">
                            <option value="false">False</option>
                            <option value="true">True</option>
                          </select>
                        </div>
                        {/* Qos */}
                        <div className="fv-row mb-6">
                          <label className="fw-bold fs-6 mb-2">QoS</label>
                          <select {...formik.getFieldProps("options.qos")} name="options.qos" className="form-select mb-3 mb-lg-0" autoComplete="off">
                            <option value="0">0</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                          </select>
                        </div>
                        {/* LateTolerance */}
                        <div className="fv-row mb-6">
                          <label className="fw-bold fs-6 mb-2">Late Tolerance</label>
                          <input
                            {...formik.getFieldProps("options.lateTolerance")}
                            type="number"
                            name="options.lateTolerance"
                            placeholder="Late Tolerance"
                            className="form-control mb-3 mb-lg-0"
                            autoComplete="off"
                          />
                        </div>
                        {/* Concurrency */}
                        <div className="fv-row mb-6">
                          <label className="fw-bold fs-6 mb-2">Concurrency</label>
                          <input
                            {...formik.getFieldProps("options.concurrency")}
                            type="number"
                            name="options.concurrency"
                            placeholder="Concurrency"
                            className="form-control mb-3 mb-lg-0"
                            autoComplete="off"
                          />
                        </div>
                        {/* BufferLength */}
                        <div className="fv-row mb-6">
                          <label className="fw-bold fs-6 mb-2">Buffer Length</label>
                          <input
                            {...formik.getFieldProps("options.bufferLength")}
                            type="number"
                            name="options.bufferLength"
                            placeholder="Buffer Length"
                            className="form-control mb-3 mb-lg-0"
                            autoComplete="off"
                          />
                        </div>
                        {/* CheckpointInterval */}
                        <div className="fv-row mb-6">
                          <label className="fw-bold fs-6 mb-2">Checkpoint Interval</label>
                          <input
                            {...formik.getFieldProps("options.checkpointInterval")}
                            type="number"
                            name="options.checkpointInterval"
                            placeholder="Checkpoint Interval"
                            className="form-control mb-3 mb-lg-0"
                            autoComplete="off"
                          />
                        </div>
                        {/* SendMetaToSink */}
                        <div className="fv-row mb-6">
                          <label className="fw-bold fs-6 mb-2">Send Meta to Sink</label>
                          <select {...formik.getFieldProps("options.sendMetaToSink")} name="options.sendMetaToSink" className="form-select mb-3 mb-lg-0" autoComplete="off">
                            <option value="false">False</option>
                            <option value="true">True</option>
                          </select>
                        </div>
                        {/* SendError */}
                        <div className="fv-row mb-6">
                          <label className="fw-bold fs-6 mb-2">Send Error</label>
                          <select {...formik.getFieldProps("options.sendError")} name="options.sendError" className="form-select mb-3 mb-lg-0" autoComplete="off">
                            <option value="false">False</option>
                            <option value="true">True</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* end::Scroll */}

          {/* begin::Actions */}
          <div className="text-center pt-15">
            <button type="reset" onClick={onBackAddRule} className="btn btn-light me-3" data-kt-rule-modal-action="cancel" disabled={formik.isSubmitting}>
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

export { AddRule };
