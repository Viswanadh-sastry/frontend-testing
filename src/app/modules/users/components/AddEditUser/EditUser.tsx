import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2/dist/sweetalert2.js";
import * as roleHelper from "../../../auth/core/RoleHelpers";
import { disableUser, enableUser, getUser } from "../../api/UserAPI";
import { EditIdentity } from "./modals/EditIdentity";
import { EditMetadata } from "./modals/EditMetadata";
import { EditProfile } from "./modals/EditProfile";
import { EditRole } from "./modals/EditRole";
import { EditTags } from "./modals/EditTags";

const EditUser = () => {
  const params = useParams();
  const id = params.id as string;
  const role = roleHelper.getRole();
  const [enabled, setEnabled] = useState(true);
  const [modal, setModal] = useState({
    show: false,
    name: "",
  });
  const userQuery = useQuery({
    queryKey: [`user`, id],
    queryFn: async () => getUser(id).catch((error) => toast.error(error?.response?.data?.error || "Something went wrong")),
    enabled: true,
  });
  const user = userQuery.data;

  useEffect(() => {
    if (userQuery.data) {
      setEnabled(userQuery.data.status === "enabled");
    }
  }, [userQuery.data]);

  const onClose = () => {
    setModal({ show: false, name: "" });
  };

  const onDisplay = () => {
    userQuery.refetch();
  };

  const enableDisableUser = () => {
    Swal.fire({
      heightAuto: false,
      icon: "warning",
      title: enabled ? "Disable User" : "Enable User",
      text: enabled ? "Are you sure you want to disable this user?" : "Are you sure you want to enable this user?",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: enabled ? "#d33" : "#198754",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        updateUserSetting();
      }
    });
  };

  const updateUserSetting = () => {
    if (enabled) {
      disableUser(user?.id)
        .then(() => {
          toast.success("User disabled successfully");
          userQuery.refetch();
          setEnabled(false);
        })
        .catch((error) => toast.error(error?.response?.data?.error || "Something went wrong"));
    } else {
      enableUser(user?.id)
        .then(() => {
          toast.success("User enabled successfully");
          userQuery.refetch();
          setEnabled(true);
        })
        .catch((error) => toast.error(error?.response?.data?.error || "Something went wrong"));
    }
  };

  return (
    <>
      <div className="card-header d-flex justify-content-between py-6 px-9">
        <div className="card-title">
          <h3 className="fw-bolder">User Information</h3>
        </div>
        <div className="card-toolbar">
          <button type="button" className="btn btn-light" onClick={() => window.history.back()}>
            <i className="bi bi-arrow-left"></i>
            Back
          </button>
        </div>
      </div>
      <div className="card-body p-9">
        <Table responsive bordered>
          <tbody>
            <tr>
              <td>
                <label className="fw-bold fs-6">Avatar</label>
              </td>
              <td>
                <div className="symbol symbol-70px symbol-circle">
                  <img alt="Pic" src="/media/avatars/blank.png" />
                </div>
              </td>
              {role !== "viewer" && <td></td>}
            </tr>
            <tr>
              <td>
                <label className="fw-bold fs-6">Name</label>
              </td>
              <td>{user?.name}</td>
              {role !== "viewer" && (
                <td>
                  <button className="btn btn-icon btn-light btn-hover-primary btn-sm" onClick={() => setModal({ show: true, name: "name" })}>
                    <i className="bi bi-pencil-square"></i>
                  </button>
                </td>
              )}
            </tr>
            <tr>
              <td>
                <label className="fw-bold fs-6">ID</label>
              </td>
              <td>{user?.id}</td>
              {role !== "viewer" && <td></td>}
            </tr>
            <tr>
              <td>
                <label className="fw-bold fs-6">Identity</label>
              </td>
              <td>{user?.credentials?.identity}</td>
              {role !== "viewer" && (
                <td>
                  <button className="btn btn-icon btn-light btn-hover-primary btn-sm" onClick={() => setModal({ show: true, name: "identity" })}>
                    <i className="bi bi-pencil-square"></i>
                  </button>
                </td>
              )}
            </tr>
            <tr>
              <td>
                <label className="fw-bold fs-6">Tags</label>
              </td>
              <td>
                {user?.tags?.map((tag: string, index: number) => (
                  <div key={index} className="badge badge-light-primary fw-bolder me-2">
                    {tag}
                  </div>
                ))}
              </td>
              {role !== "viewer" && (
                <td>
                  <button className="btn btn-icon btn-light btn-hover-primary btn-sm" onClick={() => setModal({ show: true, name: "tags" })}>
                    <i className="bi bi-pencil-square"></i>
                  </button>
                </td>
              )}
            </tr>
            <tr>
              <td>
                <label className="fw-bold fs-6">Metadata</label>
              </td>
              <td>
                {!user?.metadata || typeof user?.metadata !== "object" ? (
                  <span className="text-muted"></span>
                ) : (
                  <div>
                    {Object.entries(user?.metadata).map(([key, val], index) => (
                      <span key={index} className="badge badge-light-primary mr-2" style={{ display: "inline-block", marginBottom: "4px", marginRight: "4px" }}>
                        {`${key}: ${val}`}
                      </span>
                    ))}
                  </div>
                )}
              </td>
              {role !== "viewer" && (
                <td>
                  <button className="btn btn-icon btn-light btn-hover-primary btn-sm" onClick={() => setModal({ show: true, name: "metadata" })}>
                    <i className="bi bi-pencil-square"></i>
                  </button>
                </td>
              )}
            </tr>
            <tr>
              <td>
                <label className="fw-bold fs-6">Role</label>
              </td>
              <td>{user?.role}</td>
              {role !== "viewer" && <td></td>}
            </tr>
          </tbody>
        </Table>
      </div>
      {role !== "viewer" && (
        <div className="card-footer d-flex justify-content-end py-6 px-9">
          {enabled ? (
            <button type="button" className="btn btn-danger mx-2" onClick={enableDisableUser}>
              <span className="indicator-label">Disable User</span>
            </button>
          ) : (
            <button type="button" className="btn btn-success mx-2" onClick={enableDisableUser}>
              <span className="indicator-label">Enable User</span>
            </button>
          )}
          {(role === "admin" || role === "administrator") && (
            <button type="button" className="btn btn-primary" onClick={() => setModal({ show: true, name: "role" })}>
              <span className="indicator-label">Update Role</span>
            </button>
          )}
        </div>
      )}
      {modal.show && modal.name === "name" && <EditProfile data={user} onClose={onClose} onDisplay={onDisplay} />}
      {modal.show && modal.name === "metadata" && <EditMetadata data={user} onClose={onClose} onDisplay={onDisplay} />}
      {modal.show && modal.name === "identity" && <EditIdentity data={user} onClose={onClose} onDisplay={onDisplay} />}
      {modal.show && modal.name === "role" && <EditRole data={user} onClose={onClose} onDisplay={onDisplay} />}
      {modal.show && modal.name === "tags" && <EditTags data={user} onClose={onClose} onDisplay={onDisplay} />}
    </>
  );
};

export { EditUser };
