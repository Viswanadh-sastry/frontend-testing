import { useQuery } from "@tanstack/react-query";
import { FC, useState } from "react";
import { Table } from "react-bootstrap";
import { toast } from "react-toastify";
import { getProfile } from "../api/ProfileAPI";
import { EditProfile } from "./modals/EditProfile";
import { EditMetadata } from "./modals/EditMetadata";
import { EditIdentity } from "./modals/EditIdentity";
import { EditRole } from "./modals/EditRole";
import { EditTags } from "./modals/EditTags";
// import Swal from "sweetalert2/dist/sweetalert2.js";

const MyProfile: FC = () => {
  // const [enabled, setEnabled] = useState(true);
  const [modal, setModal] = useState({
    show: false,
    name: "",
  });
  const profileQuery = useQuery({
    queryKey: [`profile`],
    queryFn: async () => getProfile().catch((error) => toast.error(error?.response?.data?.message || "Something went wrong")),
    enabled: true,
  });
  const profile = profileQuery.data;

  // useEffect(() => {
  //   if (profileQuery.data) {
  //     setEnabled(profileQuery.data.status === "enabled");
  //   }
  // }, [profileQuery.data]);

  const onClose = () => {
    setModal({ show: false, name: "" });
  };

  const onDisplay = () => {
    profileQuery.refetch();
  };

  // const enableDisableUser = () => {
  //   Swal.fire({
  //     heightAuto: false,
  //     icon: "warning",
  //     title: enabled ? "Disable User" : "Enable User",
  //     text: enabled ? "Are you sure you want to disable this user?" : "Are you sure you want to enable this user?",
  //     showCancelButton: true,
  //     confirmButtonText: "Yes",
  //     confirmButtonColor: enabled ? "#d33" : "#198754",
  //     cancelButtonText: "No",
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       updateUserSetting();
  //     }
  //   });
  // };

  // const updateUserSetting = () => {
  //   if (enabled) {
  //     disableUser(profile?.id)
  //       .then(() => {
  //         toast.success("User disabled successfully");
  //         profileQuery.refetch();
  //         setEnabled(false);
  //       })
  //       .catch((error) => toast.error(error?.response?.data?.message || "Something went wrong"));
  //   } else {
  //     enableUser(profile?.id)
  //       .then(() => {
  //         toast.success("User enabled successfully");
  //         profileQuery.refetch();
  //         setEnabled(true);
  //       })
  //       .catch((error) => toast.error(error?.response?.data?.message || "Something went wrong"));
  //   }
  // };

  return (
    <>
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
              <td></td>
            </tr>
            <tr>
              <td>
                <label className="fw-bold fs-6">Name</label>
              </td>
              <td>{profile?.name}</td>
              <td>
                <button className="btn btn-icon btn-light btn-hover-primary btn-sm" onClick={() => setModal({ show: true, name: "name" })}>
                  <i className="bi bi-pencil-square"></i>
                </button>
              </td>
            </tr>
            <tr>
              <td>
                <label className="fw-bold fs-6">ID</label>
              </td>
              <td>{profile?.id}</td>
              <td></td>
            </tr>
            <tr>
              <td>
                <label className="fw-bold fs-6">Identity</label>
              </td>
              <td>{profile?.credentials.identity}</td>
              <td>
                <button className="btn btn-icon btn-light btn-hover-primary btn-sm" onClick={() => setModal({ show: true, name: "identity" })}>
                  <i className="bi bi-pencil-square"></i>
                </button>
              </td>
            </tr>
            <tr>
              <td>
                <label className="fw-bold fs-6">Tags</label>
              </td>
              <td>
                {profile?.tags?.map((tag: string, index: number) => (
                  <div key={index} className="badge badge-light-primary fw-bolder me-2">
                    {tag}
                  </div>
                ))}
              </td>
              <td>
                <button className="btn btn-icon btn-light btn-hover-primary btn-sm" onClick={() => setModal({ show: true, name: "tags" })}>
                  <i className="bi bi-pencil-square"></i>
                </button>
              </td>
            </tr>
            <tr>
              <td>
                <label className="fw-bold fs-6">Metadata</label>
              </td>
              <td>
                {!profile?.metadata || typeof profile?.metadata !== "object" ? (
                  <span className="text-muted"></span>
                ) : (
                  <div>
                    {Object.entries(profile?.metadata).map(([key, val], index) => (
                      <span key={index} className="badge badge-light-primary mr-2" style={{ display: "inline-block", marginBottom: "4px", marginRight: "4px" }}>
                        {`${key}: ${val}`}
                      </span>
                    ))}
                  </div>
                )}
              </td>
              <td>
                <button className="btn btn-icon btn-light btn-hover-primary btn-sm" onClick={() => setModal({ show: true, name: "metadata" })}>
                  <i className="bi bi-pencil-square"></i>
                </button>
              </td>
            </tr>
            <tr>
              <td>
                <label className="fw-bold fs-6">Role</label>
              </td>
              <td>{profile?.role}</td>
              <td></td>
            </tr>
          </tbody>
        </Table>
      </div>
      {/* <div className="card-footer d-flex justify-content-end py-6 px-9">
        {enabled ? (
          <button type="button" className="btn btn-danger mx-2" onClick={enableDisableUser}>
            <span className="indicator-label">Disable User</span>
          </button>
        ) : (
          <button type="button" className="btn btn-success mx-2" onClick={enableDisableUser}>
            <span className="indicator-label">Enable User</span>
          </button>
        )}
        <button type="button" className="btn btn-primary" onClick={() => setModal({ show: true, name: "role" })}>
          <span className="indicator-label">Update Role</span>
        </button>
      </div> */}
      {modal.show && modal.name === "name" && <EditProfile data={profile} onClose={onClose} onDisplay={onDisplay} />}
      {modal.show && modal.name === "metadata" && <EditMetadata data={profile} onClose={onClose} onDisplay={onDisplay} />}
      {modal.show && modal.name === "identity" && <EditIdentity data={profile} onClose={onClose} onDisplay={onDisplay} />}
      {modal.show && modal.name === "role" && <EditRole data={profile} onClose={onClose} onDisplay={onDisplay} />}
      {modal.show && modal.name === "tags" && <EditTags data={profile} onClose={onClose} onDisplay={onDisplay} />}
    </>
  );
};

export { MyProfile };
