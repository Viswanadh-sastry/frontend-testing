import jsPDF from "jspdf";
import "jspdf-autotable";
import { Dispatch, SetStateAction } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { KTIcon } from "../../../../../_metronic/helpers";
import { deleteNotificationById, getNotification } from "../../api/NotificationAPI";
import { useSelectedValues } from "../../NotificationContext";
import { NotificationListFilter } from "./NotificationListFilter";

interface INotificationListHeaderProps {
  setFilterNotification: Dispatch<SetStateAction<any>>;
  filterNotification: any;
  notificationListQuery: any;
}

const NotificationListHeader = ({ setFilterNotification, filterNotification, notificationListQuery }: INotificationListHeaderProps) => {
  const onChangeStatus = (e: any) => {
    setFilterNotification((prevState: any) => ({
      ...prevState,
      status: e.target.value,
      from: 0,
      to: 0,
    }));
  };

  const convertToCSV = (data: any[], headerOrder: string[]) => {
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

            // Handle labels as comma-separated values
            if (key === "labels" && Array.isArray(value)) {
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
    const { notifications: notificationList } = await getNotification({
      status: filterNotification.status,
    });
    if (notificationList.length === 0) {
      toast.error("No data found to download!");
      return;
    }
    // Define the order of columns for the CSV
    const headerOrder = ["id", "category", "labels", "content", "description", "sender", "severity", "status", "created"];
    const csvString = convertToCSV(notificationList, headerOrder);
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Notification-List.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadXlsx = async () => {
    const { notifications: notificationList } = await getNotification({
      status: filterNotification.status,
    });
    // Define the order of columns for the XLSX
    const headerOrder = ["id", "category", "labels", "content", "description", "sender", "severity", "status", "created"];
    const headerLabels = headerOrder.map((header) => header.toUpperCase());
    // Function to convert an array (like categories/labels) to a comma-separated string
    const convertArrayToCommaSeparated = (arr: any[]) => {
      return arr.join(", ");
    };
    // Prepare the data in the correct order with formatted labels
    const formattedData = notificationList.map((item: any) => {
      return headerOrder.reduce((acc: Record<string, any>, key) => {
        let value = item[key];
        // Handle labels as comma-separated values
        if (key === "labels" && Array.isArray(value)) {
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
    a.download = "Notification-List.xlsx";
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
    const { notifications: notificationList } = await getNotification({
      status: filterNotification.status,
    });
    if (notificationList.length === 0) {
      toast.error("No data found to download!");
      return;
    }
    const doc = new jsPDF();
    const headerOrder = ["id", "category", "labels", "content", "sender", "status"];
    const displayHeader = headerOrder.map(
      (key) =>
        ({
          id: "ID",
          category: "Category",
          labels: "Labels",
          content: "Content",
          sender: "Sender",
          status: "Status",
        }[key])
    );
    const data = notificationList.map((item: any) =>
      headerOrder.map((key) => {
        return item[key] || "";
      })
    );
    // Set the title and calculate its width
    const title = "Notification List";
    const pageWidth = doc.internal.pageSize.getWidth();
    const textWidth = doc.getTextWidth(title);
    const textX = (pageWidth - textWidth) / 2; // Calculate the x-coordinate for center alignment
    // Add centered text to the document
    doc.text(title, textX, 10);
    // Define column widths
    const columnWidths = {
      0: { cellWidth: 30 }, // ID
      1: { cellWidth: 30 }, // Category
      2: { cellWidth: 30 }, // Labels
      3: { cellWidth: 30 }, // Content
      4: { cellWidth: 30 }, // Sender
      5: { cellWidth: 30 }, // Status
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
    doc.save("Notification-List.pdf");
  };

  const { selectedValues } = useSelectedValues();

  const onClickDeleteNotification = () => {
    if (selectedValues.length === 0) {
      toast.error("Please select at least one notification to delete!");
      return;
    }
    // Add your logic here
    deleteNotification();
  };

  const deleteNotification = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Are you sure you want to delete this record?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      customClass: {
        confirmButton: "btn btn-danger",
        cancelButton: "btn btn-secondary",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          selectedValues.forEach(async (value) => {
            await deleteNotificationById(value);
          });
          toast.success("Notification deleted successfully");
          notificationListQuery.refetch();
        } catch (error: any) {
          toast.error(error.message);
        }
      }
    });
  };

  return (
    <>
      <div className="card-header border-0 pt-6">
        <div className="card-title">
          {/* begin::Search */}
          <div className="d-flex align-items-center position-relative my-1">
            <select className="form-select form-select-solid w-220px ps-8" onChange={onChangeStatus} defaultValue={"NEW"}>
              <option value="NEW">Status: NEW</option>
              <option value="PROCESSED">Status: PROCESSED</option>
              <option value="ESCALATED">Status: ESCALATED</option>
            </select>
          </div>
          {/* end::Search */}
        </div>

        <div className="card-toolbar">
          <div className="d-flex justify-content-end" data-kt-notification-table-toolbar="base">
            {selectedValues.length > 0 && (
              <>
                <div className="d-flex align-items-center">
                  <span className="text-muted fw-bold mx-6">
                    <b> {selectedValues.length}</b> notification selected
                  </span>
                </div>
                <div className="d-flex justify-content-end" data-kt-notification-table-toolbar="base">
                  <button type="button" className="btn btn-danger" onClick={onClickDeleteNotification}>
                    Delete
                  </button>
                </div>
              </>
            )}
            <div>
              <NotificationListFilter setFilterNotification={setFilterNotification} />
            </div>
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

export { NotificationListHeader };
