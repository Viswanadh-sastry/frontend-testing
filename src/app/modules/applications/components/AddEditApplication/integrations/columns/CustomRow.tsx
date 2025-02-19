import clsx from "clsx";
import { FC } from "react";
import { Row } from "react-table";
import { Integration } from "../../../../api/_models";

type Props = {
  row: Row<Integration>;
};

const CustomRow: FC<Props> = ({ row }) => (
  <tr {...row.getRowProps()} key={row.id}>
    {row.cells.map((cell) => {
      return (
        <td {...cell.getCellProps()} className={clsx({ "text-end min-w-100px": cell.column.id === "actions" })} key={cell.column.id}>
          {cell.render("Cell")}
        </td>
      );
    })}
  </tr>
);

export { CustomRow };
