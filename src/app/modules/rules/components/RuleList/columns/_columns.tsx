import { Column } from "react-table";
import { RuleActionsCell } from "./RuleActionsCell";
import { RuleCustomHeader } from "./RuleCustomHeader";
import { Rule } from "../../../api/_models";
import { convertGMTToLocalDateTime } from "../../../../../../app/constants/Common";

const rulesColumns: ReadonlyArray<Column<Rule>> = [
  {
    Header: (props) => <RuleCustomHeader tableProps={props} title="Rule Name" className="min-w-125px" />,
    accessor: "sql",
  },
  {
    Header: (props) => <RuleCustomHeader tableProps={props} title="Created At" className="min-w-125px" />,
    accessor: "created_at",
    Cell: ({ value }) => convertGMTToLocalDateTime(value),
  },
  {
    Header: (props) => <RuleCustomHeader tableProps={props} title="Actions" className="text-end w-20px" />,
    id: "actions",
    Cell: ({ ...props }) => <RuleActionsCell id={props.data[props.row.index].id} />,
  },
];

export { rulesColumns };
