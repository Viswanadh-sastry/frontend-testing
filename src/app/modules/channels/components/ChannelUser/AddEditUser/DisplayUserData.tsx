import { useQuery } from "@tanstack/react-query";
import { Table } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getUser } from "../../../../users/api/UserAPI";

const DisplayUserData = () => {
  const params = useParams();
  const id = params.id as string;

  const channelUserQuery = useQuery({
    queryKey: [`channelUser`, id],
    queryFn: async () => getUser(id).catch((error) => toast.error(error?.response?.data?.error || "Something went wrong")),
    enabled: true,
  });
  const channelUser = channelUserQuery.data;

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
              <td>{channelUser?.name}</td>
            </tr>
            <tr>
              <td>
                <label className="fw-bold fs-6">ID</label>
              </td>
              <td>{channelUser?.id}</td>
              <td></td>
            </tr>

            <tr>
              <td>
                <label className="fw-bold fs-6">Identity</label>
              </td>
              <td>{channelUser?.parent_id}</td>
              <td></td>
            </tr>

            <tr>
              <td>
                <label className="fw-bold fs-6">Tags</label>
              </td>
              <td>{channelUser?.description}</td>
            </tr>

            <tr>
              <td>
                <label className="fw-bold fs-6">Metadata</label>
              </td>
              <td>
                {!channelUser?.metadata || typeof channelUser?.metadata !== "object" ? (
                  <span className="text-muted"></span>
                ) : (
                  <div>
                    {Object.entries(channelUser?.metadata).map(([key, val], index) => (
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
