import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { convertGMTToLocalDateTime } from "../../../../constants/Common";
import { getRolePermission, MODULENAME } from "../../../auth/core/RoleHelpers";
import { getUser } from "../../../users/api/UserAPI";
import { disableDomain, enableDomain, getDomain } from "../../api/DomainsAPI";
import { EditAlias } from "./modals/EditAlias";
import { EditMetadata } from "./modals/EditMetadata";
import { EditName } from "./modals/EditName";
import { EditTags } from "./modals/EditTags";

const ViewDomain = () => {
  const params = useParams();
  const id = params.id as string;
  const [rolePermission, setRolePermission] = useState<any>(null);
  const [enabled, setEnabled] = useState(true);
  const [modal, setModal] = useState({
    show: false,
    name: "",
  });
  const domainQuery = useQuery({
    queryKey: [`domain`, id],
    queryFn: async () =>
      getDomain(id)
        .then(async (response) => {
          return {
            ...response,
            created_by: await getUser(response.created_by)
              .then((user) => user.name)
              .catch(() => response.created_by),
            created_at: convertGMTToLocalDateTime(response.created_at),
          };
        })
        .catch((error) => toast.error(error?.response?.data?.error || "Something went wrong")),
    enabled: true,
  });
  const domain = domainQuery.data;

  useEffect(() => {
    const fetchRolePermission = async () => {
      const permission = await getRolePermission(MODULENAME.ORGANIZATIONINFO);
      setRolePermission(permission);
    };
    fetchRolePermission();
  }, []);
  useEffect(() => {
    if (domainQuery.data) {
      setEnabled(domainQuery.data.status === "enabled");
    }
  }, [domainQuery.data]);

  const onClose = () => {
    setModal({ show: false, name: "" });
  };

  const onDisplay = () => {
    domainQuery.refetch();
  };

  const enableDisableDomain = () => {
    Swal.fire({
      heightAuto: false,
      icon: "warning",
      title: enabled ? "Disable Organization" : "Enable Organization",
      text: enabled ? "Are you sure you want to disable this organization?" : "Are you sure you want to enable this organization?",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: enabled ? "#d33" : "#198754",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        updateDomainSetting();
      }
    });
  };

  const updateDomainSetting = () => {
    if (enabled) {
      disableDomain(domain?.id)
        .then(() => {
          toast.success("Organization disabled successfully");
          domainQuery.refetch();
          setEnabled(false);
        })
        .catch((error) => toast.error(error?.response?.data?.error || "Something went wrong"));
    } else {
      enableDomain(domain?.id)
        .then(() => {
          toast.success("Organization enabled successfully");
          domainQuery.refetch();
          setEnabled(true);
        })
        .catch((error) => toast.error(error?.response?.data?.error || "Something went wrong"));
    }
  };

  return (
    <>
      <div className="card-header d-flex justify-content-between py-6 px-9">
        <div className="card-title">
          <span className="card-label">Welcome to the Organization details page. You can update your organization details in this page.</span>
          <h3 className="fw-bolder">Organization Information</h3>
        </div>
      </div>
      <div className="card-body p-9">
        <Table responsive bordered>
          <tbody>
            <tr>
              <td>
                <label className="fw-bold fs-6">Name</label>
              </td>
              <td>{domain?.name}</td>
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
                <label className="fw-bold fs-6">Tags</label>
              </td>
              <td>
                {domain?.tags?.map((tag: string, index: number) => (
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
                <label className="fw-bold fs-6">Alias</label>
              </td>
              <td>{domain?.alias}</td>
              {rolePermission?.update && (
                <td>
                  <button className="btn btn-icon btn-light btn-hover-primary btn-sm" onClick={() => setModal({ show: true, name: "alias" })}>
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
                {!domain?.metadata || typeof domain?.metadata !== "object" ? (
                  <span className="text-muted"></span>
                ) : (
                  <div>
                    {Object.entries(domain?.metadata).map(([key, val], index) => (
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
            <tr>
              <td>
                <label className="fw-bold fs-6">Created By</label>
              </td>
              <td>{domain?.created_by}</td>
              {rolePermission?.update && <td></td>}
            </tr>
            <tr>
              <td>
                <label className="fw-bold fs-6">Created At</label>
              </td>
              <td>{domain?.created_at}</td>
              {rolePermission?.update && <td></td>}
            </tr>
          </tbody>
        </Table>
      </div>
      {rolePermission?.disable && (
        <div className="card-footer d-flex justify-content-end py-6 px-9">
          {enabled ? (
            <button type="button" className="btn btn-danger mx-2" onClick={enableDisableDomain}>
              <span className="indicator-label">Disable Organization</span>
            </button>
          ) : (
            <button type="button" className="btn btn-success mx-2" onClick={enableDisableDomain}>
              <span className="indicator-label">Enable Organization</span>
            </button>
          )}
        </div>
      )}
      {modal.show && modal.name === "name" && <EditName data={domain} onClose={onClose} onDisplay={onDisplay} />}
      {modal.show && modal.name === "metadata" && <EditMetadata data={domain} onClose={onClose} onDisplay={onDisplay} />}
      {modal.show && modal.name === "alias" && <EditAlias data={domain} onClose={onClose} onDisplay={onDisplay} />}
      {modal.show && modal.name === "tags" && <EditTags data={domain} onClose={onClose} onDisplay={onDisplay} />}
    </>
  );
};

export { ViewDomain };
