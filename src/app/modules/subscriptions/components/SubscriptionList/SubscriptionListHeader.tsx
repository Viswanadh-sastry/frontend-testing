import jsPDF from "jspdf";
import "jspdf-autotable";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import { KTIcon } from "../../../../../_metronic/helpers";
import { getSubscriptionList } from "../../api/SubscriptionAPI";

interface ISubscriptionListHeaderProps {
  onShowAddSubscription: () => void;
  subscriptionListQuery: any;
}

const SubscriptionListHeader = ({ onShowAddSubscription, subscriptionListQuery }: ISubscriptionListHeaderProps) => {
  const convertToCSV = (data: any[], headerOrder: string[]) => {
    // Function to convert an object (like channels) to a comma-separated key-value string
    const convertObjectToCommaSeparated = (obj: any) => {
      return Object.entries(obj)
        .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
        .join(", ")
        .replace(/"/g, ""); // Remove quotes from the string
    };

    // Function to convert an array (like categories/labels) to a comma-separated string
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

            // Handle channels as comma-separated values
            if (key === "channels" && typeof value === "object" && value !== null) {
              value = convertObjectToCommaSeparated(value);
            } else if ((key === "categories" || key === "labels") && Array.isArray(value)) {
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
    const { subscriptions: subscriptionList } = await getSubscriptionList();
    if (subscriptionList.length === 0) {
      toast.error("No data found to download!");
      return;
    }
    // Define the order of columns for the CSV
    const headerOrder = ["id", "name", "categories", "labels", "receiver", "channels", "resendLimit", "resendInterval", "created"];
    const csvString = convertToCSV(subscriptionList, headerOrder);
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Subscription-List.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadXlsx = async () => {
    const { subscriptions: subscriptionList } = await getSubscriptionList();
    // Define the order of columns for the XLSX
    const headerOrder = ["id", "name", "categories", "labels", "receiver", "channels", "resendLimit", "resendInterval", "created"];
    const headerLabels = headerOrder.map((header) => header.toUpperCase());
    // Function to convert an object (like channels) to a comma-separated key-value string
    const convertObjectToCommaSeparated = (obj: any) => {
      return Object.entries(obj)
        .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
        .join(", ")
        .replace(/"/g, ""); // Remove quotes from the string
    };
    // Function to convert an array (like categories/labels) to a comma-separated string
    const convertArrayToCommaSeparated = (arr: any[]) => {
      return arr.join(", ");
    };
    // Prepare the data in the correct order with formatted channels and labels
    const formattedData = subscriptionList.map((item: any) => {
      return headerOrder.reduce((acc: Record<string, any>, key) => {
        let value = item[key];
        // Handle channels as comma-separated values
        if (key === "channels" && typeof value === "object" && value !== null) {
          value = convertObjectToCommaSeparated(value);
        } else if ((key === "categories" || key === "labels") && Array.isArray(value)) {
          value = convertArrayToCommaSeparated(value);
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
    a.download = "Subscription-List.xlsx";
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
    const { subscriptions: subscriptionList } = await getSubscriptionList();
    if (subscriptionList.length === 0) {
      toast.error("No data found to download!");
      return;
    }
    const doc = new jsPDF();
    const headerOrder = ["id", "name", "categories", "labels", "receiver", "resendLimit", "resendInterval"];
    const displayHeader = headerOrder.map(
      (key) =>
        ({
          id: "ID",
          name: "Name",
          categories: "Categories",
          labels: "Labels",
          receiver: "Receiver",
          resendLimit: "Resend Limit",
          resendInterval: "Resend Interval",
        }[key])
    );
    const data = subscriptionList.map((item: any) =>
      headerOrder.map((key) => {
        if (key === "channels" && typeof item[key] === "object") {
          return Object.entries(item[key])
            .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
            .join(", ")
            .replace(/"/g, "");
        }
        return item[key] || "";
      })
    );
    // Set the title and calculate its width
    const title = "Subscription List";
    const pageWidth = doc.internal.pageSize.getWidth();
    const textWidth = doc.getTextWidth(title);
    const textX = (pageWidth - textWidth) / 2; // Calculate the x-coordinate for center alignment
    // Add centered text to the document
    doc.text(title, textX, 10);
    // Define column widths
    const columnWidths = {
      0: { cellWidth: 25 }, // ID
      1: { cellWidth: 25 }, // Name
      2: { cellWidth: 25 }, // Categories
      3: { cellWidth: 25 }, // Labels
      4: { cellWidth: 25 }, // Receiver
      5: { cellWidth: 25 }, // Resend Limit
      6: { cellWidth: 25 }, // Resend Interval
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
    doc.save("Subscription-List.pdf");
  };

  const onClickRefresh = () => {
    subscriptionListQuery.refetch();
  };

  return (
    <>
      <div className="card-header border-0 pt-6">
        <div className="card-title"></div>
        <div className="card-toolbar">
          <div className="d-flex justify-content-end" data-kt-subscription-table-toolbar="base">
            <button type="button" className="btn btn-primary" onClick={onShowAddSubscription}>
              <KTIcon iconName="plus" className="fs-2" />
              Add Subscription
            </button>
            <button type="button" className="btn btn-light-primary me-2 mx-2" onClick={onClickRefresh}>
              <KTIcon iconName="arrows-circle" className="fs-2" />
              Refresh
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

export { SubscriptionListHeader };
