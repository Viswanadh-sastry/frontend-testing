import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Table } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getStream } from "../../api/StreamAPI";

const EditStream = () => {
  const params = useParams();
  const id = params.id as string;
  const [modal, setModal] = useState({
    show: false,
    name: "",
  });
  console.log("modal", modal);
  const streamQuery = useQuery({
    queryKey: [`stream`, id],
    queryFn: async () => getStream(id).catch((error) => toast.error(error.message)),
    enabled: true,
  });
  const stream = streamQuery.data;

  return (
    <>
      <div className="card-header d-flex justify-content-between py-6 px-9">
        <div className="card-title"></div>

        <div className="card-toolbar">
          <button type="button" className="btn btn-light mx-2" onClick={() => window.history.back()}>
            <i className="bi bi-arrow-left"></i>
            Back
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
                Stream Information
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
                      <td>{stream?.name}</td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>
                        <label className="fw-bold fs-6">SQL</label>
                      </td>
                      <td>{stream?.sql}</td>
                      <td>
                        <button className="btn btn-icon btn-light btn-hover-primary btn-sm" onClick={() => setModal({ show: true, name: "sql" })}>
                          <i className="bi bi-pencil-square"></i>
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label className="fw-bold fs-6">ID</label>
                      </td>
                      <td>{stream?.id}</td>
                      <td></td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export { EditStream };
