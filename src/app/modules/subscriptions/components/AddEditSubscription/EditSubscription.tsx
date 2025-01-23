import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { EmailChannelInputFields, KTIcon, RestChannelInputFields } from "../../../../../_metronic/helpers";
import { getSubscriptionList, updateSubscription } from "../../api/SubscriptionAPI";

interface IEditSubscriptionProps {
  row: any;
  onCloseEditSubscription: () => void;
}

const EditSubscription = ({ row, onCloseEditSubscription }: IEditSubscriptionProps) => {
  const subscriptionListQuery = useQuery({
    queryKey: [`subscriptionList`],
    queryFn: async () => getSubscriptionList(),
    enabled: false,
  });
  const subscriptionSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    description: Yup.string(),
    categories: Yup.string(),
    labels: Yup.string(),
    receiver: Yup.string(),
    resendInterval: Yup.string(),
    resendLimit: Yup.number(),
    adminState: Yup.string(),
    emailChannels: Yup.array(),
    restChannels: Yup.array(),
  });

  const formik = useFormik({
    initialValues: {
      name: row?.name || "",
      description: row?.description || "",
      categories: row?.categories || "",
      labels: row?.labels || "",
      receiver: row?.receiver || "",
      resendInterval: row?.resendInterval || "",
      resendLimit: row?.resendLimit || 0,
      adminState: row?.adminState || "",
      emailChannels: row?.emailChannels || [],
      restChannels: row?.restChannels || [],
    },
    validationSchema: subscriptionSchema,
    onSubmit: async (values, { setSubmitting }) => {
      updateSubscription(values)
        .then(() => {
          toast.success("Subscription updated successfully");
          onCloseEditSubscription();
          subscriptionListQuery.refetch();
        })
        .catch((error) => toast.error(error.message))
        .finally(() => setSubmitting(false));
    },
  });

  return (
    <>
      <div className="modal fade show d-block" id="kt_modal_add_subscription" role="dialog" tabIndex={-1} aria-modal="true">
        {/* begin::Modal dialog */}
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable mw-900px mh-900px">
          {/* begin::Modal content */}
          <div className="modal-content">
            <div className="modal-header d-flex justify-content-between align-items-center">
              {/* begin::Modal title */}
              <h2 className="fw-bolder">Edit Subscription</h2>
              {/* end::Modal title */}

              {/* begin::Close */}
              <div
                className="btn btn-icon btn-sm btn-active-icon-primary"
                data-kt-subscription-modal-action="close"
                onClick={onCloseEditSubscription}
                style={{ cursor: "pointer" }}
              >
                <KTIcon iconName="cross" className="fs-1" />
              </div>
              {/* end::Close */}
            </div>
            {/* begin::Modal body */}
            <div className="modal-body mx-5 mx-xl-15 my-7">
              <form id="kt_modal_add_subscription_form" className="form" onSubmit={formik.handleSubmit} noValidate>
                {/* begin::Scroll */}
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
                              <span role="alert">{typeof formik.errors.name === "string" ? formik.errors.name : ""}</span>
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
                        <textarea {...formik.getFieldProps("description")} name="description" placeholder="Enter description" className="form-control mb-3 mb-lg-0" />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    {/* Categories */}
                    <div className="col-md-12">
                      <div className="fv-row mb-6">
                        <label className="fw-bold fs-6 mb-2">Categories</label>
                        <input {...formik.getFieldProps("categories")} type="text" name="categories" placeholder="Enter categories" className="form-control mb-3 mb-lg-0" />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    {/* Labels */}
                    <div className="col-md-12">
                      <div className="fv-row mb-6">
                        <label className="fw-bold fs-6 mb-2">Labels</label>
                        <input {...formik.getFieldProps("labels")} type="text" name="labels" placeholder="Enter labels" className="form-control mb-3 mb-lg-0" />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    {/* Receiver */}
                    <div className="col-md-12">
                      <div className="fv-row mb-6">
                        <label className="fw-bold fs-6 mb-2">Receiver</label>
                        <input {...formik.getFieldProps("receiver")} type="text" name="receiver" placeholder="Enter receiver" className="form-control mb-3 mb-lg-0" />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    {/* Resend Interval */}
                    <div className="col-md-12">
                      <div className="fv-row mb-6">
                        <label className="fw-bold fs-6 mb-2">Resend Interval</label>
                        <input
                          {...formik.getFieldProps("resendInterval")}
                          type="text"
                          name="resendInterval"
                          placeholder="Enter resend interval"
                          className="form-control mb-3 mb-lg-0"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    {/* Resend Limit */}
                    <div className="col-md-12">
                      <div className="fv-row mb-6">
                        <label className="fw-bold fs-6 mb-2">Resend Limit</label>
                        <input {...formik.getFieldProps("resendLimit")} type="number" name="resendLimit" placeholder="Enter resend limit" className="form-control mb-3 mb-lg-0" />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    {/* Admin State */}
                    <div className="col-md-12">
                      <div className="fv-row mb-6">
                        <label className="fw-bold fs-6 mb-2">Admin State</label>
                        <select {...formik.getFieldProps("adminState")} className="form-select form-select-lg">
                          <option value="UNLOCKED">Unlocked</option>
                          <option value="LOCKED">Locked</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    {/* Email Channels */}
                    <div className="col-md-12">
                      <div className="fv-row mb-6">
                        <label className="fw-bold fs-6 mb-2">Email Channels</label>
                        <EmailChannelInputFields
                          emailChannels={formik.values.emailChannels}
                          setEmailChannels={(emailChannels: any) => formik.setFieldValue("emailChannels", emailChannels)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    {/* Rest Channels */}
                    <div className="col-md-12">
                      <div className="fv-row mb-6">
                        <label className="fw-bold fs-6 mb-2">Rest Channels</label>
                        <RestChannelInputFields
                          restChannels={formik.values.restChannels}
                          setRestChannels={(restChannels: any) => formik.setFieldValue("restChannels", restChannels)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* begin::Actions */}
                <div className="text-center pt-15">
                  <button type="reset" onClick={onCloseEditSubscription} className="btn btn-light me-3" data-kt-subscription-modal-action="cancel" disabled={formik.isSubmitting}>
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

export { EditSubscription };
