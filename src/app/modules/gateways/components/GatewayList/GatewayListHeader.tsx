import jsPDF from "jspdf";
import "jspdf-autotable";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import { KTIcon } from "../../../../../_metronic/helpers";
import { getLORAAuth } from "../../../auth/core/LORAHelpers";
import { getGateway } from "../../api/GatewayAPI";

interface IGatewayListHeaderProps {
  onShowImportGateway: () => void;
}

const GatewayListHeader = ({ onShowImportGateway }: IGatewayListHeaderProps) => {
  const navigate = useNavigate();

  const convertToCSV = (data: any[], headerOrder: string[]) => {
    // Create a header with the specified order
    const header = headerOrder.map((header) => header.toUpperCase()).join(",") + "\n";

    // Map each row to a CSV string
    const rows = data
      .map((row: any) => {
        return headerOrder
          .map((key) => {
            let value = row[key];

            // Handle location as JSON string
            if ((key === "location" || key === "properties") && typeof value === "object" && value) {
              value = convertObjectToCommaSeparated(value);
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
    const { result: gatewayList } = await getGateway({
      limit: 1000000000,
      offset: 0,
      tenantId: getLORAAuth()?.tenant_id || "",
    });
    if (gatewayList.length === 0) {
      toast.error("No data found to download!");
      return;
    }
    // Define the order of columns for the CSV
    const headerOrder = ["gatewayId", "name", "description", "lastSeenAt", "location", "properties", "state", "tenantId", "createdAt", "updatedAt"];
    const csvString = convertToCSV(gatewayList, headerOrder);
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Gateway-List.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadXlsx = async () => {
    const { result: gatewayList } = await getGateway({
      limit: 1000000000,
      offset: 0,
      tenantId: getLORAAuth()?.tenant_id || "",
    });
    // Define the order of columns for the XLSX
    const headerOrder = ["gatewayId", "name", "description", "lastSeenAt", "location", "properties", "state", "tenantId", "createdAt", "updatedAt"];
    const headerLabels = headerOrder.map((header) => header.toUpperCase());
    // Prepare the data in the correct order with formatted location
    const formattedData = gatewayList.map((item: any) => {
      return headerOrder.reduce((acc: Record<string, any>, key) => {
        let value = item[key];
        // Handle location as JSON string
        if ((key === "location" || key === "properties") && typeof value === "object" && value) {
          value = convertObjectToCommaSeparated(value);
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
    a.download = "Gateway-List.xlsx";
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
    const { result: gatewayList } = await getGateway({
      limit: 1000000000,
      offset: 0,
      tenantId: getLORAAuth()?.tenant_id || "",
    });
    if (gatewayList.length === 0) {
      toast.error("No data found to download!");
      return;
    }
    const doc = new jsPDF();
    const headerOrder = ["gatewayId", "name", "description", "state", "createdAt"];
    const displayHeader = headerOrder.map(
      (key) =>
        ({
          gatewayId: "Gateway ID",
          name: "Name",
          description: "Description",
          state: "Last Seen At",
          createdAt: "Created At",
        }[key])
    );
    const data = gatewayList.map((item: any) =>
      headerOrder.map((key) => {
        return item[key] || "";
      })
    );
    // Set the title and calculate its width
    const title = "Gateway List";
    const pageWidth = doc.internal.pageSize.getWidth();
    const textWidth = doc.getTextWidth(title);
    const textX = (pageWidth - textWidth) / 2; // Calculate the x-coordinate for center alignment
    // Add centered text to the document
    doc.text(title, textX, 10);
    // Define column widths
    const columnWidths = {
      0: { cellWidth: 35 }, // Gateway ID
      1: { cellWidth: 30 }, // Name
      2: { cellWidth: 30 }, // Description
      3: { cellWidth: 30 }, // Last Seen At
      4: { cellWidth: 50 }, // Created At
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
    doc.save("Gateway-List.pdf");
  };

  // Function to convert an object (like location/properties) to a comma-separated key-value string
  const convertObjectToCommaSeparated = (obj: any) => {
    return Object.entries(obj)
      .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
      .join(", ")
      .replace(/"/g, ""); // Remove quotes from the string
  };

  const onClickAddGateway = () => {
    navigate("/gateways/add");
  };

  return (
    <>
      <div className="card-header border-0 pt-6">
        <div className="card-title"></div>

        <div className="card-toolbar">
          <div className="d-flex justify-content-end" data-kt-gateway-table-toolbar="base">
            <button type="button" className="btn btn-primary me-2 mx-2" onClick={onClickAddGateway}>
              <KTIcon iconName="plus" className="fs-2" />
              Add Gateway
            </button>
            <button type="button" className="btn btn-light-primary me-2 mx-2" onClick={onShowImportGateway}>
              <KTIcon iconName="exit-up" className="fs-2" />
              Import
            </button>
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

export { GatewayListHeader };
