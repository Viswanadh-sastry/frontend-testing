import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { getRolePermission, MODULENAME } from "../../../auth/core/RoleHelpers";
import { disableChannel, enableChannel, getChannel, deleteChannel } from "../../api/ChannelsAPI";
import { UserTable } from "../ChannelUser/UserList/UserTable";
import { EditDescription } from "./modals/EditDescription";
import { EditMetadata } from "./modals/EditMetadata";
import { EditName } from "./modals/EditName";

const EditChannel = () => {
  const navigate = useNavigate();
  const params = useParams();
  const id = params.id as string;
  const [rolePermission, setRolePermission] = useState<any>(null);
  const [enabled, setEnabled] = useState(true);
  const [modal, setModal] = useState({
    show: false,
    name: "",
  });
  const channelQuery = useQuery({
    queryKey: [`channel`, id],
    queryFn: async () => getChannel(id).catch((error) => toast.error(error?.response?.data?.message || "Something went wrong")),
    enabled: true,
  });
  const channel = channelQuery.data;

  useEffect(() => {
    const fetchRolePermission = async () => {
      const permission = await getRolePermission(MODULENAME.ASSETLIST, id);
      setRolePermission(permission);
    };
    fetchRolePermission();
  }, []);
  useEffect(() => {
    if (channelQuery.data) {
      setEnabled(channelQuery.data.status === "enabled");
    }
  }, [channelQuery.data]);

  const onClose = () => {
    setModal({ show: false, name: "" });
  };

  const onDisplay = () => {
    channelQuery.refetch();
  };

  const enableDisableChannel = () => {
    Swal.fire({
      heightAuto: false,
      icon: "warning",
      title: enabled ? "Disable Asset" : "Enable Asset",
      text: enabled ? "Are you sure you want to disable this asset?" : "Are you sure you want to enable this asset?",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: enabled ? "#d33" : "#198754",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        updateChannelSetting();
      }
    });
  };

  const updateChannelSetting = () => {
    if (enabled) {
      disableChannel(channel?.id)
        .then(() => {
          toast.success("Asset disabled successfully");
          channelQuery.refetch();
          setEnabled(false);
        })
        .catch((error) => toast.error(error?.response?.data?.message || "Something went wrong"));
    } else {
      enableChannel(channel?.id)
        .then(() => {
          toast.success("Asset enabled successfully");
          channelQuery.refetch();
          setEnabled(true);
        })
        .catch((error) => toast.error(error?.response?.data?.message || "Something went wrong"));
    }
  };

  const deleteChannels = () => {
    Swal.fire({
      heightAuto: false,
      icon: "warning",
      title: "Delete Asset",
      text: "Are you sure you want to delete this asset?",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#d33",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteChannel(channel?.id)
          .then(() => {
            toast.success("Asset deleted successfully");
            navigate("/channels");
          })
          .catch((error) => toast.error(error?.response?.data?.message || "Something went wrong"));
      }
    });
  };

  const openThingPage = () => {
    navigate(`/channels/${channel?.id}/assignThings`);
  };

  const openGroupPage = () => {
    navigate(`/channels/${channel?.id}/assignGroups`);
  };

  return (
    <>
      <div className="card-header d-flex justify-content-between py-6 px-9">
        <div className="card-title"></div>
        {/* <div className="card-toolbar">
          <button type="button" className="btn btn-light" onClick={() => window.history.back()}>
            <i className="bi bi-arrow-left"></i>
            Back
          </button>
        </div> */}
        <div className="card-toolbar">
          <button type="button" className="btn btn-light" onClick={() => window.history.back()}>
            <i className="bi bi-arrow-left"></i>
            Back
          </button>
          <button type="button" className="btn btn-primary mx-2" onClick={openThingPage}>
            Connect
          </button>
          <button type="button" className="btn btn-primary" onClick={openGroupPage}>
            Assign Asset Groups
          </button>
        </div>
      </div>
      <div className="card-body py-0 px-9">
        <div className="accordion" id="kt_accordion_1">
          <div className="accordion-item">
            <h2 className="accordion-header" id="kt_accordion_1_header_1">
              <button
                className="accordion-button fs-4 fw-semibold"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#kt_accordion_1_body_1"
                aria-expanded="true"
                aria-controls="kt_accordion_1_body_1"
              >
                Asset Information
              </button>
            </h2>
            <div id="kt_accordion_1_body_1" className="accordion-collapse collapse show" aria-labelledby="kt_accordion_1_header_1" data-bs-parent="#kt_accordion_1">
              <div className="accordion-body">
                <Table responsive bordered>
                  <tbody>
                    <tr>
                      <td>
                        <label className="fw-bold fs-6">Name</label>
                      </td>
                      <td>{channel?.name}</td>
                      {rolePermission?.update && (
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
                      <td>{channel?.id}</td>
                      {rolePermission?.update && <td></td>}
                    </tr>
                    <tr>
                      <td>
                        <label className="fw-bold fs-6">Description</label>
                      </td>
                      <td>{channel?.description}</td>
                      {rolePermission?.update && (
                        <td>
                          <button className="btn btn-icon btn-light btn-hover-primary btn-sm" onClick={() => setModal({ show: true, name: "description" })}>
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
                        {!channel?.metadata || typeof channel?.metadata !== "object" ? (
                          <span className="text-muted"></span>
                        ) : (
                          <div>
                            {Object.entries(channel?.metadata).map(([key, val], index) => (
                              <span key={index} className="badge badge-light-primary mr-2" style={{ display: "inline-block", marginBottom: "4px", marginRight: "4px" }}>
                                {`${key}: ${val}`}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                      {rolePermission?.update && (
                        <td>
                          <button className="btn btn-icon btn-light btn-hover-primary btn-sm" onClick={() => setModal({ show: true, name: "metadata" })}>
                            <i className="bi bi-pencil-square"></i>
                          </button>
                        </td>
                      )}
                    </tr>
                  </tbody>
                </Table>
              </div>
            </div>
          </div>
          <div className="accordion-item">
            <h2 className="accordion-header" id="kt_accordion_1_header_2">
              <button
                className="accordion-button fs-4 fw-semibold collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#kt_accordion_1_body_2"
                aria-expanded="false"
                aria-controls="kt_accordion_1_body_2"
              >
                Assign Members
              </button>
            </h2>
            <div id="kt_accordion_1_body_2" className="accordion-collapse collapse" aria-labelledby="kt_accordion_1_header_2" data-bs-parent="#kt_accordion_1">
              <div className="accordion-body">
                <UserTable />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="card-footer d-flex justify-content-end py-6 px-9">
        {rolePermission?.disable && (
          <>
            {enabled ? (
              <button type="button" className="btn btn-danger mx-2" onClick={enableDisableChannel}>
                <span className="indicator-label">Disable Asset</span>
              </button>
            ) : (
              <button type="button" className="btn btn-success mx-2" onClick={enableDisableChannel}>
                <span className="indicator-label">Enable Asset</span>
              </button>
            )}
          </>
        )}
        {rolePermission?.delete && (
          <button type="button" className="btn btn-danger" onClick={deleteChannels}>
            <span className="indicator-label">Delete Asset</span>
          </button>
        )}
      </div>
      {modal.show && modal.name === "name" && <EditName data={channel} onClose={onClose} onDisplay={onDisplay} />}
      {modal.show && modal.name === "metadata" && <EditMetadata data={channel} onClose={onClose} onDisplay={onDisplay} />}
      {modal.show && modal.name === "description" && <EditDescription data={channel} onClose={onClose} onDisplay={onDisplay} />}
    </>
  );
};

export { EditChannel };
