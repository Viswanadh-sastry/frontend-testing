import { Column } from "react-table";
import { NotificationCustomHeader } from "./NotificationCustomHeader";
import { Notification } from "../../../api/_models";
import { convertGMTToLocalDateTime } from "../../../../../constants/Common";

const notificationsColumns: ReadonlyArray<Column<Notification>> = [
  {
    Header: (props) => <NotificationCustomHeader tableProps={props} title="" className="min-w-20px" />,
    accessor: "checkbox",
  },
  {
    Header: (props) => <NotificationCustomHeader tableProps={props} title="Asset" className="min-w-125px" />,
    accessor: "asset",
  },
  {
    Header: (props) => <NotificationCustomHeader tableProps={props} title="Device" className="min-w-125px" />,
    accessor: "device",
  },
  {
    Header: (props) => <NotificationCustomHeader tableProps={props} title="Content" className="min-w-125px" />,
    accessor: "content",
  },
  {
    Header: (props) => <NotificationCustomHeader tableProps={props} title="Description" className="min-w-125px" />,
    accessor: "description",
  },
  {
    Header: (props) => <NotificationCustomHeader tableProps={props} title="Sender" className="min-w-125px" />,
    accessor: "sender",
  },
  {
    Header: (props) => <NotificationCustomHeader tableProps={props} title="Severity" className="min-w-125px" />,
    accessor: "severity",
  },
  {
    Header: (props) => <NotificationCustomHeader tableProps={props} title="Status" className="min-w-125px" />,
    accessor: "status",
  },
  {
    Header: (props) => <NotificationCustomHeader tableProps={props} title="Created" className="min-w-125px" />,
    accessor: "created_at",
    Cell: ({ value }) => convertGMTToLocalDateTime(value),
  },
  {
    Header: (props) => <NotificationCustomHeader tableProps={props} title="Modified" className="min-w-125px" />,
    accessor: "updated_at",
    Cell: ({ value }) => convertGMTToLocalDateTime(value),
  },
];

export { notificationsColumns };
