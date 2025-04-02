import { useQuery } from "@tanstack/react-query";
import { Table } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getUser } from "../../../users/api/UserAPI";
const DisplayUserData = () => {
  const params = useParams();
  const id = params.id as string;

  const thingUserQuery = useQuery({
    queryKey: [`thingUser`, id],
    queryFn: async () => getUser(id).catch((error) => toast.error(error?.response?.data?.message || "Something went wrong")),
    enabled: true,
  });
  const thingUser = thingUserQuery.data;

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
              <td>{thingUser?.name}</td>
            </tr>
            <tr>
              <td>
                <label className="fw-bold fs-6">ID</label>
              </td>
              <td>{thingUser?.id}</td>
              <td></td>
            </tr>

            <tr>
              <td>
                <label className="fw-bold fs-6">Identity</label>
              </td>
              <td>{thingUser?.parent_id}</td>
              <td></td>
            </tr>

            <tr>
              <td>
                <label className="fw-bold fs-6">Tags</label>
              </td>
              <td>{thingUser?.description}</td>
            </tr>

            <tr>
              <td>
                <label className="fw-bold fs-6">Metadata</label>
              </td>
              <td>
                {!thingUser?.metadata || typeof thingUser?.metadata !== "object" ? (
                  <span className="text-muted"></span>
                ) : (
                  <div>
                    {Object.entries(thingUser?.metadata).map(([key, val], index) => (
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

export { DisplayUserData };
