import { Column } from "react-table";
import { DeviceProfile } from "../../../api/_models";
import { DeviceProfileActionsCell } from "./DeviceProfileActionsCell";
import { DeviceProfileCustomHeader } from "./DeviceProfileCustomHeader";

const deviceProfilesColumns: ReadonlyArray<Column<DeviceProfile>> = [
  {
    Header: (props) => <DeviceProfileCustomHeader tableProps={props} title="Name" className="min-w-100px" />,
    accessor: "name",
  },
  {
    Header: (props) => <DeviceProfileCustomHeader tableProps={props} title="Region" className="min-w-100px" />,
    accessor: "region",
  },
  {
    Header: (props) => <DeviceProfileCustomHeader tableProps={props} title="MAC version" className="min-w-100px" />,
    accessor: "macVersion",
  },
  {
    Header: (props) => <DeviceProfileCustomHeader tableProps={props} title="Revision" className="min-w-100px" />,
    accessor: "regParamsRevision",
  },
  {
    Header: (props) => <DeviceProfileCustomHeader tableProps={props} title="Supports OTAA" className="min-w-100px" />,
    accessor: "supportsOtaa",
    Cell: ({ value }) => (value ? "Yes" : "No"),
  },
  {
    Header: (props) => <DeviceProfileCustomHeader tableProps={props} title="Actions" className="text-end min-w-150px" />,
    id: "actions",
    Cell: ({ ...props }) => <DeviceProfileActionsCell id={props.data[props.row.index].id} />,
  },
];

export { deviceProfilesColumns };
