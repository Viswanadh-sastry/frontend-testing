import Papa from "papaparse";
import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { createUser } from "../../../api/UserAPI";
import { getGeneratePassword, getJWTToken, getRootToken, getUserList, getVToken, updateTokenList } from "../../../api/VaultAPI";

interface IAddUserProps {
  onCloseImportUser: () => void;
  onGetUserList: () => void;
  onShowImportUser: boolean;
}

const ImportUser = ({ onCloseImportUser, onGetUserList, onShowImportUser }: IAddUserProps) => {
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
            // Convert METADATA string to an object
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

            // Parse the TAGS field to convert it to an array
            let tags: string[] = [];
            try {
              if (row.TAGS) {
                // Split the TAGS string by commas and trim spaces
                tags = row.TAGS.split(",").map((tag: string) => tag.trim());
              }
            } catch (e) {
              toast.error("Error parsing tags. Ensure they are in valid JSON format.");
              setIsSubmitting(false);
              return;
            }

            const userData = {
              name: row.NAME,
              credentials: {
                identity: row.IDENTITY,
                secret: row.SECRET,
              },
              tags, // Add the parsed tags array
              metadata, // Add the parsed metadata object
              status: "enabled",
            };
            await createUser(userData)
              .then(async () => {
                // Create user in vault
                const username = row.IDENTITY.split("@")[0];
                const rootAuth = await getRootToken().catch((error) => toast.error(error?.response?.data?.message || "Something went wrong"));
                getGeneratePassword(username)
                  .then(async (response) => {
                    const userData = {
                      username: username,
                      password: response.password,
                    };
                    const vToken = await getVToken(userData, rootAuth.root_token).catch((error) => toast.error(error?.response?.data?.message || "Something went wrong"));
                    await getJWTToken(username, vToken.auth.client_token).catch((error) => toast.error(error?.response?.data?.message || "Something went wrong"));
                    const userList = await getUserList().catch((error) => toast.error(error?.response?.data?.message || "Something went wrong"));
                    // find and update the user in the list
                    const user = userList.find((user: any) => user.username === username);
                    if (user) {
                      user.token = vToken.auth.client_token;
                    }
                    const params = {
                      list: userList,
                    };
                    await updateTokenList(params).catch((error) => toast.error(error?.response?.data?.message || "Something went wrong"));
                  })
                  .catch((error) => toast.error(error?.response?.data?.message || "Something went wrong"));
              })
              .catch((error) => toast.error(error?.response?.data?.message || "Something went wrong"));
          }

          toast.success("User created successfully");
          onCloseImportUser();
          onGetUserList();
        } catch (error: any) {
          toast.error(`Error creating user: ${error.message}`);
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
    <Modal show={onShowImportUser} onHide={onCloseImportUser} aria-labelledby="example-modal-sizes-title-lg">
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">Add User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <span>
          Add csv file containing user names. Find a sample csv file here
          <br />
          <span className="text-muted">
            <input type="file" accept=".csv" onChange={handleFileChange} />
          </span>
        </span>
      </Modal.Body>
      <Modal.Footer>
        <div>
          <button type="button" onClick={onCloseImportUser} className="btn btn-light btn-elevate mx-2" disabled={isSubmitting}>
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

export { ImportUser };
