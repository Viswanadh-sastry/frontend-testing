import { FC } from "react";
import { ColumnInstance } from "react-table";
import { Device } from "../../../../api/_models";

type Props = {
  column: ColumnInstance<Device>;
};

const CustomHeaderColumn: FC<Props> = ({ column }) => (
  <>{column.Header && typeof column.Header === "string" ? <th {...column.getHeaderProps()}>{column.render("Header")}</th> : column.render("Header")}</>
);

export { CustomHeaderColumn };
