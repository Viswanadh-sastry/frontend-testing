import Papa from "papaparse";
import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { addApplication } from "../../../api/ApplicationAPI";
import { getLORAAuth } from "../../../../auth/core/LORAHelpers";

interface IAddApplicationProps {
  onCloseImportApplication: () => void;
  onGetApplicationList: () => void;
  onShowImportApplication: boolean;
}

const ImportApplications = ({ onCloseImportApplication, onGetApplicationList, onShowImportApplication }: IAddApplicationProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile);
    } else {
      toast.error("Please upload a valid CSV file.");
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      toast.error("No file selected.");
      return;
    }

    setIsSubmitting(true);

    // Parse the CSV file
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results: any) => {
        const { data } = results;
        try {
          for (const row of data) {
            // Process and convert TAGS string to a proper JSON object
            let tags = {};
            try {
              if (row.TAGS) {
                // Split the TAGS string by commas to get key-value pairs
                const tagsPairs = row.TAGS.split(",");
                tagsPairs.forEach((pair: string) => {
                  const [key, value] = pair.split(":").map((str) => str.trim());
                  tags = { ...tags, [key]: value };
                });
              }
            } catch (e) {
              toast.error("Error parsing tags. Ensure it is in valid format.");
              setIsSubmitting(false);
              return;
            }

            const applicationData = {
              application: {
                tenantId: getLORAAuth()?.tenant_id,
                name: row.NAME,
                description: row.DESCRIPTION,
                tags, // Add the processed tags array
              },
            };

            await addApplication(applicationData);
          }

          toast.success("Applications created successfully");
          onCloseImportApplication();
          onGetApplicationList();
        } catch (error: any) {
          toast.error(`Error creating application: ${error.message}`);
        } finally {
          setIsSubmitting(false);
        }
      },
      error: (error: any) => {
        toast.error(`Error parsing CSV: ${error.message}`);
        setIsSubmitting(false);
      },
    });
  };

  return (
    <Modal show={onShowImportApplication} onHide={onCloseImportApplication} aria-labelledby="example-modal-sizes-title-lg">
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">Add Applications</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <span>
          Add csv file containing application names. Find a sample csv file here
          <br />
          <span className="text-muted">
            <input type="file" accept=".csv" onChange={handleFileChange} />
          </span>
        </span>
      </Modal.Body>
      <Modal.Footer>
        <div>
          <button type="button" onClick={onCloseImportApplication} className="btn btn-light btn-elevate mx-2" disabled={isSubmitting}>
            No, Cancel
          </button>
          <> </>
          <button type="button" className="btn btn-primary" onClick={handleSubmit} disabled={isSubmitting}>
            <span className="indicator-label">{isSubmitting ? "Submitting..." : "Submit"}</span>
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export { ImportApplications };
