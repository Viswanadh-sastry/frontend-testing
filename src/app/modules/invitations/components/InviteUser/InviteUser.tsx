import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { useState, useMemo } from "react";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { sendInvitation } from "../../api/InvitationAPI";
import { KTIcon } from "../../../../../_metronic/helpers";
import { ThemeModeComponent } from "../../../../../_metronic/assets/ts/layout";
import { getUserListAll } from "../../../users/api/UserAPI";
import { getDomainList } from "../../../domain/api/DomainAPI";

interface IInviteUserProps {
  onCloseInviteUser: () => void;
  onGetInvitationList: () => void;
}

const InviteUser = ({ onCloseInviteUser, onGetInvitationList }: IInviteUserProps) => {
  let ktThemeModeValue = localStorage.getItem("kt_theme_mode_value");
  if (ktThemeModeValue === "system") {
    ktThemeModeValue = ThemeModeComponent.getSystemMode() as "light" | "dark";
  }
  const [userId, setUserId] = useState("");
  const [domainId, setDomainId] = useState("");
  const [filterDomain, setFilterDomain] = useState({
    offset: 0,
    limit: 10,
    name: "",
    permission: "",
    status: "enabled",
  });
  const domainsQuery = useQuery({
    queryKey: [`domains`, filterDomain],
    queryFn: async () => getDomainList(filterDomain).catch((error) => toast.error(error?.response?.data?.error || "Something went wrong")),
    enabled: true,
  });
  const domainList = useMemo(() => domainsQuery.data?.domains || [], [domainsQuery.data]);
  const [filterUser, setFilterUser] = useState({
    offset: 0,
    limit: 100,
    name: "",
    identity: "",
    metadata: "",
    tags: "",
    status: "enabled",
  });
  const userListQuery = useQuery({
    queryKey: [`userList`, filterUser],
    queryFn: async () => getUserListAll(filterUser).catch((error) => toast.error(error?.response?.data?.error || "Something went wrong")),
    enabled: true,
  });
  const userList = useMemo(() => userListQuery.data?.users || [], [userListQuery.data]);
  const invitationSchema = Yup.object().shape({
    user_id: Yup.string().required("User is required"),
    domain_id: Yup.string().required("Organization is required"),
    relation: Yup.string().required("Relation is required"),
    resend: Yup.bool(),
  });

  const formik = useFormik({
    initialValues: {
      user_id: "",
      domain_id: "",
      relation: "",
      resend: false,
    },
    validationSchema: invitationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      sendInvitation(values)
        .then(() => {
          toast.success("Invitation invited successfully");
          onCloseInviteUser();
          onGetInvitationList();
        })
        .catch((error) => toast.error(error?.response?.data?.error || "Something went wrong"))
        .finally(() => setSubmitting(false));
    },
  });

  const onChangeUser = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserId("");
    setFilterUser({ ...filterUser, name: e.target.value });
    formik.setFieldValue("user_id", "");
  };

  const selectUser = (id: string) => {
    setUserId(id);
    formik.setFieldValue("user_id", id);
  };

  const onChangeDomain = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDomainId("");
    setFilterDomain({ ...filterDomain, name: e.target.value });
    formik.setFieldValue("domain_id", "");
  };

  const selectDomain = (id: string) => {
    setDomainId(id);
    formik.setFieldValue("domain_id", id);
  };

  return (
    <>
      <div className="modal fade show d-block" id="kt_modal_add_invitation" role="dialog" tabIndex={-1} aria-modal="true">
        {/* begin::Modal dialog */}
        <div className="modal-dialog modal-dialog-centered mw-900px">
          {/* begin::Modal content */}
          <div className="modal-content">
            <div className="modal-header d-flex justify-content-between align-items-center">
              {/* begin::Modal title */}
              <h2 className="fw-bolder">Invite User</h2>
              {/* end::Modal title */}

              {/* begin::Close */}
              <div className="btn btn-icon btn-sm btn-active-icon-primary" data-kt-invitations-modal-action="close" onClick={onCloseInviteUser} style={{ cursor: "pointer" }}>
                <KTIcon iconName="cross" className="fs-1" />
              </div>
              {/* end::Close */}
            </div>
            {/* begin::Modal body */}
            <div className="modal-body mx-5 mx-xl-15 my-7">
              <form id="kt_modal_add_invitation_form" className="form" onSubmit={formik.handleSubmit} noValidate>
                {/* begin::Scroll */}
                <div className="d-flex flex-column me-n7 pe-7">
                  {/* User */}
                  <div className="form-group row">
                    <label className="col-sm-2 col-form-label">User</label>
                    <div className="col-sm-10">
                      <input type="text" name="searchUser" value={filterUser.name} placeholder="Search User" className="form-control mb-3" onChange={onChangeUser} />
                      <div className="fv-row mb-3">
                        <div className="list-group scroll-y h-200px">
                          {userList.length > 0 ? (
                            userList.map((user: any) => (
                              <a
                                role="button"
                                key={user.id}
                                className={`list-group-item list-group-item-action p-3 ${userId === user.id ? "active" : ""}`}
                                onClick={() => selectUser(user.id)}
                                style={
                                  ktThemeModeValue === "dark" ? { color: "white", backgroundColor: userId !== user.id ? "#15171C" : "", borderColor: "var(--bs-secondary)" } : {}
                                }
                              >
                                {user.name}
                              </a>
                            ))
                          ) : (
                            <div className="text-center">No users found</div>
                          )}
                        </div>
                      </div>
                      {formik.touched.user_id && formik.errors.user_id && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            <span role="alert">{formik.errors.user_id}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Organization */}
                  <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Organization</label>
                    <div className="col-sm-10">
                      <input type="text" name="searchDomain" value={filterDomain.name} placeholder="Search Organization" className="form-control mb-3" onChange={onChangeDomain} />
                      <div className="fv-row mb-3">
                        <div className="list-group scroll-y h-200px">
                          {domainList.length > 0 ? (
                            domainList.map((domain: any) => (
                              <a
                                role="button"
                                key={domain.id}
                                className={`list-group-item list-group-item-action p-3 ${domainId === domain.id ? "active" : ""}`}
                                onClick={() => selectDomain(domain.id)}
                                style={
                                  ktThemeModeValue === "dark"
                                    ? { color: "white", backgroundColor: domainId !== domain.id ? "#15171C" : "", borderColor: "var(--bs-secondary)" }
                                    : {}
                                }
                              >
                                {domain.name}
                              </a>
                            ))
                          ) : (
                            <div className="text-center">No organizations found</div>
                          )}
                        </div>
                      </div>
                      {formik.touched.domain_id && formik.errors.domain_id && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            <span role="alert">{formik.errors.domain_id}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Relation */}
                  <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Relation</label>
                    <div className="col-sm-10">
                      <select
                        {...formik.getFieldProps("relation")}
                        className={clsx(
                          "form-select form-select-solid form-select-lg",
                          { "is-invalid": formik.touched.relation && formik.errors.relation },
                          { "is-valid": formik.touched.relation && !formik.errors.relation }
                        )}
                      >
                        <option value="">Select Relation</option>
                        <option value="administrator">administrator</option>
                        <option value="editor">editor</option>
                        <option value="viewer">viewer</option>
                        <option value="member">member</option>
                      </select>
                      {formik.touched.relation && formik.errors.relation && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            <span role="alert">{formik.errors.relation}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* begin::Actions */}
                <div className="text-center pt-15">
                  <button type="reset" onClick={onCloseInviteUser} className="btn btn-light me-3" data-kt-invitations-modal-action="cancel" disabled={formik.isSubmitting}>
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

export { InviteUser };
