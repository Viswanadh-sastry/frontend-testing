import { Column } from "react-table";
import { Rule } from "../../../api/_models";
import { RuleActionsCell } from "./RuleActionsCell";
import { RuleCustomHeader } from "./RuleCustomHeader";

const rulesColumns: ReadonlyArray<Column<Rule>> = [
  {
    Header: (props) => <RuleCustomHeader tableProps={props} title="Rule Name" className="min-w-125px" />,
    accessor: "name",
  },
  {
    Header: (props) => <RuleCustomHeader tableProps={props} title="Status" className="min-w-125px" />,
    accessor: "status",
  },
  {
    Header: (props) => <RuleCustomHeader tableProps={props} title="Actions" className="text-end w-120px" />,
    id: "actions",
    Cell: ({ ...props }) => <RuleActionsCell row={props.row} />,
  },
];

export { rulesColumns };
