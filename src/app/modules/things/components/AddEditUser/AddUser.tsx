import clsx from "clsx";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { createThingUser } from "../../api/ThingUserAPI";
import { getUserListAll } from "../../../users/api/UserAPI";
import { KTIcon } from "../../../../../_metronic/helpers";
import { ThemeModeComponent } from "../../../../../_metronic/assets/ts/layout";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

interface IAddUserProps {
  onCloseAddUser: () => void;
  onGetUserList: () => void;
}

const AddUser = ({ onCloseAddUser, onGetUserList }: IAddUserProps) => {
  const params = useParams();
  const id = params.id as string;
  let ktThemeModeValue = localStorage.getItem("kt_theme_mode_value");
  if (ktThemeModeValue === "system") {
    ktThemeModeValue = ThemeModeComponent.getSystemMode() as "light" | "dark";
  }

  const [userId, setUserId] = useState("");
  const [filterUser, setFilterUser] = useState({
    offset: 0,
    limit: 100,
    name: "",
    metadata: "",
    parentID: "",
    status: "enabled",
  });

  const userListQuery = useQuery({
    queryKey: [`userList`, filterUser],
    queryFn: async () => getUserListAll(filterUser).catch((error) => toast.error(error?.response?.data?.error || "Something went wrong")),
    enabled: true,
  });

  const userList = useMemo(() => userListQuery.data?.users || [], [userListQuery.data]);

  const UserSchema = Yup.object().shape({
    relation: Yup.string().required("Relation is required"),
  });

  const formik = useFormik({
    initialValues: {
      user_ids: "",
      relation: "",
    },
    validationSchema: UserSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const data = {
        user_ids: [values.user_ids],
        relation: [values.relation],
      };
      createThingUser(id, data)
        .then(() => {
          toast.success("User created successfully");
          onCloseAddUser();
          onGetUserList();
        })
        .catch((error) => toast.error(error?.response?.data?.error || "Something went wrong"))
        .finally(() => setSubmitting(false));
    },
  });

  const selectUser = (id: string) => {
    setUserId(id);
    formik.setFieldValue("user_ids", id);
  };

  const onChangeUser = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserId("");
    setFilterUser({ ...filterUser, name: e.target.value });
    formik.setFieldValue("user_ids", "");
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
              <div className="btn btn-icon btn-sm btn-active-icon-primary" data-kt-user-modal-action="close" onClick={onCloseAddUser} style={{ cursor: "pointer" }}>
                <KTIcon iconName="cross" className="fs-1" />
              </div>
              {/* end::Close */}
            </div>
            {/* begin::Modal body */}
            <div className="modal-body mx-5 mx-xl-15 my-7">
              <form id="kt_modal_add__form" className="form" onSubmit={formik.handleSubmit} noValidate>
                {/* begin::Scroll */}
                <div className="d-flex flex-column me-n7 pe-7">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="fv-row mb-6">
                        <label className="fw-bold fs-6 mb-2">User ID</label>

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
                              <div className="text-center">No user found</div>
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
                  </div>

                  <div className="form-group row">
                    <div className="col-md-12">
                      <div className="fv-row mb-6">
                        <label className="fw-bold fs-6 mb-2">Relation</label>

                        <select
                          {...formik.getFieldProps("relation")}
                          className={clsx(
                            "form-select form-select form-select-lg",
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
                </div>

                {/* begin::Actions */}
                <div className="text-center pt-15">
                  <button type="reset" onClick={onCloseAddUser} className="btn btn-light me-3" data-kt-group-modal-action="cancel" disabled={formik.isSubmitting}>
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
