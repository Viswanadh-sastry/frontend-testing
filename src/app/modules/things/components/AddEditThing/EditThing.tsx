import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { getRolePermission, MODULENAME } from "../../../auth/core/RoleHelpers";
import { disableThing, enableThing, getThing, deleteThing } from "../../api/ThingAPI";
import { EditMetadata } from "./modals/EditMetadata";
import { EditProfile } from "./modals/EditProfile";
import { EditSecret } from "./modals/EditSecret";
import { EditTags } from "./modals/EditTags";

const EditThing = () => {
  const params = useParams();
  const navigate = useNavigate();
  const id = params.id as string;
  const [rolePermission, setRolePermission] = useState<any>(null);
  const [enabled, setEnabled] = useState(true);
  const [modal, setModal] = useState({
    show: false,
    name: "",
  });
  const thingQuery = useQuery({
    queryKey: [`thing`, id],
    queryFn: async () => getThing(id).catch((error) => toast.error(error.message)),
    enabled: true,
  });
  const thing = thingQuery.data;

  useEffect(() => {
    const fetchRolePermission = async () => {
      const permission = await getRolePermission(MODULENAME.DEVICELIST, id);
      setRolePermission(permission);
    };
    fetchRolePermission();
  }, []);
  useEffect(() => {
    if (thingQuery.data) {
      setEnabled(thingQuery.data.status === "enabled");
    }
  }, [thingQuery.data]);

  const onClose = () => {
    setModal({ show: false, name: "" });
  };

  const onDisplay = () => {
    thingQuery.refetch();
  };

  const enableDisableThing = () => {
    Swal.fire({
      heightAuto: false,
      icon: "warning",
      title: enabled ? "Disable Device" : "Enable Device",
      text: enabled ? "Are you sure you want to disable this device?" : "Are you sure you want to enable this device?",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: enabled ? "#d33" : "#198754",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        updateThingSetting();
      }
    });
  };

  const updateThingSetting = () => {
    if (enabled) {
      disableThing(thing?.id)
        .then(() => {
          toast.success("Device disabled successfully");
          thingQuery.refetch();
          setEnabled(false);
        })
        .catch((error) => toast.error(error.message));
    } else {
      enableThing(thing?.id)
        .then(() => {
          toast.success("Device enabled successfully");
          thingQuery.refetch();
          setEnabled(true);
        })
        .catch((error) => toast.error(error.message));
    }
  };

  const deleteThings = () => {
    Swal.fire({
      heightAuto: false,
      icon: "warning",
      title: "Delete Device",
      text: "Are you sure you want to delete this device?",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#d33",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteThing(thing?.id)
          .then(() => {
            toast.success("Device deleted successfully");
            navigate("/things");
          })
          .catch((error) => toast.error(error.message));
      }
    });
  };

  // const openUserPage = () => {
  //   navigate(`/things/${thing?.id}/assignUsers`);
  // };

  const openChannelPage = () => {
    navigate(`/things/${thing?.id}/assignChannels`);
  };

  return (
    <>
      <div className="card-header d-flex justify-content-between py-6 px-9">
        <div className="card-title"></div>

        <div className="card-toolbar">
          <button type="button" className="btn btn-light mx-2" onClick={() => window.history.back()}>
            <i className="bi bi-arrow-left"></i>
            Back
          </button>

          <button type="button" className="btn btn-primary" onClick={openChannelPage}>
            Connect
          </button>
          {/* <button type="button" className="btn btn-primary mx-2" onClick={openUserPage}>
            Share
          </button> */}
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
                Device Information
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
                      <td>{thing?.name}</td>
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
                      <td>{thing?.id}</td>
                      {rolePermission?.update && <td></td>}
                    </tr>
                    <tr>
                      <td>
                        <label className="fw-bold fs-6">Secret</label>
                      </td>
                      <td>{thing?.credentials?.secret}</td>
                      {rolePermission?.update && (
                        <td>
                          <button className="btn btn-icon btn-light btn-hover-primary btn-sm" onClick={() => setModal({ show: true, name: "secret" })}>
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
                        {thing?.tags?.map((tag: string, index: number) => (
                          <div key={index} className="badge badge-light-primary fw-bolder me-2">
                            {tag}
                          </div>
                        ))}
                      </td>
                      {rolePermission?.update && (
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
                        {!thing?.metadata || typeof thing?.metadata !== "object" ? (
                          <span className="text-muted"></span>
                        ) : (
                          <div>
                            {Object.entries(thing?.metadata).map(([key, val], index) => (
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
        </div>
      </div>
      <div className="card-footer d-flex justify-content-end py-6 px-9">
        {rolePermission?.disable && (
          <>
            {enabled ? (
              <button type="button" className="btn btn-danger mx-2" onClick={enableDisableThing}>
                <span className="indicator-label">Disable Device</span>
              </button>
            ) : (
              <button type="button" className="btn btn-success mx-2" onClick={enableDisableThing}>
                <span className="indicator-label">Enable Device</span>
              </button>
            )}
          </>
        )}
        {rolePermission?.delete && (
          <button type="button" className="btn btn-danger" onClick={deleteThings}>
            <span className="indicator-label">Delete Device</span>
          </button>
        )}
      </div>
      {modal.show && modal.name === "name" && <EditProfile data={thing} onClose={onClose} onDisplay={onDisplay} />}
      {modal.show && modal.name === "metadata" && <EditMetadata data={thing} onClose={onClose} onDisplay={onDisplay} />}
      {modal.show && modal.name === "secret" && <EditSecret data={thing} onClose={onClose} onDisplay={onDisplay} />}
      {modal.show && modal.name === "tags" && <EditTags data={thing} onClose={onClose} onDisplay={onDisplay} />}
    </>
  );
};

export { EditThing };
