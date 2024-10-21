import { Column } from "react-table";
import { convertGMTToLocalDateTime } from "../../../../../constants/Common";
import { Dashboard } from "../../../api/_models";
import { DashboardActionsCell } from "./DashboardActionsCell";
import { DashboardCustomHeader } from "./DashboardCustomHeader";

const dashboardColumns: ReadonlyArray<Column<Dashboard>> = [
  {
    Header: (props) => <DashboardCustomHeader tableProps={props} title="Name" className="min-w-125px" />,
    accessor: "name",
  },
  {
    Header: (props) => <DashboardCustomHeader tableProps={props} title="Description" className="min-w-125px" />,
    accessor: "description",
  },
  {
    Header: (props) => <DashboardCustomHeader tableProps={props} title="Created At" className="min-w-125px" />,
    accessor: "created_at",
    Cell: ({ value }) => convertGMTToLocalDateTime(value),
  },
  {
    Header: (props) => <DashboardCustomHeader tableProps={props} title="Actions" className="text-end min-w-100px" />,
    id: "actions",
    Cell: ({ ...props }) => <DashboardActionsCell id={props.data[props.row.index].id} />,
  },
];

export { dashboardColumns };
