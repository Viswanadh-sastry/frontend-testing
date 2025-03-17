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
  const filterSubscription = {
    limit: 10,
    offset: 0,
  };
  const subscriptionListQuery = useQuery({
    queryKey: [`subscriptionList`, filterSubscription],
    queryFn: async () => getSubscriptionList(filterSubscription).catch((error) => toast.error(error?.response?.data?.error || "Something went wrong")),
    enabled: false,
  });
  const subscriptionSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    categories: Yup.string().required("Categories is required"),
    labels: Yup.string().required("Labels is required"),
    receiver: Yup.string().required("Receiver is required"),
    resendInterval: Yup.string(),
    resendLimit: Yup.number(),
    adminState: Yup.string(),
    emailChannels: Yup.array(),
    restChannels: Yup.array(),
  });

  const formik = useFormik({
    initialValues: {
      id: row?.original.id || "",
      name: row?.original.name || "",
      categories: row?.original.categories.join(",") || "",
      labels: row?.original.labels.join(",") || "",
      receiver: row?.original.receiver || "",
      resendInterval: row?.original.resendInterval || "",
      resendLimit: row?.original.resendLimit || 0,
      adminState: row?.original.adminState || "",
      emailChannels: row?.original.channels.filter((channel: any) => channel.type === "EMAIL").map((channel: any) => ({ emailRecipient: channel.recipients[0] })) || [],
      restChannels: row?.original.channels.filter((channel: any) => channel.type === "REST") || [],
      created: row?.original.created || "",
      modified: row?.original.modified || "",
    },
    validationSchema: subscriptionSchema,
    onSubmit: async (values, { setSubmitting }) => {
      if (values.emailChannels.length === 0 && values.restChannels.length === 0) {
        toast.error("Please add at least one email or rest channel.");
        return;
      }
      const emailChannels = values.emailChannels.map((emailChannel: any) => ({ type: "EMAIL", host: "", port: 0, recipients: [emailChannel.emailRecipient] }));
      const restChannels = values.restChannels.map((restChannel: any) => ({
        type: "REST",
        httpMethod: restChannel.httpMethod,
        host: restChannel.host,
        port: Number(restChannel.port),
        path: restChannel.path,
      }));
      const channels = [...emailChannels, ...restChannels];
      const data = [
        {
          apiVersion: "v3",
          subscription: {
            id: values.id,
            name: values.name,
            categories: [values.categories],
            labels: [values.labels],
            receiver: values.receiver,
            resendInterval: values.resendInterval,
            resendLimit: values.resendLimit,
            adminState: values.adminState,
            channels: channels,
            created: values.created,
            modified: values.modified,
          },
        },
      ];
      updateSubscription(data)
        .then(() => {
          toast.success("Subscription updated successfully");
          onCloseEditSubscription();
          subscriptionListQuery.refetch();
        })
        .catch((error) => toast.error(error?.response?.data?.error || "Something went wrong"))
        .finally(() => setSubmitting(false));
    },
  });

  return (
    <>
      <div className="text-start modal fade show d-block" id="kt_modal_add_subscription" role="dialog" tabIndex={-1} aria-modal="true">
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
                          readOnly={true}
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
                    {/* Categories */}
                    <div className="col-md-12">
                      <div className="fv-row mb-6">
                        <label className="fw-bold fs-6 mb-2">Categories</label>
                        <input
                          {...formik.getFieldProps("categories")}
                          type="text"
                          name="categories"
                          placeholder="Enter categories"
                          className={clsx(
                            "form-control mb-3 mb-lg-0",
                            { "is-invalid": formik.touched.categories && formik.errors.categories },
                            { "is-valid": formik.touched.categories && !formik.errors.categories }
                          )}
                        />
                        {formik.touched.categories && formik.errors.categories && (
                          <div className="fv-plugins-message-container">
                            <div className="fv-help-block">
                              <span role="alert">{typeof formik.errors.categories === "string" ? formik.errors.categories : ""}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    {/* Labels */}
                    <div className="col-md-12">
                      <div className="fv-row mb-6">
                        <label className="fw-bold fs-6 mb-2">Labels</label>
                        <input
                          {...formik.getFieldProps("labels")}
                          type="text"
                          name="labels"
                          placeholder="Enter labels"
                          className={clsx(
                            "form-control mb-3 mb-lg-0",
                            { "is-invalid": formik.touched.labels && formik.errors.labels },
                            { "is-valid": formik.touched.labels && !formik.errors.labels }
                          )}
                        />
                        {formik.touched.labels && formik.errors.labels && (
                          <div className="fv-plugins-message-container">
                            <div className="fv-help-block">
                              <span role="alert">{typeof formik.errors.labels === "string" ? formik.errors.labels : ""}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    {/* Receiver */}
                    <div className="col-md-12">
                      <div className="fv-row mb-6">
                        <label className="fw-bold fs-6 mb-2">Receiver</label>
                        <input
                          {...formik.getFieldProps("receiver")}
                          type="text"
                          name="receiver"
                          placeholder="Enter receiver"
                          className={clsx(
                            "form-control mb-3 mb-lg-0",
                            { "is-invalid": formik.touched.receiver && formik.errors.receiver },
                            { "is-valid": formik.touched.receiver && !formik.errors.receiver }
                          )}
                        />
                        {formik.touched.receiver && formik.errors.receiver && (
                          <div className="fv-plugins-message-container">
                            <div className="fv-help-block">
                              <span role="alert">{typeof formik.errors.receiver === "string" ? formik.errors.receiver : ""}</span>
                            </div>
                          </div>
                        )}
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

export { EditSubscription };
