import { Column } from "react-table";
import { Device } from "../../../../api/_models";
import { DeviceActionsCell } from "./DeviceActionsCell";
import { DeviceCustomHeader } from "./DeviceCustomHeader";
import { convertGMTToLocalDateTime } from "../../../../../../constants/Common";

const devicesColumns: ReadonlyArray<Column<Device>> = [
  {
    Header: (props) => <DeviceCustomHeader tableProps={props} title="DevEUI" className="min-w-100px" />,
    accessor: "devEui",
  },
  {
    Header: (props) => <DeviceCustomHeader tableProps={props} title="Name" className="min-w-100px" />,
    accessor: "name",
  },
  {
    Header: (props) => <DeviceCustomHeader tableProps={props} title="Device Profile" className="min-w-100px" />,
    accessor: "deviceProfileName",
  },
  {
    Header: (props) => <DeviceCustomHeader tableProps={props} title="Device Status" className="min-w-100px" />,
    accessor: "deviceStatus",
    Cell: ({ value }) => {
      if (!value || typeof value !== "object") {
        return <span className="text-muted"></span>;
      }
      return (
        <div>
          {Object.entries(value).map(([key, val], index) => (
            <span key={index} className="badge badge-light-primary mr-2" style={{ display: "inline-block", marginBottom: "4px", marginRight: "4px" }}>
              {`${key}: ${val}`}
            </span>
          ))}
        </div>
      );
    },
  },
  {
    Header: (props) => <DeviceCustomHeader tableProps={props} title="Last Seen At" className="min-w-100px" />,
    accessor: "lastSeenAt",
    Cell: ({ value }) => convertGMTToLocalDateTime(value),
  },
  {
    Header: (props) => <DeviceCustomHeader tableProps={props} title="Actions" className="text-end min-w-150px" />,
    id: "actions",
    Cell: ({ ...props }) => <DeviceActionsCell id={props.data[props.row.index].devEui} />,
  },
];

export { devicesColumns };
