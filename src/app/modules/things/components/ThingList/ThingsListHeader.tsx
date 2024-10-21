import jsPDF from "jspdf";
import "jspdf-autotable";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import { KTIcon } from "../../../../../_metronic/helpers";
import { getRolePermission, MODULENAME } from "../../../auth/core/RoleHelpers";
import { getThingListAll } from "../../api/ThingAPI";
import { getThingChannelList } from "../../api/ThingChannelAPI";

interface IThingsListHeaderProps {
  onShowAddThing: () => void;
  onShowImportThing: () => void;
  setFilterThing: Dispatch<
    SetStateAction<{
      limit: number;
      offset: number;
      name: string;
      metadata: string;
      tags: string;
      status: string;
    }>
  >;
  filterThing: {
    limit: number;
    offset: number;
    name: string;
    metadata: string;
    tags: string;
    status: string;
  };
}

const ThingsListHeader = ({ onShowAddThing, setFilterThing, onShowImportThing, filterThing }: IThingsListHeaderProps) => {
  const [rolePermission, setRolePermission] = useState<any>(null);

  useEffect(() => {
    const fetchRolePermission = async () => {
      const permission = await getRolePermission(MODULENAME.DEVICELIST);
      setRolePermission(permission);
    };
    fetchRolePermission();
  }, []);

  const onChangeStatus = (e: any) => {
    setFilterThing((prevState: any) => ({
      ...prevState,
      status: e.target.value,
    }));
  };

  const getThingData = async () => {
    const filterThings = {
      limit: 100,
      offset: 0,
      name: filterThing.name,
      metadata: "",
      tags: "",
      status: filterThing.status,
    };
    const filterChannel = {
      limit: 10,
      offset: 0,
      name: "",
      metadata: "",
      status: "all",
    };
    return await getThingListAll(filterThings)
      .then(async (response) => {
        const things = await Promise.all(
          response.things.map(async (thing: any) => {
            try {
              const channel = await getThingChannelList(thing.id, filterChannel);
              return {
                ...thing,
                isConnected: channel.total > 0,
              };
            } catch (error) {
              return {
                ...thing,
                isConnected: false,
              };
            }
          })
        );
        return { ...response, things };
      })
      .catch((error) => toast.error(error.message));
  };

  const convertToCSV = (data: any[], headerOrder: string[]) => {
    // Function to convert an object (like metadata) to a comma-separated key-value string
    const convertObjectToCommaSeparated = (obj: any) => {
      return Object.entries(obj)
        .map(([key, value]) => `${key}: ${value}`)
        .join(", ");
    };

    // Function to convert an array (like tags) to a comma-separated string
    const convertArrayToCommaSeparated = (arr: any[]) => {
      return arr.join(", ");
    };

    // Create a header with the specified order
    const header = headerOrder.map((header) => header.toUpperCase()).join(",") + "\n";

    // Map each row to a CSV string
    const rows = data
      .map((row: any) => {
        return headerOrder
          .map((key) => {
            let value = row[key];

            // Handle credentials.identity specifically
            if (key === "identity" && row.credentials) {
              value = row.credentials.identity;
            }

            // Handle metadata and tags as comma-separated values
            if (key === "metadata" && typeof value === "object" && value !== null) {
              value = convertObjectToCommaSeparated(value);
            } else if (key === "tags" && Array.isArray(value)) {
              value = convertArrayToCommaSeparated(value);
            }

            // Enclose each value in quotes if not undefined
            return value !== undefined ? `"${value}"` : '""';
          })
          .join(",");
      })
      .join("\n");

    return header + rows;
  };

  // Convert data to CSV and download
  const downloadCSV = async () => {
    const { things: thingList } = await getThingData();

    if (thingList.length === 0) {
      toast.error("No data found to download!");
      return;
    }

    // Define the order of columns for the CSV
    const headerOrder = ["id", "name", "tags", "metadata", "created_at", "isConnected", "status"];

    const csvString = convertToCSV(thingList, headerOrder);
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Device-List.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadXlsx = async () => {
    const { things: thingList } = await getThingData();

    // Define the order of columns for the XLSX
    const headerOrder = ["id", "name", "tags", "metadata", "created_at", "isConnected", "status"];
    const headerLabels = headerOrder.map((header) => header.toUpperCase());

    // Function to convert an object (like metadata) to a comma-separated key-value string
    const convertObjectToCommaSeparated = (obj: any) => {
      return Object.entries(obj)
        .map(([key, value]) => `${key}: ${value}`)
        .join(", ");
    };

    // Function to convert an array (like tags) to a comma-separated string
    const convertArrayToCommaSeparated = (arr: any[]) => {
      return arr.join(", ");
    };

    // Prepare the data in the correct order with formatted metadata and tags
    const formattedData = thingList.map((item: any) => {
      return headerOrder.reduce((acc: Record<string, any>, key) => {
        let value = item[key];

        if (key === "tags") {
          if (typeof value === "string") {
            try {
              value = JSON.parse(value); // Parse the string if it's a valid JSON array
            } catch (error) {
              value = []; // Fallback to an empty array if parsing fails
            }
          }
          if (Array.isArray(value)) {
            value = convertArrayToCommaSeparated(value); // Convert tags array to comma-separated string
          }
        }

        if (key === "metadata" && typeof value === "object" && value !== null) {
          value = convertObjectToCommaSeparated(value); // Convert metadata object to comma-separated key-value pairs
        }

        acc[key] = value !== undefined ? value : "";
        return acc;
      }, {} as Record<string, any>);
    });

    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // Convert the formatted data to a worksheet with headers
    const worksheet = XLSX.utils.json_to_sheet(formattedData, { header: headerOrder });

    // Update the headers to uppercase
    worksheet["!cols"] = headerOrder.map(() => ({ width: 20 })); // Optional: Set column widths
    headerOrder.forEach((key, index) => {
      worksheet[XLSX.utils.encode_cell({ r: 0, c: index })].v = headerLabels[index];
    });

    // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Generate a binary string representation of the workbook
    const workbookBinary = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

    // Create a Blob from the binary string
    const blob = new Blob([workbookBinary], { type: "application/octet-stream" });

    // Create a download link for the blob
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Device-List.xlsx";

    // Append the anchor to the body
    document.body.appendChild(a);

    // Programmatically click the anchor to trigger the download
    a.click();

    // Clean up by removing the anchor and revoking the object URL
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // download pdf
  const downloadPDF = async () => {
    const { things: thingList } = await getThingData();

    if (thingList.length === 0) {
      toast.error("No data found to download!");
      return;
    }

    const doc = new jsPDF();
    const headerOrder = ["id", "name", "tags", "metadata", "created_at", "isConnected", "status"];
    const displayHeader = headerOrder.map(
      (key) =>
        ({
          id: "ID",
          name: "NAME",
          tags: "TAGS",
          metadata: "METADATA",
          created_at: "CREATED AT",
          isConnected: "IS CONNECTED",
          status: "STATUS",
        }[key])
    );

    const data = thingList.map((item: any) =>
      headerOrder.map((key) => {
        if (key === "metadata" && typeof item[key] === "object") {
          return Object.keys(item[key])
            .map((k) => `${k}: ${item[key][k]}`)
            .join(", ");
        }
        return item[key] || "";
      })
    );

    // Set the title and calculate its width
    const title = "Device List";
    const pageWidth = doc.internal.pageSize.getWidth();
    const textWidth = doc.getTextWidth(title);
    const textX = (pageWidth - textWidth) / 2; // Calculate the x-coordinate for center alignment

    // Add centered text to the document
    doc.text(title, textX, 10);

    // Define column widths
    const columnWidths = {
      0: { cellWidth: 25 }, // ID
      1: { cellWidth: 25 }, // Name
      2: { cellWidth: 20 }, // Tags
      3: { cellWidth: 40 }, // Metadata (wider to accommodate JSON)
      4: { cellWidth: 30 }, // Created At
      5: { cellWidth: 15 }, // Connected
      6: { cellWidth: 15 }, // Status
    };

    (doc as any).autoTable({
      head: [displayHeader],
      body: data,
      startY: 20,
      columnStyles: columnWidths,
      styles: {
        fontSize: 9, // Adjust this value to make the text smaller
        overflow: "linebreak",
      },
      headStyles: {
        fontSize: 8, // Smaller font size for the header
      },
    });
    doc.save("Device-List.pdf");
  };

  return (
    <>
      <div className="card-header border-0 pt-6">
        <div className="card-title">
          {/* begin::Search */}
          <div className="d-flex align-items-center position-relative my-1">
            <input
              type="text"
              className="form-control form-control form-control-lg mx-2"
              placeholder="Search"
              onChange={(e) =>
                setFilterThing((prevState: any) => ({
                  ...prevState,
                  name: e.target.value,
                }))
              }
            />
            <select className="form-select form-select-solid w-200px ps-8" onChange={onChangeStatus} defaultValue={"enabled"}>
              <option value="all">Status: all</option>
              <option value="enabled">Status: enabled</option>
              <option value="disabled">Status: disabled</option>
            </select>
          </div>
          {/* end::Search */}
        </div>

        <div className="card-toolbar">
          <div className="d-flex justify-content-end" data-kt-thing-table-toolbar="base">
            {rolePermission?.create && (
              <>
                <button type="button" className="btn btn-primary" onClick={onShowAddThing}>
                  <KTIcon iconName="plus" className="fs-2" />
                  Add Device
                </button>
                <button type="button" className="btn btn-light-primary me-2 mx-2" onClick={onShowImportThing}>
                  <KTIcon iconName="exit-up" className="fs-2" />
                  Import
                </button>
              </>
            )}
            <button type="button" className="btn btn-light-primary" data-kt-menu-trigger="click" data-kt-menu-placement="bottom-end">
              <KTIcon iconName="exit-down" className="fs-2" />
              Export
            </button>
            <div className="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-bold fs-7 w-125px py-4" data-kt-menu="true">
              <div className="menu-item px-3" onClick={downloadXlsx}>
                <a className="menu-link px-3">XLSX File</a>
              </div>
              <div className="menu-item px-3" onClick={downloadCSV}>
                <a className="menu-link px-3">CSV File</a>
              </div>
              <div className="menu-item px-3" onClick={downloadPDF}>
                <a className="menu-link px-3">PDF File</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export { ThingsListHeader };
