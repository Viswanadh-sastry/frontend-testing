import { Column } from "react-table";
import { Integration } from "../../../../api/_models";
import { IntegrationActionsCell } from "./IntegrationActionsCell";
import { IntegrationCustomHeader } from "./IntegrationCustomHeader";

const integrationsColumns: ReadonlyArray<Column<Integration>> = [
  {
    Header: (props) => <IntegrationCustomHeader tableProps={props} title="Kind" className="min-w-100px" />,
    accessor: "kind",
  },
  {
    Header: (props) => <IntegrationCustomHeader tableProps={props} title="Actions" className="text-end min-w-100px" />,
    id: "actions",
    Cell: ({ ...props }) => <IntegrationActionsCell kind={props.data[props.row.index].kind} />,
  },
];

export { integrationsColumns };
