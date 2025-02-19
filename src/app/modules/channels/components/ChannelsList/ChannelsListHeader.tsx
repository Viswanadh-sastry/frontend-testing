import jsPDF from "jspdf";
import "jspdf-autotable";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import { KTIcon } from "../../../../../_metronic/helpers";
import { getRolePermission, MODULENAME } from "../../../auth/core/RoleHelpers";
import { getChannelGroupList } from "../../api/ChannelGroupAPI";
import { getChannelListAll } from "../../api/ChannelsAPI";
import { getChannelThingList } from "../../api/ChannelThingAPI";

interface IChannelsListHeaderProps {
  onShowAddChannel: () => void;
  onShowImportChannel: () => void;
  setFilterChannel: Dispatch<
    SetStateAction<{
      limit: number;
      offset: number;
      name: string;
      metadata: string;
      status: string;
    }>
  >;
  filterChannel: {
    limit: number;
    offset: number;
    name: string;
    metadata: string;
    status: string;
  };
}

const ChannelsListHeader = ({ onShowAddChannel, setFilterChannel, onShowImportChannel, filterChannel }: IChannelsListHeaderProps) => {
  const [rolePermission, setRolePermission] = useState<any>(null);

  useEffect(() => {
    const fetchRolePermission = async () => {
      const permission = await getRolePermission(MODULENAME.ASSETLIST);
      setRolePermission(permission);
    };
    fetchRolePermission();
  }, []);

  const onChangeStatus = (e: any) => {
    setFilterChannel((prevState: any) => ({
      ...prevState,
      status: e.target.value,
    }));
  };

  const getChannelData = async () => {
    const filterChannels = {
      limit: 100,
      offset: 0,
      name: filterChannel.name,
      metadata: "",
      status: filterChannel.status,
    };
    const filterThing = {
      limit: 10,
      offset: 0,
      name: "",
      metadata: "",
      tags: "",
      status: "all",
    };
    const filterGroup = {
      limit: 10,
      offset: 0,
      name: "",
      metadata: "",
      parentID: "",
      status: "all",
    };
    return await getChannelListAll(filterChannels)
      .then(async (response) => {
        const groups = await Promise.all(
          response.groups.map(async (group: any) => {
            try {
              const thing = await getChannelThingList(group.id, filterThing);
              const location = await getChannelGroupList(group.id, filterGroup);
              return {
                ...group,
                isConnected: thing.total > 0,
                isLocated: location.total > 0,
              };
            } catch (error) {
              return {
                ...group,
                isConnected: false,
                isLocated: false,
              };
            }
          })
        );
        return { ...response, groups };
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

    // Create a header with the specified order
    //const header = headerOrder.map((header) => header.toUpperCase()).join(",") + "\n";

    const header =
      headerOrder
        .map(
          (key) =>
            ({
              id: "ID",
              name: "NAME",
              description: "DESCRIPTION",
              metadata: "METADATA",
              created_at: "CREATED AT",
              isConnected: "CONNECTED",
              isLocated: "LOCATED",
              status: "STATUS",
            }[key])
        )
        .join(",") + "\n";

    // Map each row to a CSV string
    const rows = data
      .map((row: any) => {
        return headerOrder
          .map((key) => {
            let value = row[key];

            if (key === "metadata" && typeof value === "object" && value !== null) {
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
    const { groups: channelList } = await getChannelData();

    if (channelList.length === 0) {
      toast.error("No data found to download!");
      return;
    }
    // Define the order of columns for the CSV
    const headerOrder = ["id", "name", "description", "metadata", "created_at", "isConnected", "isLocated", "status"];

    const csvString = convertToCSV(channelList, headerOrder);
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Asset-List.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // convert data to xlsx
  const downloadXlsx = async () => {
    const { groups: channelList } = await getChannelData();

    if (channelList.length === 0) {
      toast.error("No data found to download!");
      return;
    }
    // Define the order of columns for the XLSX
    const headerOrder = ["id", "name", "description", "metadata", "created_at", "isConnected", "isLocated", "status"];
    // const headerLabels = headerOrder.map((header) => header.toUpperCase());

    const headerLabels = headerOrder.map(
      (key) =>
        ({
          id: "ID",
          name: "NAME",
          description: "DESCRIPTION",
          metadata: "METADATA",
          created_at: "CREATED AT",
          isConnected: "CONNECTED",
          isLocated: "LOCATED",
          status: "STATUS",
        }[key])
    );

    // Function to convert an object (like metadata) to a comma-separated key-value string
    const convertObjectToCommaSeparated = (obj: any) => {
      return Object.entries(obj)
        .map(([key, value]) => `${key}: ${value}`)
        .join(", ");
    };

    const formattedData = channelList.map((item: any) => {
      return headerOrder.reduce((acc: Record<string, any>, key) => {
        let value = item[key];

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
    a.download = "Asset-List.xlsx";

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
    const { groups: channelList } = await getChannelData();

    if (channelList.length === 0) {
      toast.error("No data found to download!");
      return;
    }

    const doc = new jsPDF();
    const headerOrder = ["id", "name", "description", "metadata", "created_at", "isConnected", "isLocated", "status"];
    const displayHeader = headerOrder.map(
      (key) =>
        ({
          id: "ID",
          name: "NAME",
          description: "DESCRIPTION",
          metadata: "METADATA",
          created_at: "CREATED AT",
          isConnected: "CONNECTED",
          isLocated: "LOCATED",
          status: "STATUS",
        }[key])
    );

    const data = channelList.map((item: any) =>
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
    const title = "Asset List";
    const pageWidth = doc.internal.pageSize.getWidth();
    const textWidth = doc.getTextWidth(title);
    const textX = (pageWidth - textWidth) / 2; // Calculate the x-coordinate for center alignment

    // Add centered text to the document
    doc.text(title, textX, 10);

    // Define column widths
    const columnWidths = {
      0: { cellWidth: 30 }, // ID
      1: { cellWidth: 30 }, // Name
      2: { cellWidth: 30 }, // Description
      3: { cellWidth: 30 }, // Metadata (wider to accommodate JSON)
      4: { cellWidth: 30 }, // Created At
      5: { cellWidth: 10 }, // Connected
      6: { cellWidth: 10 }, // Located
      7: { cellWidth: 10 }, // Status
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

    doc.save("Asset-List.pdf");
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
                setFilterChannel((prevState: any) => ({
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
          <div className="d-flex justify-content-end" data-kt-channel-table-toolbar="base">
            {rolePermission?.create && (
              <>
                <button type="button" className="btn btn-primary" onClick={onShowAddChannel}>
                  <KTIcon iconName="plus" className="fs-2" />
                  Add Asset
                </button>
                <button type="button" className="btn btn-light-primary me-2 mx-2" onClick={onShowImportChannel}>
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

export { ChannelsListHeader };
