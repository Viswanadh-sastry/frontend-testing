import clsx from "clsx";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { Typeahead } from "react-bootstrap-typeahead";
import { createUser } from "../../api/UserAPI";
import { KTIcon, MetadataInputFields } from "../../../../../_metronic/helpers";
import "react-bootstrap-typeahead/css/Typeahead.css";
import { getGeneratePassword, getJWTToken, getRootToken, getVToken, updateUserPassword } from "../../api/VaultAPI";
// import { addUpdateUser } from "../../api/VaultAPI";

interface IAddUserProps {
  onCloseAddUser: () => void;
  onGetUserList: () => void;
}

const AddUser = ({ onCloseAddUser, onGetUserList }: IAddUserProps) => {
  const userSchema = Yup.object().shape({
    name: Yup.string().required("User Name is required"),
    identity: Yup.string()
      .required("User Email is required")
      .email("Invalid email format")
      .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid email format"),
    secret: Yup.string().required("User Password is required").min(8, "Password must be at least 8 characters"),
    tags: Yup.array(),
    metadata: Yup.object(),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      identity: "",
      secret: "",
      tags: [],
      metadata: {},
    },
    validationSchema: userSchema,
    onSubmit: async (values, { setSubmitting }) => {
      if (!isValidateMetadata(values.metadata)) {
        toast.warn("Invalid metadata format");
        setSubmitting(false);
        return;
      }
      const data = {
        name: values.name,
        credentials: {
          identity: values.identity,
          secret: values.secret,
        },
        tags: values.tags.map((tag: any) => (tag.label ? tag.label : tag)),
        metadata: values.metadata,
        status: "enabled",
      };
      createUser(data)
        .then(async () => {
          // Create user in vault
          const username = values.identity.split("@")[0];
          const rootAuth = await getRootToken().catch((error) => toast.error(error?.response?.data?.message || "Something went wrong"));
          getGeneratePassword(username)
            .then(async (response) => {
              const userData = {
                username: username,
                password: response.password,
              };
              const vToken = await getVToken(userData, rootAuth.tokens[0]).catch((error) => toast.error(error?.response?.data?.message || "Something went wrong"));
              await getJWTToken(username, vToken.auth.client_token).catch((error) => toast.error(error?.response?.data?.message || "Something went wrong"));
              const params = {
                username: username,
                password: values.secret,
              };
              updateUserPassword(params, rootAuth.tokens[0])
                .then(() => {
                  toast.success("User created successfully");
                  onCloseAddUser();
                  onGetUserList();
                })
                .catch((error) => toast.error(error?.response?.data?.message || "Something went wrong"));
            })
            .catch((error) => toast.error(error?.response?.data?.message || "Something went wrong"));
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

  // Ensure that the "Phone_Number" key is initialized in metadata
  const initialMetadata = {
    Phone_Number: "",
    ...formik.values.metadata,
  };

  return (
    <>
      <div className="modal fade show d-block" id="kt_modal_add_user" role="dialog" tabIndex={-1} aria-modal="true">
        {/* begin::Modal dialog */}
        <div className="modal-dialog modal-dialog-centered mw-900px">
          {/* begin::Modal content */}
          <div className="modal-content">
            <div className="modal-header d-flex justify-content-between align-items-center">
              {/* begin::Modal title */}
              <h2 className="fw-bolder">Add User</h2>
              {/* end::Modal title */}

              {/* begin::Close */}
              <div className="btn btn-icon btn-sm btn-active-icon-primary" data-kt-users-modal-action="close" onClick={onCloseAddUser} style={{ cursor: "pointer" }}>
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
                    {/* Name */}
                    <div className="col-md-12">
                      <div className="fv-row mb-6">
                        <label className="required fw-bold fs-6 mb-2">Name</label>
                        <input
                          {...formik.getFieldProps("name")}
                          type="text"
                          name="name"
                          placeholder="User Name"
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
                    {/* Identity */}
                    <div className="col-md-12">
                      <div className="fv-row mb-6">
                        <label className="required fw-bold fs-6 mb-2">Identity</label>
                        <input
                          {...formik.getFieldProps("identity")}
                          type="text"
                          name="identity"
                          placeholder="User Email"
                          className={clsx(
                            "form-control mb-3 mb-lg-0",
                            { "is-invalid": formik.touched.identity && formik.errors.identity },
                            { "is-valid": formik.touched.identity && !formik.errors.identity }
                          )}
                          autoComplete="off"
                        />
                        {formik.touched.identity && formik.errors.identity && (
                          <div className="fv-plugins-message-container">
                            <div className="fv-help-block">
                              <span role="alert">{formik.errors.identity}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    {/* Secret */}
                    <div className="col-md-12">
                      <div className="fv-row mb-6">
                        <label className="required fw-bold fs-6 mb-2">Secret</label>
                        <input
                          {...formik.getFieldProps("secret")}
                          type="password"
                          name="secret"
                          placeholder="User Password"
                          className={clsx(
                            "form-control mb-3 mb-lg-0",
                            { "is-invalid": formik.touched.secret && formik.errors.secret },
                            { "is-valid": formik.touched.secret && !formik.errors.secret }
                          )}
                          autoComplete="off"
                        />
                        {formik.touched.secret && formik.errors.secret && (
                          <div className="fv-plugins-message-container">
                            <div className="fv-help-block">
                              <span role="alert">{formik.errors.secret}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    {/* Tags */}
                    <div className="col-md-12">
                      <div className="fv-row mb-6">
                        <label className="fw-bold fs-6 mb-2">Tags</label>
                        <Typeahead
                          id="tags"
                          allowNew
                          multiple
                          options={[]}
                          placeholder="Add a tag"
                          newSelectionPrefix="Add a new tag: "
                          selected={formik.values.tags}
                          onChange={(selected) => formik.setFieldValue("tags", selected)}
                          onKeyDown={(e: any) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              const inputValue = e.target.value.trim();
                              if (inputValue) {
                                if (Array.isArray(formik.values.tags)) {
                                  formik.setFieldValue("tags", [...formik.values.tags, inputValue]);
                                } else {
                                  formik.setFieldValue("tags", [inputValue]);
                                }
                                e.stopPropagation();
                                e.target.select();
                              }
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    {/* Metadata */}
                    <div className="col-md-12">
                      <div className="fv-row mb-6">
                        <label className="fw-bold fs-6 mb-2">Metadata</label>
                        <MetadataInputFields metadata={initialMetadata} setMetadata={(metadata: any) => formik.setFieldValue("metadata", metadata)} />
                        <label className="fs-6 text-muted">Enter user metadata in JSON format.</label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* begin::Actions */}
                <div className="text-center pt-15">
                  <button type="reset" onClick={onCloseAddUser} className="btn btn-light me-3" data-kt-users-modal-action="cancel" disabled={formik.isSubmitting}>
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

export { AddUser };
