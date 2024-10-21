import { Column } from "react-table";
import { ThemeModeComponent } from "../../../../../../_metronic/assets/ts/layout";
import { toAbsoluteUrl } from "../../../../../../_metronic/helpers";
import { convertGMTToLocalDateTime } from "../../../../../constants/Common";
import { Channels } from "../../../api/_models";
import { ChannelsActionsCell } from "./ChannelsActionsCell";
import { ChannelsCustomHeader } from "./ChannelsCustomHeader";

const channelsColumns: ReadonlyArray<Column<Channels>> = [
  {
    Header: (props) => <ChannelsCustomHeader tableProps={props} title="Name" className="min-w-125px" />,
    accessor: "name",
  },
  {
    Header: (props) => <ChannelsCustomHeader tableProps={props} title="Description" className="min-w-125px" />,
    accessor: "description",
  },
  {
    Header: (props) => <ChannelsCustomHeader tableProps={props} title="Metadata" className="min-w-125px" />,
    accessor: "metadata",
    Cell: ({ value }) => {
      if (!value || typeof value !== "object") {
        return <span className="text-muted"></span>;
      }
      return (
        <div>
          {Object.entries(value).map(([key, val], index) => (
            <span key={index} className="badge badge-light-primary mr-2" style={{ display: "inline-block", marginBottom: "4px", marginRight: "4px" }}>
              {`${key}: ${val}`}
            </span>
          ))}
        </div>
      );
    },
  },
  {
    Header: (props) => <ChannelsCustomHeader tableProps={props} title="Created At" className="min-w-125px" />,
    accessor: "created_at",
    Cell: ({ value }) => convertGMTToLocalDateTime(value),
  },
  {
    Header: (props) => <ChannelsCustomHeader tableProps={props} title="Device Connection" className="min-w-50px" />,
    accessor: "isConnected",
    Cell: ({ value }) => {
      let ktThemeModeValue = localStorage.getItem("kt_theme_mode_value");
      if (ktThemeModeValue === "system") {
        ktThemeModeValue = ThemeModeComponent.getSystemMode() as "light" | "dark";
      }
      return value ? (
        <center>
          <img className="w-60px h-30px" src={toAbsoluteUrl(ktThemeModeValue === "dark" ? "media/device/connected_dark.svg" : "media/device/connected.svg")} alt="" />
        </center>
      ) : (
        <center>
          <img
            className="text-gray-400 w-50px h-25px"
            src={toAbsoluteUrl(ktThemeModeValue === "dark" ? "media/device/disconnected_dark.svg" : "media/device/disconnected.svg")}
            alt=""
          />
        </center>
      );
    },
  },
  {
    Header: (props) => <ChannelsCustomHeader tableProps={props} title="AssetGroup Connection" className="min-w-50px" />,
    accessor: "isLocated",
    Cell: ({ value }) =>
      value ? (
        <center>
          <i className="ki-duotone ki-abstract-26 fs-2x text-primary">
            <span className="path1"></span>
            <span className="path2"></span>
          </i>
        </center>
      ) : (
        <center>
          <i className="ki-duotone ki-abstract-26 fs-2x text-gray-400">
            <span className="path1"></span>
            <span className="path2"></span>
          </i>
        </center>
      ),
  },
  {
    Header: (props) => <ChannelsCustomHeader tableProps={props} title="Status" className="min-w-50px" />,
    accessor: "status",
    Cell: ({ ...props }) => (
      <>
        {props.data[props.row.index].status === "enabled" ? (
          <div className="badge badge-light-success fw-bolder">enabled</div>
        ) : (
          <div className="badge badge-light-danger fw-bolder">disabled</div>
        )}
      </>
    ),
  },
  {
    Header: (props) => <ChannelsCustomHeader tableProps={props} title="Actions" className="text-end min-w-100px" />,
    id: "actions",
    Cell: ({ ...props }) => <ChannelsActionsCell id={props.data[props.row.index].id} />,
  },
];

export { channelsColumns };
