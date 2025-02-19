import { Column } from "react-table";
import { Device } from "../../../../api/_models";
import { DeviceActionsCell } from "./DeviceActionsCell";
import { DeviceCustomHeader } from "./DeviceCustomHeader";

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
  },
  {
    Header: (props) => <DeviceCustomHeader tableProps={props} title="Last Seen At" className="min-w-100px" />,
    accessor: "lastSeenAt",
  },
  {
    Header: (props) => <DeviceCustomHeader tableProps={props} title="Actions" className="text-end min-w-100px" />,
    id: "actions",
    Cell: ({ ...props }) => <DeviceActionsCell id={props.data[props.row.index].devEui} />,
  },
];

export { devicesColumns };
