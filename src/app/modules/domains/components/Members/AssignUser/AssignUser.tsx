import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { createMember } from "../../../api/MembersAPI";
import { KTIcon } from "../../../../../../_metronic/helpers";
import { ThemeModeComponent } from "../../../../../../_metronic/assets/ts/layout";
import { getMemberListAll } from "../../../../domains/api/MembersAPI";
import { getUserListAll } from "../../../../users/api/UserAPI";

interface IAssignUserProps {
  onCloseAddMember: () => void;
  onGetMemberList: () => void;
}

const AssignUser = ({ onCloseAddMember, onGetMemberList }: IAssignUserProps) => {
  let ktThemeModeValue = localStorage.getItem("kt_theme_mode_value");
  if (ktThemeModeValue === "system") {
    ktThemeModeValue = ThemeModeComponent.getSystemMode() as "light" | "dark";
  }
  const params = useParams();
  const domainId = params.id as string;
  const [userId, setUserId] = useState("");
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
    queryFn: async () =>
      getUserListAll(filterUser)
        .then(async (response) => {
          const filterMember = {
            limit: 100,
            offset: 0,
            metadata: "",
            status: "enabled",
          };
          const memberList = await getMemberListAll(domainId, filterMember).catch((error) => toast.error(error?.response?.data?.message || "Something went wrong"));
          const memberListIds = memberList.users.map((member: any) => member.id);
          response.users = response.users.filter((user: any) => !memberListIds.includes(user.id));
          return response;
        })
        .catch((error) => toast.error(error?.response?.data?.message || "Something went wrong")),
    enabled: true,
  });
  const userList = useMemo(() => userListQuery.data?.users || [], [userListQuery.data]);
  const invitationSchema = Yup.object().shape({
    user_ids: Yup.array().min(1, "User is required"),
    relation: Yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      user_ids: [],
      relation: "member",
    },
    validationSchema: invitationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      createMember(domainId, values)
        .then(() => {
          toast.success("User assigned successfully");
          onCloseAddMember();
          onGetMemberList();
        })
        .catch((error) => toast.error(error?.response?.data?.message || "Something went wrong"))
        .finally(() => setSubmitting(false));
    },
  });

  const onChangeUser = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserId("");
    setFilterUser({ ...filterUser, name: e.target.value });
    formik.setFieldValue("user_ids", []);
  };

  const selectUser = (id: string) => {
    setUserId(id);
    formik.setFieldValue("user_ids", [...formik.values.user_ids, id]);
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
              <h2 className="fw-bolder">Assign User</h2>
              {/* end::Modal title */}

              {/* begin::Close */}
              <div className="btn btn-icon btn-sm btn-active-icon-primary" data-kt-invitations-modal-action="close" onClick={onCloseAddMember} style={{ cursor: "pointer" }}>
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
                      {formik.touched.user_ids && formik.errors.user_ids && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            <span role="alert">{formik.errors.user_ids}</span>
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
                        <option value="member">member</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* begin::Actions */}
                <div className="text-center pt-15">
                  <button type="reset" onClick={onCloseAddMember} className="btn btn-light me-3" data-kt-invitations-modal-action="cancel" disabled={formik.isSubmitting}>
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

export { AssignUser };
