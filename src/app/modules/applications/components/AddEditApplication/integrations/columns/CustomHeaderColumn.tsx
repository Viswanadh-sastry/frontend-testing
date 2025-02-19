import { FC } from "react";
import { ColumnInstance } from "react-table";
import { Integration } from "../../../../api/_models";

type Props = {
  column: ColumnInstance<Integration>;
};

const CustomHeaderColumn: FC<Props> = ({ column }) => (
  <>{column.Header && typeof column.Header === "string" ? <th {...column.getHeaderProps()}>{column.render("Header")}</th> : column.render("Header")}</>
);

export { CustomHeaderColumn };
