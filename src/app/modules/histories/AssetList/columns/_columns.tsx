import { Column } from "react-table";
import { convertUnixTimestampToLocalDateTime } from "../../../../constants/Common";
import { History } from "../../api/_models";
import { AssetCustomHeader } from "./AssetCustomHeader";

const assetColumns: ReadonlyArray<Column<History>> = [
  {
    Header: (props) => <AssetCustomHeader tableProps={props} title="Sent At" className="min-w-100px" />,
    accessor: "time",
    Cell: ({ value }) => convertUnixTimestampToLocalDateTime(value),
  },
  {
    Header: (props) => <AssetCustomHeader tableProps={props} title="Subtopic" className="min-w-50px" />,
    accessor: "subtopic",
  },
  {
    Header: (props) => <AssetCustomHeader tableProps={props} title="Publisher" className="min-w-200px" />,
    accessor: "publisher",
  },
  {
    Header: (props) => <AssetCustomHeader tableProps={props} title="Protocol" className="min-w-50px" />,
    accessor: "protocol",
  },
  {
    Header: (props) => <AssetCustomHeader tableProps={props} title="Name" className="min-w-125px" />,
    accessor: "name",
  },
  {
    Header: (props) => <AssetCustomHeader tableProps={props} title="Unit" className="min-w-60px" />,
    accessor: "unit",
  },
  {
    Header: (props) => <AssetCustomHeader tableProps={props} title="Value" className="min-w-60px" />,
    accessor: "value",
    Cell: ({ value }) => <div className="badge badge-light-primary fw-bolder">{value}</div>,
  },
  {
    Header: (props) => <AssetCustomHeader tableProps={props} title="String Value" className="min-w-100px" />,
    accessor: "string_value",
    Cell: ({ value }) => <div className="badge badge-light-primary fw-bolder">{value}</div>,
  },
  {
    Header: (props) => <AssetCustomHeader tableProps={props} title="Bool Value" className="min-w-50px" />,
    accessor: "bool_value",
    Cell: ({ value }) => <div className="badge badge-light-primary fw-bolder">{value}</div>,
  },
  {
    Header: (props) => <AssetCustomHeader tableProps={props} title="Data Value" className="min-w-100px" />,
    accessor: "data_value",
    Cell: ({ value }) => <div className="badge badge-light-primary fw-bolder">{value}</div>,
  },
  {
    Header: (props) => <AssetCustomHeader tableProps={props} title="Sum" className="min-w-50px" />,
    accessor: "sum",
  },
];

export { assetColumns };
