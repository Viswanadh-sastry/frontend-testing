import { FC, PropsWithChildren, useEffect, useState } from "react";
import { HeaderProps } from "react-table";
import { Notification } from "../../../api/_models";
import { useSelectedValues } from "../../../NotificationContext";

type Props = {
  className?: string;
  title?: string;
  tableProps: PropsWithChildren<HeaderProps<Notification>>;
};

const NotificationCustomHeader: FC<Props> = ({ className, title, tableProps }) => {
  const { selectedValues, setSelectedValues } = useSelectedValues();
  const [isChecked, setIsChecked] = useState(false);

  const isCheckboxHeader = tableProps.column.id === "checkbox";

  useEffect(() => {
    const currentIds = tableProps.data.map((row: Notification) => row.id).filter((id): id is string => id !== undefined);

    const allSelected = currentIds.every((id) => selectedValues.includes(id));
    setIsChecked(allSelected);
  }, [tableProps.data, selectedValues]);

  const handleCheckboxChange = (checked: boolean) => {
    setIsChecked(checked);

    // Filter out undefined IDs
    const currentIds = tableProps.data.map((row: Notification) => row.id).filter((id): id is string => id !== undefined);

    setSelectedValues((prevSelected: string[]) => {
      if (checked) {
        // Add current page items to the selected list
        return Array.from(new Set([...prevSelected, ...currentIds]));
      } else {
        // Remove current page items from the selected list
        return prevSelected.filter((id) => !currentIds.includes(id));
      }
    });
  };

  return (
    <th {...tableProps.column.getHeaderProps()} className={className} key={tableProps.column.id}>
      {isCheckboxHeader ? (
        <div className="form-check form-check-custom form-check-solid mx-5">
          <input className="form-check-input" type="checkbox" checked={isChecked} onChange={(e) => handleCheckboxChange(e.target.checked)} />
        </div>
      ) : (
        title
      )}
    </th>
  );
};

export { NotificationCustomHeader };
