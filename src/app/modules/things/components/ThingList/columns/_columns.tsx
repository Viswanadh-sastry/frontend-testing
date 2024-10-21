import { Column } from "react-table";
import { ThingActionsCell } from "./ThingActionsCell";
import { ThingMessagingCell } from "./ThingMessagingCell";
import { ThingCustomHeader } from "./ThingCustomHeader";
import { Thing } from "../../../api/_models";
import { toAbsoluteUrl } from "../../../../../../_metronic/helpers";
import { ThemeModeComponent } from "../../../../../../_metronic/assets/ts/layout";
import { convertUnixTimestampToLocalDateTime, convertGMTToLocalDateTime } from "../../../../../../app/constants/Common";

const thingsColumns: ReadonlyArray<Column<Thing>> = [
  {
    Header: (props) => <ThingCustomHeader tableProps={props} title="Name" className="min-w-125px" />,
    accessor: "name",
  },
  {
    Header: (props) => <ThingCustomHeader tableProps={props} title="Tags" className="min-w-125px" />,
    accessor: "tags",
    Cell: ({ value }) => (
      <>
        {value?.map((tag: string, index: number) => (
          <div key={index} className="badge badge-light-primary fw-bolder me-2">
            {tag}
          </div>
        ))}
      </>
    ),
  },
  {
    Header: (props) => <ThingCustomHeader tableProps={props} title="Metadata" className="min-w-125px" />,
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
    Header: (props) => <ThingCustomHeader tableProps={props} title="Created At" className="min-w-125px" />,
    accessor: "created_at",
    Cell: ({ value }) => convertGMTToLocalDateTime(value),
  },
  {
    Header: (props) => <ThingCustomHeader tableProps={props} title="Device Connection" className="min-w-50px" />,
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
    Header: (props) => <ThingCustomHeader tableProps={props} title="Status" className="min-w-50px" />,
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
    Header: (props) => <ThingCustomHeader tableProps={props} title="Activity" className="min-w-50px" />,
    accessor: "activity",
    Cell: ({ ...props }) => (
      <>
        {props.data[props.row.index].activity === "active" ? (
          <div className="badge badge-light-success fw-bolder">active</div>
        ) : (
          <div className="badge badge-light-danger fw-bolder">inactive</div>
        )}
      </>
    ),
  },
  {
    Header: (props) => <ThingCustomHeader tableProps={props} title="Last Seen Message" className="min-w-100px" />,
    accessor: "lastSeenMsg",
    Cell: ({ value }) => convertUnixTimestampToLocalDateTime(value),
  },
  {
    Header: (props) => <ThingCustomHeader tableProps={props} title="Messaging" className="w-20px" />,
    accessor: "id",
    Cell: ({ value }) => <ThingMessagingCell id={value} />,
  },
  {
    Header: (props) => <ThingCustomHeader tableProps={props} title="Actions" className="text-end w-20px" />,
    id: "actions",
    Cell: ({ ...props }) => <ThingActionsCell id={props.data[props.row.index].id} />,
  },
];

export { thingsColumns };
