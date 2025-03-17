import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { disableGroup, enableGroup, getGroup, deleteGroup } from "../../api/GroupAPI";
import { EditDescription } from "./modals/EditDescription";
import { EditMetadata } from "./modals/EditMetadata";
import { EditName } from "./modals/EditName";
import { UserTable } from "../GroupUser/UserList/UserTable";
import { getRolePermission, MODULENAME } from "../../../auth/core/RoleHelpers";

const EditGroup = () => {
  const navigate = useNavigate();
  const params = useParams();
  const id = params.id as string;
  const [rolePermission, setRolePermission] = useState<any>(null);
  const [enabled, setEnabled] = useState(true);
  const [modal, setModal] = useState({
    show: false,
    name: "",
  });
  const [parentNames, setParentNames] = useState<string[]>([]);

  const groupQuery = useQuery({
    queryKey: [`group`, id],
    queryFn: async () => getGroup(id).catch((error) => toast.error(error?.response?.data?.error || "Something went wrong")),
    enabled: true,
  });
  const group = groupQuery.data;

  useEffect(() => {
    const fetchRolePermission = async () => {
      const permission = await getRolePermission(MODULENAME.ASSETGROUPLIST, id);
      setRolePermission(permission);
    };
    fetchRolePermission();
  }, []);
  useEffect(() => {
    if (groupQuery.data) {
      setEnabled(groupQuery.data.status === "enabled");
      fetchParentNames(groupQuery.data.parent_id);
    }
  }, [groupQuery.data]);

  const fetchParentNames = async (parentId: string | null) => {
    const names: string[] = [];
    let currentParentId = parentId;

    while (currentParentId) {
      const parentGroup = await getGroup(currentParentId);
      if (parentGroup) {
        names.push(parentGroup.name);
        currentParentId = parentGroup.parent_id;
      } else {
        currentParentId = null;
      }
    }
    setParentNames(names);
  };

  const onClose = () => {
    setModal({ show: false, name: "" });
  };

  const onDisplay = () => {
    groupQuery.refetch();
  };

  const enableDisableGroup = () => {
    Swal.fire({
      heightAuto: false,
      icon: "warning",
      title: enabled ? "Disable Asset Group" : "Enable Asset Group",
      text: enabled ? "Are you sure you want to disable this asset group?" : "Are you sure you want to enable this asset group?",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: enabled ? "#d33" : "#198754",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        updateGroupSetting();
      }
    });
  };

  const updateGroupSetting = () => {
    if (enabled) {
      disableGroup(group?.id)
        .then(() => {
          toast.success("Asset Group disabled successfully");
          groupQuery.refetch();
          setEnabled(false);
        })
        .catch((error) => toast.error(error?.response?.data?.error || "Something went wrong"));
    } else {
      enableGroup(group?.id)
        .then(() => {
          toast.success("Asset Group enabled successfully");
          groupQuery.refetch();
          setEnabled(true);
        })
        .catch((error) => toast.error(error?.response?.data?.error || "Something went wrong"));
    }
  };

  const deleteAssetGroup = () => {
    Swal.fire({
      heightAuto: false,
      icon: "warning",
      title: "Delete Asset Group",
      text: "Are you sure you want to delete this asset group?",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#d33",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteGroup(group?.id)
          .then(() => {
            toast.success("Asset Group deleted successfully");
            navigate("/groups");
          })
          .catch((error) => toast.error(error?.response?.data?.error || "Something went wrong"));
      }
    });
  };

  const openChannelPage = () => {
    navigate(`/groups/${group?.id}/assignChannels`);
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
            Assign Assets
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
                Asset Group Information
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
                      <td>{group?.name}</td>
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
                      <td>{group?.id}</td>
                      {rolePermission?.update && <td></td>}
                    </tr>

                    <tr>
                      <td>
                        <label className="fw-bold fs-6">Parent Asset Group</label>
                      </td>
                      <td>{parentNames.join(" > ")}</td> {/* Display parent names in sequence */}
                      {rolePermission?.update && <td></td>}
                    </tr>

                    <tr>
                      <td>
                        <label className="fw-bold fs-6">Description</label>
                      </td>
                      <td>{group?.description}</td>
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
                        {!group?.metadata || typeof group?.metadata !== "object" ? (
                          <span className="text-muted"></span>
                        ) : (
                          <div>
                            {Object.entries(group?.metadata).map(([key, val], index) => (
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
              <button type="button" className="btn btn-danger mx-2" onClick={enableDisableGroup}>
                <span className="indicator-label">Disable Asset Group</span>
              </button>
            ) : (
              <button type="button" className="btn btn-success mx-2" onClick={enableDisableGroup}>
                <span className="indicator-label">Enable Asset Group</span>
              </button>
            )}
          </>
        )}
        {rolePermission?.delete && (
          <button type="button" className="btn btn-danger" onClick={deleteAssetGroup}>
            <span className="indicator-label">Delete Asset Group</span>
          </button>
        )}
      </div>
      {modal.show && modal.name === "name" && <EditName data={group} onClose={onClose} onDisplay={onDisplay} />}
      {modal.show && modal.name === "metadata" && <EditMetadata data={group} onClose={onClose} onDisplay={onDisplay} />}
      {modal.show && modal.name === "description" && <EditDescription data={group} onClose={onClose} onDisplay={onDisplay} />}
    </>
  );
};

export { EditGroup };
