import { Column } from "react-table";
import { StreamActionsCell } from "./StreamActionsCell";
import { StreamCustomHeader } from "./StreamCustomHeader";
import { Stream } from "../../../api/_models";

const streamsColumns: ReadonlyArray<Column<Stream>> = [
  {
    Header: (props) => <StreamCustomHeader tableProps={props} title="Stream Name" className="min-w-125px" />,
    accessor: "name",
  },
  {
    Header: (props) => <StreamCustomHeader tableProps={props} title="Actions" className="text-end w-120px" />,
    id: "actions",
    Cell: ({ ...props }) => <StreamActionsCell row={props.row} />,
  },
];

export { streamsColumns };
