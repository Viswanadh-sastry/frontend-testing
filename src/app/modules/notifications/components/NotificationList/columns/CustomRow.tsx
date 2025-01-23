import clsx from "clsx";
import { FC } from "react";
import { Row } from "react-table";
import { useSelectedValues } from "../../../NotificationContext";
import { Notification } from "../../../api/_models";

type Props = {
  row: Row<Notification>;
};

const CustomRow: FC<Props> = ({ row }) => {
  const { selectedValues, setSelectedValues } = useSelectedValues();

  const handleCheckboxChange = (checked: boolean, id?: string) => {
    if (!id) return; // Skip if id is undefined
    setSelectedValues((prev: any) => (checked ? [...prev, id] : prev.filter((v: any) => v !== id)));
  };

  const isChecked = row.original.id ? selectedValues.includes(row.original.id) : false;

  return (
    <tr {...row.getRowProps()} key={row.original.id}>
      {row.cells.map((cell) => {
        if (cell.column.id === "checkbox") {
          return (
            <td key={cell.column.id}>
              <div className="form-check form-check-custom form-check-solid mx-5">
                <input className="form-check-input" type="checkbox" checked={isChecked} onChange={(e) => handleCheckboxChange(e.target.checked, row.original.id)} />
              </div>
            </td>
          );
        }
        return (
          <td
            {...cell.getCellProps()}
            className={clsx({
              "text-end min-w-100px": cell.column.id === "actions",
            })}
            key={cell.column.id}
          >
            {cell.render("Cell")}
          </td>
        );
      })}
    </tr>
  );
};

export { CustomRow };
