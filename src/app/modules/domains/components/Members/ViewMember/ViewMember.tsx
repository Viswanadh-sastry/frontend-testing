import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Table } from "react-bootstrap";
import { toast } from "react-toastify";
import { getUser } from "../../../../users/api/UserAPI";

const ViewMember = () => {
  const params = useParams();
  const userId = params.userId as string;
  const memberQuery = useQuery({
    queryKey: [`user`, userId],
    queryFn: async () => getUser(userId).catch((error) => toast.error(error?.response?.data?.message || "Something went wrong")),
    enabled: true,
  });
  const member = memberQuery.data;

  return (
    <>
      <div className="card-header d-flex justify-content-between py-6 px-9">
        <div className="card-title">
          <h3 className="fw-bolder">Member Information</h3>
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
                <label className="fw-bold fs-6">Name</label>
              </td>
              <td>{member?.name}</td>
            </tr>
            <tr>
              <td>
                <label className="fw-bold fs-6">ID</label>
              </td>
              <td>{member?.id}</td>
            </tr>
            <tr>
              <td>
                <label className="fw-bold fs-6">Identity</label>
              </td>
              <td>{member?.credentials.identity}</td>
            </tr>
            <tr>
              <td>
                <label className="fw-bold fs-6">Tags</label>
              </td>
              <td>
                {member?.tags?.map((tag: string, index: number) => (
                  <div key={index} className="badge badge-light-primary fw-bolder me-2">
                    {tag}
                  </div>
                ))}
              </td>
            </tr>
            <tr>
              <td>
                <label className="fw-bold fs-6">Metadata</label>
              </td>
              <td>
                {!member?.metadata || typeof member?.metadata !== "object" ? (
                  <span className="text-muted"></span>
                ) : (
                  <div>
                    {Object.entries(member?.metadata).map(([key, val], index) => (
                      <span key={index} className="badge badge-light-primary mr-2" style={{ display: "inline-block", marginBottom: "4px", marginRight: "4px" }}>
                        {`${key}: ${val}`}
                      </span>
                    ))}
                  </div>
                )}
              </td>
            </tr>
          </tbody>
        </Table>
      </div>
    </>
  );
};

export { ViewMember };
