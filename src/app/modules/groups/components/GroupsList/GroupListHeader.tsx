import jsPDF from "jspdf";
import "jspdf-autotable";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import { KTIcon } from "../../../../../_metronic/helpers";
import { getRolePermission, MODULENAME } from "../../../auth/core/RoleHelpers";

interface IGroupsListHeaderProps {
  onShowAddGroup: () => void;
  onShowImportGroup: () => void;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  setPagination: Dispatch<SetStateAction<any>>;
  setFilterGroup: Dispatch<
    SetStateAction<{
      limit: number;
      offset: number;
      name: string;
      metadata: string;
      parentID: string;
      status: string;
      tree: boolean;
    }>
  >;
  setGroupList: Dispatch<SetStateAction<any[]>>;
  groupList: any[];
  groupListQuery: any;
  pagination: any;
}

const GroupListHeader = ({
  onShowAddGroup,
  onShowImportGroup,
  setCurrentPage,
  setPagination,
  setFilterGroup,
  setGroupList,
  groupList,
  groupListQuery,
  pagination,
}: IGroupsListHeaderProps) => {
  const [rolePermission, setRolePermission] = useState<any>(null);
  const [searchText, setSearchText] = useState<string>("");

  useEffect(() => {
    const fetchRolePermission = async () => {
      const permission = await getRolePermission(MODULENAME.ASSETGROUPLIST);
      setRolePermission(permission);
    };
    fetchRolePermission();
  }, []);

  const onChangeStatus = (e: any) => {
    setCurrentPage(1);
    setPagination({ ...pagination, page: 1 });
    setSearchText("");
    setFilterGroup((prevState: any) => ({
      ...prevState,
      status: e.target.value,
    }));
  };

  const convertToCSV = (data: any[], headerOrder: string[]): string => {
    // Function to convert an object (like metadata) to a comma-separated key-value string
    const convertObjectToCommaSeparated = (obj: any) => {
      return Object.entries(obj)
        .map(([key, value]) => `${key}: ${value}`)
        .join(", ");
    };

    // Recursive function to flatten the data, including children
    const flattenData = (item: any, parentPath: string = ""): string => {
      // Convert the current item data to the desired format
      const currentData = headerOrder
        .map((key) => {
          let value = item[key];
          if (key === "metadata" && typeof value === "object" && value !== null) {
            value = convertObjectToCommaSeparated(value);
          }
          return value !== undefined ? `"${value}"` : '""'; // Use quotes to handle commas in values
        })
        .join(",");

      // Initialize the CSV string with the current item's data
      let csvString = `${parentPath}${currentData}\n`;

      // If the item has children, recursively flatten them
      if (item.children && Array.isArray(item.children)) {
        item.children.forEach((child: any) => {
          csvString += flattenData(child, `${parentPath}\t`); // Append a tab for nested levels
        });
      }

      return csvString;
    };

    // Create a header with the specified order
    const header = headerOrder.map((header) => header.toUpperCase()).join(",") + "\n";

    // Flatten the entire data array
    const flattenedData = data.map((item) => flattenData(item)).join("");

    return header + flattenedData;
  };

  // Convert data to CSV and download
  const downloadCSV = async () => {
    if (groupList.length === 0) {
      toast.error("No data found to download!");
      return;
    }

    // Define the order of columns for the CSV
    const headerOrder = ["id", "name", "description", "metadata", "created_at", "status"];

    const csvString = convertToCSV(groupList, headerOrder);
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Asset-Group-List.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadXlsx = async () => {
    if (groupList.length === 0) {
      toast.error("No data found to download!");
      return;
    }

    // Define the order of columns for the XLSX
    const headerOrder = ["id", "name", "description", "metadata", "created_at", "status"];
    const headerLabels = headerOrder.map((header) => header.toUpperCase());

    // Function to convert an object (like metadata) to a comma-separated key-value string
    const convertObjectToCommaSeparated = (obj: any) => {
      return Object.entries(obj)
        .map(([key, value]) => `${key}: ${value}`)
        .join(", ");
    };

    // Recursive function to flatten data without indentation
    const flattenData = (item: any): any[] => {
      // Convert the current item data to the desired format
      const currentData = headerOrder.reduce((acc: Record<string, any>, key) => {
        let value = item[key];
        if (key === "metadata" && typeof value === "object" && value !== null) {
          value = convertObjectToCommaSeparated(value); // Convert metadata object to comma-separated key-value pairs
        }
        acc[key] = value !== undefined ? value : "";
        return acc;
      }, {} as Record<string, any>);

      // Initialize the flattened array with the current item's data
      let flattened = [currentData];

      // If the item has children, recursively flatten them without indentation
      if (item.children && Array.isArray(item.children)) {
        item.children.forEach((child: any) => {
          flattened = flattened.concat(flattenData(child));
        });
      }

      return flattened;
    };

    // Prepare the flattened data from the groupList
    const formattedData = groupList.flatMap((item: any) => flattenData(item));

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
    a.download = "Asset-Group-List.xlsx";

    // Append the anchor to the body
    document.body.appendChild(a);

    // Programmatically click the anchor to trigger the download
    a.click();

    // Clean up by removing the anchor and revoking the object URL
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadPDF = async () => {
    if (groupList.length === 0) {
      toast.error("No data found to download!");
      return;
    }

    const doc = new jsPDF();
    const headerOrder = ["id", "name", "description", "metadata", "created_at", "status"];
    const displayHeader = headerOrder.map(
      (key) =>
        ({
          id: "ID",
          name: "NAME",
          description: "DESCRIPTION",
          metadata: "METADATA",
          created_at: "CREATED AT",
          status: "STATUS",
        }[key])
    );

    // Recursive function to flatten data and include children
    const flattenData = (item: any, level: number = 0): any[] => {
      // Convert the current item data to the desired format
      const indent = " ".repeat(level * 4); // Indent children by 4 spaces per level
      const currentData = headerOrder.map((key) => {
        const value = item[key];

        if (key === "metadata" && typeof item[key] === "object") {
          return Object.keys(item[key])
            .map((k) => `${k}: ${item[key][k]}`)
            .join(", ");
        }
        return indent + (value || ""); // Add indentation to the value
      });

      // Initialize the flattened array with the current item's data
      let flattened = [currentData];

      // If the item has children, recursively flatten them
      if (item.children && Array.isArray(item.children)) {
        item.children.forEach((child: any) => {
          flattened = flattened.concat(flattenData(child));
        });
      }

      return flattened;
    };

    // Prepare the flattened data from the groupList
    const flattenedData = groupList.flatMap((item: any) => flattenData(item));

    // Set the title and calculate its width
    const title = "Asset Group List";
    const pageWidth = doc.internal.pageSize.getWidth();
    const textWidth = doc.getTextWidth(title);
    const textX = (pageWidth - textWidth) / 2; // Calculate the x-coordinate for center alignment

    // Add centered text to the document
    doc.text(title, textX, 10);

    // Define column widths
    const columnWidths = {
      0: { cellWidth: 30 }, // ID
      1: { cellWidth: 25 }, // Name
      2: { cellWidth: 30 }, // Description
      3: { cellWidth: 35 }, // Metadata (wider to accommodate JSON)
      4: { cellWidth: 35 }, // Created At
      5: { cellWidth: 20 }, // Status
    };

    (doc as any).autoTable({
      head: [displayHeader],
      body: flattenedData,
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

    doc.save("Asset-Group-List.pdf");
  };

  const searchByName = (groups: any[], searchTerm: string): any[] => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    const filterGroup = (group: any): boolean => {
      // Check if the group name matches the search term
      if (group.name.toLowerCase().includes(lowerCaseSearchTerm)) {
        return true;
      }

      // Check if any of the children match the search term
      if (group.children && group.children.length > 0) {
        return group.children.some(filterGroup); // Recursively check children
      }

      return false;
    };

    return groups.filter(filterGroup);
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
              value={searchText}
              onChange={(e) => {
                setCurrentPage(1);
                setPagination({ ...pagination, page: 1 });
                setSearchText(e.target.value);
                setGroupList(searchByName(groupListQuery.data?.groups || [], e.target.value));
              }}
            />
            <select className="form-select form-select-solid w-200px ps-8" onChange={onChangeStatus} defaultValue={"enabled"}>
              <option value="all">Status: all</option>
              <option value="enabled">Status: enabled</option>
              <option value="disabled">Status: disabled</option>
            </select>
          </div>
          {/* create one text box here  */}

          {/* end::Search */}
        </div>

        <div className="card-toolbar">
          <div className="d-flex justify-content-end" data-kt-group-table-toolbar="base">
            {rolePermission?.create && (
              <>
                <button type="button" className="btn btn-primary" onClick={onShowAddGroup}>
                  <KTIcon iconName="plus" className="fs-2" />
                  Add Asset Group
                </button>

                <button type="button" className="btn btn-light-primary me-2 mx-2" onClick={onShowImportGroup}>
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

export { GroupListHeader };
