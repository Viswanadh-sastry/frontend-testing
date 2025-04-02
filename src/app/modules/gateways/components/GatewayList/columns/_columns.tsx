import { Column } from "react-table";
import { Gateway } from "../../../api/_models";
import { GatewayActionsCell } from "./GatewayActionsCell";
import { GatewayCustomHeader } from "./GatewayCustomHeader";

const gatewaysColumns: ReadonlyArray<Column<Gateway>> = [
  {
    Header: (props) => <GatewayCustomHeader tableProps={props} title="Gateway Id" className="min-w-100px" />,
    accessor: "gatewayId",
  },
  {
    Header: (props) => <GatewayCustomHeader tableProps={props} title="Name" className="min-w-100px" />,
    accessor: "name",
  },
  {
    Header: (props) => <GatewayCustomHeader tableProps={props} title="Description" className="min-w-100px" />,
    accessor: "description",
  },
  {
    Header: (props) => <GatewayCustomHeader tableProps={props} title="Last Seen" className="min-w-100px" />,
    accessor: "state",
  },
  {
    Header: (props) => <GatewayCustomHeader tableProps={props} title="Actions" className="text-end min-w-150px" />,
    id: "actions",
    Cell: ({ ...props }) => <GatewayActionsCell id={props.data[props.row.index].gatewayId} />,
  },
];

export { gatewaysColumns };
