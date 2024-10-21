import clsx from "clsx";
import { FC } from "react";
import { Row } from "react-table";
import { Dashboard } from "../../../api/_models";
import { useNavigate } from "react-router-dom";

type Props = {
  row: Row<Dashboard>;
};

const CustomRow: FC<Props> = ({ row }) => {
  const navigate = useNavigate();
  return (
    <tr {...row.getRowProps()} key={row.id}>
      {row.cells.map((cell) => {
        return (
          <td {...cell.getCellProps()} className={clsx({ "text-end min-w-100px": cell.column.id === "actions" })} key={cell.column.id}>
            {cell.column.id === "name" ? (
              <span className="text-primary" onClick={() => navigate(`/dashboard/${row.original.id}/view`)} style={{ cursor: "pointer" }}>
                {cell.render("Cell")}
              </span>
            ) : (
              cell.render("Cell")
            )}
          </td>
        );
      })}
    </tr>
  );
};

export { CustomRow };
