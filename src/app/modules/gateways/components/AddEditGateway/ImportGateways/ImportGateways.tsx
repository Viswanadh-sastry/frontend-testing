import Papa from "papaparse";
import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { addGateway } from "../../../api/GatewayAPI";
import { getLORAAuth } from "../../../../auth/core/LORAHelpers";

interface IAddGatewayProps {
  onCloseImportGateway: () => void;
  onGetGatewayList: () => void;
  onShowImportGateway: boolean;
}

const ImportGateways = ({ onCloseImportGateway, onGetGatewayList, onShowImportGateway }: IAddGatewayProps) => {
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
            // Process and convert METADATA string to a proper JSON object
            let metadata = {};
            try {
              if (row.METADATA) {
                // Split the METADATA string by commas to get key-value pairs
                const metadataPairs = row.METADATA.split(",");
                metadataPairs.forEach((pair: string) => {
                  const [key, value] = pair.split(":").map((str) => str.trim());
                  metadata = { ...metadata, [key]: value };
                });
              }
            } catch (e) {
              toast.error("Error parsing metadata. Ensure it is in valid format.");
              setIsSubmitting(false);
              return;
            }

            // Process and convert TAGS string to an array
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

            // Process and convert LOCATION string to a proper JSON object
            let location = {
              accuracy: 0,
              latitude: 19.076,
              longitude: 72.8777,
              altitude: 0,
              source: "UNKNOWN",
            };
            try {
              if (row.LOCATION) {
                // Split the LOCATION string by commas to get key-value pairs
                const locationPairs = row.LOCATION.split(",");
                locationPairs.forEach((pair: string) => {
                  const [key, value] = pair.split(":").map((str) => str.trim());
                  location = { ...location, [key]: value };
                });
              }
            } catch (e) {
              toast.error("Error parsing location. Ensure it is in valid format.");
              setIsSubmitting(false);
              return;
            }

            const gatewayData = {
              gateway: {
                tenantId: getLORAAuth()?.tenant_id,
                name: row.NAME,
                description: row.DESCRIPTION,
                gatewayId: row.GATEWAYID,
                statsInterval: row.STATSINTERVAL || 0,
                location,
                metadata, // Add the processed metadata object
                tags, // Add the processed tags array
              },
            };

            await addGateway(gatewayData);
          }

          toast.success("Gateways created successfully");
          onCloseImportGateway();
          onGetGatewayList();
        } catch (error: any) {
          toast.error(`Error creating gateway: ${error.message}`);
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
    <Modal show={onShowImportGateway} onHide={onCloseImportGateway} aria-labelledby="example-modal-sizes-title-lg">
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">Add Gateways</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <span>
          Add csv file containing gateway names. Find a sample csv file here
          <br />
          <span className="text-muted">
            <input type="file" accept=".csv" onChange={handleFileChange} />
          </span>
        </span>
      </Modal.Body>
      <Modal.Footer>
        <div>
          <button type="button" onClick={onCloseImportGateway} className="btn btn-light btn-elevate mx-2" disabled={isSubmitting}>
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

export { ImportGateways };
