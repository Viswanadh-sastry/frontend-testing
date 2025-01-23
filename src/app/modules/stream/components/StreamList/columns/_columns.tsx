import { Column } from "react-table";
import { StreamActionsCell } from "./StreamActionsCell";
import { StreamCustomHeader } from "./StreamCustomHeader";
import { Stream } from "../../../api/_models";

const streamsColumns: ReadonlyArray<Column<Stream>> = [
  {
    Header: (props) => <StreamCustomHeader tableProps={props} title="Stream Name" className="min-w-125px" />,
    accessor: "sql",
  },
  {
    Header: (props) => <StreamCustomHeader tableProps={props} title="Actions" className="text-end w-20px" />,
    id: "actions",
    Cell: ({ ...props }) => <StreamActionsCell id={props.data[props.row.index].id} />,
  },
];

export { streamsColumns };
