import jsPDF from "jspdf";
import "jspdf-autotable";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import { MenuComponent } from "../../../../_metronic/assets/ts/components";
import { KTIcon } from "../../../../_metronic/helpers";
import { convertUnixTimestampToLocalDateTime } from "../../../constants/Common";
import { sortHistoryData } from "../../dashboard/api/DashboardHelper";
import { getThingChannelList } from "../../things/api/ThingChannelAPI";
import { exportHistoryListAll } from "../api/HistoryAPI";
import { DeviceListFilter } from "./DeviceListFilter";
import { DeviceListExporting } from "./pagination/DeviceListExporting";

interface IAssetListHeaderProps {
  setHistoryList: Dispatch<SetStateAction<any>>;
  setFilterDevice: Dispatch<
    SetStateAction<{
      thingId: any;
      limit: number;
      offset: number;
      status: string;
      name: any;
      from: number;
      to: number;
      publisher: string;
    }>
  >;
  filterDevice: {
    limit: number;
    offset: number;
    thingId: any;
    status: string;
    name: any;
    from: number;
    to: number;
    publisher: string;
  };
}

const DeviceListHeader = ({ setFilterDevice, setHistoryList, filterDevice }: IAssetListHeaderProps) => {
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    MenuComponent.reinitialization();
  }, []);

  const params = useParams();
  const thingId = params.id;

  const fetchExportData = async (): Promise<any[]> => {
    const allHistoryData: any[] = [];
    const filterGroupChannel = {
      offset: 0,
      limit: 10,
      name: "",
      status: "enabled",
    };

    // Fetch channels
    const fetchChannels = async (): Promise<any[]> => {
      const channels: any[] = [];
      if (thingId) {
        const channelList = await getThingChannelList(thingId, filterGroupChannel);
        if (channelList.groups) {
          channels.push(...channelList.groups.map((group: any) => ({ ...group, thingId })));
        }
      } else if (filterDevice.thingId.length > 0) {
        for (const id of filterDevice.thingId) {
          const channelList = await getThingChannelList(id, filterGroupChannel);
          if (channelList.groups) {
            channels.push(...channelList.groups.map((group: any) => ({ ...group, thingId: id })));
          }
        }
      }
      return channels;
    };

    try {
      const channelList = await fetchChannels();
      if (channelList.length === 0) {
        toast.error("No channels found!");
        return [];
      }

      // Fetch history data
      for (const channel of channelList) {
        const queryFilters =
          filterDevice.name.length > 0
            ? filterDevice.name.map((name: any) => ({
                ...filterDevice,
                name: [name],
                publisher: channel.thingId,
              }))
            : [{ ...filterDevice, publisher: channel.thingId }];

        for (const filter of queryFilters) {
          try {
            const historyData = await exportHistoryListAll(channel.id, filter);
            if (historyData.messages) {
              allHistoryData.push(...historyData.messages);
            }
          } catch (error: any) {
            toast.error(`Failed to fetch data for channel ${channel.id}: ${error.message}`);
          }
        }
      }

      // Sort and return
      allHistoryData.sort((a: any, b: any) => sortHistoryData(a, b));
      return allHistoryData;
    } catch (error: any) {
      toast.error(`Error fetching export data: ${error.message}`);
      return [];
    }
  };

  const convertToCSV = (data: any[], headerOrder: string[]) => {
    // Create a header with the specified order
    //const header = headerOrder.map((header) => header.toUpperCase()).join(",") + "\n";

    const header =
      headerOrder
        .map(
          (key) =>
            ({
              time: "SENT AT",
              subtopic: "SUBTOPIC",
              publisher: "PUBLISHER",
              protocol: "PROTOCOL",
              name: "NAME",
              unit: "UNIT",
              value: "VALUE",
            }[key])
        )
        .join(",") + "\n";

    // Map each row to a CSV string
    const rows = data
      .map((row: any) => {
        return headerOrder
          .map((key) => {
            let value = row[key];

            if (key === "time" && value !== undefined) {
              // Convert the timestamp (assuming it is in microseconds) to milliseconds
              value = convertUnixTimestampToLocalDateTime(value);
            }

            return value !== undefined ? value : ""; // Return value or blank if undefined
          })
          .join(",");
      })
      .join("\n");

    return header + rows;
  };

  // convert data to csv
  const downloadCSV = async () => {
    setIsLoading(true);
    const historyList = await fetchExportData();
    setIsLoading(false);

    if (historyList.length === 0) {
      toast.error("No data found to download!");
      return;
    }
    const headerOrder = ["time", "subtopic", "publisher", "protocol", "name", "unit", "value"];
    const csvString = convertToCSV(historyList, headerOrder);
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Device-History.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // convert data to xlsx
  const downloadXlsx = async () => {
    setIsLoading(true);
    const historyList = await fetchExportData();
    setIsLoading(false);

    if (historyList.length === 0) {
      toast.error("No data found to download!");
      return;
    }
    // Define the order of columns for the XLSX
    const headerOrder = ["time", "subtopic", "publisher", "protocol", "name", "unit", "value"];
    // const headerLabels = headerOrder.map((header) => header.toUpperCase());

    const headerLabels = headerOrder.map(
      (key) =>
        ({
          time: "SENT AT",
          subtopic: "SUBTOPIC",
          publisher: "PUBLISHER",
          protocol: "PROTOCOL",
          name: "NAME",
          unit: "UNIT",
          value: "VALUE",
        }[key])
    );

    // Prepare the data in the correct order with stringified metadata
    const formattedData = historyList.map((item: any) => {
      return headerOrder.reduce((acc: Record<string, any>, key) => {
        let value = item[key];

        if (key === "time" && value !== undefined) {
          // Convert the timestamp (assuming it is in microseconds) to milliseconds
          value = convertUnixTimestampToLocalDateTime(value);
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
    a.download = "Device-History.xlsx";

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
    setIsLoading(true);
    const historyList = await fetchExportData();
    setIsLoading(false);

    if (historyList.length === 0) {
      toast.error("No data found to download!");
      return;
    }

    const doc = new jsPDF();
    const headerOrder = ["time", "subtopic", "publisher", "protocol", "name", "unit", "value"];
    const displayHeader = headerOrder.map(
      (key) =>
        ({
          time: "SENT AT",
          subtopic: "SUBTOPIC",
          publisher: "PUBLISHER",
          protocol: "PROTOCOL",
          name: "NAME",
          unit: "UNIT",
          value: "VALUE",
        }[key])
    );

    const data = historyList.map((item: any) =>
      headerOrder.map((key) => {
        if (key === "time") {
          return convertUnixTimestampToLocalDateTime(item[key]);
        }
        return item[key] || "";
      })
    );

    const title = "Device History";
    const pageWidth = doc.internal.pageSize.getWidth();
    const textWidth = doc.getTextWidth(title);
    const textX = (pageWidth - textWidth) / 2;

    doc.text(title, textX, 10);

    const columnWidths = {
      0: { cellWidth: 40 },
      1: { cellWidth: 45 },
      2: { cellWidth: 35 },
      3: { cellWidth: 20 },
      4: { cellWidth: 20 },
      5: { cellWidth: 13 },
      6: { cellWidth: 13 },
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

    doc.save("Device-History.pdf");
  };

  return (
    <>
      <div className="card-header border-0 pt-6">
        <div className="card-title">
          {/* <div className="fs-7">
            <span>Total Records: {historyList?.length}</span>
          </div> */}
        </div>
        <div className="card-toolbar">
          <button type="button" className="btn btn-light mx-2" onClick={() => window.history.back()}>
            <i className="bi bi-arrow-left"></i>
            Back
          </button>
          <div className="d-flex justify-content-end" data-kt-device-table-toolbar="base">
            <div>
              <DeviceListFilter setFilterDevice={setFilterDevice} setHistoryList={setHistoryList} />
            </div>
            <button type="button" className="btn btn-light-primary me-3" data-kt-menu-trigger="click" data-kt-menu-placement="bottom-end">
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
      {isLoading && <DeviceListExporting />}
    </>
  );
};

export { DeviceListHeader };
