import Papa from "papaparse";
import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { addDeviceProfile } from "../../../api/DeviceProfileAPI";
import { getLORAAuth } from "../../../../auth/core/LORAHelpers";

interface IAddDeviceProfileProps {
  onCloseImportDeviceProfile: () => void;
  onGetDeviceProfileList: () => void;
  onShowImportDeviceProfile: boolean;
}

const ImportDeviceProfiles = ({ onCloseImportDeviceProfile, onGetDeviceProfileList, onShowImportDeviceProfile }: IAddDeviceProfileProps) => {
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
            const deviceProfileData = {
              deviceProfile: {
                tenantId: getLORAAuth()?.tenant_id,
                name: row.NAME,
                description: row.DESCRIPTION,
                region: row.REGION,
                macVersion: row.MACVERSION,
                regParamsRevision: row.REGPARAMSREVISION,
                flushQueueOnActivate: String(row.FLUSHQUEUEONACTIVATE).toUpperCase() === "TRUE" ? true : false,
                supportsOtaa: String(row.SUPPORTSOTAA).toUpperCase() === "TRUE" ? true : false,
              },
            };
            await addDeviceProfile(deviceProfileData);
          }

          toast.success("Device Profiles created successfully");
          onCloseImportDeviceProfile();
          onGetDeviceProfileList();
        } catch (error: any) {
          toast.error(`Error creating device profile: ${error.message}`);
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
    <Modal show={onShowImportDeviceProfile} onHide={onCloseImportDeviceProfile} aria-labelledby="example-modal-sizes-title-lg">
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">Add Device Profiles</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <span>
          Add csv file containing deviceProfile names. Find a sample csv file here
          <br />
          <span className="text-muted">
            <input type="file" accept=".csv" onChange={handleFileChange} />
          </span>
        </span>
      </Modal.Body>
      <Modal.Footer>
        <div>
          <button type="button" onClick={onCloseImportDeviceProfile} className="btn btn-light btn-elevate mx-2" disabled={isSubmitting}>
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

export { ImportDeviceProfiles };
