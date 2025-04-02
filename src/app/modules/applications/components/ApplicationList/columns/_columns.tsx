import { Column } from "react-table";
import { Application } from "../../../api/_models";
import { ApplicationActionsCell } from "./ApplicationActionsCell";
import { ApplicationCustomHeader } from "./ApplicationCustomHeader";

const applicationsColumns: ReadonlyArray<Column<Application>> = [
  {
    Header: (props) => <ApplicationCustomHeader tableProps={props} title="Name" className="min-w-100px" />,
    accessor: "name",
  },
  {
    Header: (props) => <ApplicationCustomHeader tableProps={props} title="Description" className="min-w-200px" />,
    accessor: "description",
  },
  {
    Header: (props) => <ApplicationCustomHeader tableProps={props} title="Actions" className="text-end min-w-150px" />,
    id: "actions",
    Cell: ({ ...props }) => <ApplicationActionsCell id={props.data[props.row.index].id} />,
  },
];

export { applicationsColumns };
