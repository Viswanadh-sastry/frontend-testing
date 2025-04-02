import { Column } from "react-table";
import { SubscriptionActionsCell } from "./SubscriptionActionsCell";
import { SubscriptionCustomHeader } from "./SubscriptionCustomHeader";
import { Subscription } from "../../../api/_models";

const subscriptionsColumns: ReadonlyArray<Column<Subscription>> = [
  {
    Header: (props) => <SubscriptionCustomHeader tableProps={props} title="Name" className="min-w-125px" />,
    accessor: "name",
  },
  {
    Header: (props) => <SubscriptionCustomHeader tableProps={props} title="Categories" className="min-w-125px" />,
    accessor: "categories",
    Cell: ({ value }) => (
      <>
        {value?.map((label: string, index: number) => (
          <div key={index} className="badge badge-light-primary fw-bolder me-2">
            {label}
          </div>
        ))}
      </>
    ),
  },
  {
    Header: (props) => <SubscriptionCustomHeader tableProps={props} title="Labels" className="min-w-125px" />,
    accessor: "labels",
    Cell: ({ value }) => (
      <>
        {value?.map((label: string, index: number) => (
          <div key={index} className="badge badge-light-primary fw-bolder me-2">
            {label}
          </div>
        ))}
      </>
    ),
  },
  {
    Header: (props) => <SubscriptionCustomHeader tableProps={props} title="Channels" className="min-w-125px" />,
    accessor: "channels",
    Cell: ({ value }) => <div className="badge badge-light-primary fw-bolder me-2">{value?.length}</div>,
  },
  {
    Header: (props) => <SubscriptionCustomHeader tableProps={props} title="Receiver" className="min-w-125px" />,
    accessor: "receiver",
  },
  {
    Header: (props) => <SubscriptionCustomHeader tableProps={props} title="ResendLimit" className="min-w-125px" />,
    accessor: "resendLimit",
  },
  {
    Header: (props) => <SubscriptionCustomHeader tableProps={props} title="ResendInterval" className="min-w-125px" />,
    accessor: "resendInterval",
  },
  {
    Header: (props) => <SubscriptionCustomHeader tableProps={props} title="Actions" className="text-end w-150px" />,
    id: "actions",
    Cell: ({ ...props }) => <SubscriptionActionsCell row={props.row} />,
  },
];

export { subscriptionsColumns };
