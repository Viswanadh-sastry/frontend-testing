import clsx from "clsx";
import { FC, useState } from "react";
import { Row } from "react-table";
import { convertGMTToLocalDateTime } from "../../../../../constants/Common";
import { Group } from "../../../api/_models";
import { useSelectedValues } from "../../../HistoryContext";

type Props = {
  row: Row<Group>;
  onRowClick: (rowId: string) => void;
  isExpanded: boolean;
  level?: number;
};

const CustomRow: FC<Props> = ({ row, onRowClick, isExpanded, level = 0 }) => {
  const hasChildren = row.original.children && row.original.children.length > 0;
  const { selectedValues, setSelectedValues } = useSelectedValues();

  const handleCheckboxChange = (checked: boolean, id?: string) => {
    if (!id) return; // Skip if id is undefined

    // Function to recursively handle selection/deselection of parent and children
    const handleSelectRecursive = (row: any, checked: boolean) => {
      const { id, children } = row;

      // Update the selected values for the current item
      setSelectedValues((prev: any) => (checked ? [...prev, id] : prev.filter((v: any) => v !== id)));

      if (children && children.length > 0) {
        children.forEach((child: any) => handleSelectRecursive(child, checked));
      }
    };

    // Find the row based on the given id
    const findRowById = (rows: any[], id: string): any => {
      for (const row of rows) {
        if (row.id === id) {
          return row;
        }
        if (row.children && row.children.length > 0) {
          const childRow = findRowById(row.children, id);
          if (childRow) {
            return childRow;
          }
        }
      }
      return null;
    };

    const rowToSelect = findRowById([row.original], id);
    if (rowToSelect) {
      handleSelectRecursive(rowToSelect, checked);
    }
  };

  const isChecked = row.original.id ? selectedValues.includes(row.original.id) : false;

  return (
    <>
      <tr {...row.getRowProps()} key={row.id}>
        {row.cells.map((cell) => (
          <td
            {...cell.getCellProps()}
            className={clsx({
              "text-center min-w-30px": cell.column.id === "actions",
            })}
            style={{ paddingLeft: level > 0 && cell.column.id === "name" ? `${level * 2}rem` : "" }}
            key={cell.column.id}
          >
            {cell.column.id === "checkbox" ? (
              <div className="form-check form-check-custom form-check-solid mx-5">
                <input className="form-check-input" type="checkbox" checked={isChecked} onChange={(e) => handleCheckboxChange(e.target.checked, row.original.id)} />
              </div>
            ) : cell.column.id === "tree" ? (
              hasChildren ? (
                <button className="btn btn-link p-0" onClick={() => onRowClick(row.id)}>
                  {isExpanded ? <i className="fas fa-chevron-up ms-2"></i> : <i className="fas fa-chevron-down ms-2"></i>}
                </button>
              ) : (
                cell.render("Cell")
              )
            ) : (
              cell.render("Cell")
            )}
          </td>
        ))}
      </tr>
      {isExpanded &&
        hasChildren &&
        row.original.children.map((child) => (
          <ChildRow
            key={child.id}
            child={child}
            parentCells={row.cells}
            onRowClick={onRowClick}
            level={level + 1}
            handleCheckboxChange={handleCheckboxChange}
            selectedValues={selectedValues}
          />
        ))}
    </>
  );
};

type ChildRowProps = {
  child: Group;
  parentCells: any[];
  onRowClick: (rowId: string) => void;
  level: number;
  handleCheckboxChange: (checked: boolean, id?: string) => void;
  selectedValues: string[];
};

const ChildRow: FC<ChildRowProps> = ({ child, parentCells, onRowClick, level, handleCheckboxChange, selectedValues }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = child.children && child.children.length > 0;

  const isChecked = child.id ? selectedValues.includes(child.id) : false;

  return (
    <>
      <tr className={`bg-gray-${level}00`}>
        {parentCells.map((cell, index) => (
          <td
            {...cell.getCellProps()}
            key={index}
            className={clsx({
              "text-center min-w-30px": cell.column.id === "actions",
            })}
            style={{ paddingLeft: level > 0 && cell.column.id === "name" ? `${level * 2}rem` : "" }}
          >
            {cell.column.id === "checkbox" ? (
              <div className="form-check form-check-custom form-check-solid mx-5">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={isChecked}
                  onChange={(e) => handleCheckboxChange(e.target.checked, child.id)}
                  style={{ backgroundColor: isChecked ? `#f29a25` : `var(--gray-${level + 1}00)` }}
                />
              </div>
            ) : cell.column.id === "tree" ? (
              hasChildren ? (
                <button className="btn btn-link p-0" onClick={() => setIsExpanded(!isExpanded)}>
                  {isExpanded ? <i className="fas fa-chevron-up ms-2"></i> : <i className="fas fa-chevron-down ms-2"></i>}
                </button>
              ) : (
                <span></span>
              )
            ) : cell.column.id === "name" ? (
              child.name
            ) : cell.column.id === "description" ? (
              child.description
            ) : cell.column.id === "metadata" ? (
              !child.metadata || typeof child.metadata !== "object" ? (
                <span className="text-muted"></span>
              ) : (
                <div>
                  {Object.entries(child.metadata).map(([key, val], index) => (
                    <span key={index} className="badge badge-light-primary mr-2" style={{ display: "inline-block", marginBottom: "4px", marginRight: "4px" }}>
                      {`${key}: ${val}`}
                    </span>
                  ))}
                </div>
              )
            ) : cell.column.id === "created_at" ? (
              convertGMTToLocalDateTime(child.created_at)
            ) : cell.column.id === "status" ? (
              child.status === "enabled" ? (
                <div className="badge badge-light-success fw-bolder">enabled</div>
              ) : (
                <div className="badge badge-light-danger fw-bolder">disabled</div>
              )
            ) : null}
          </td>
        ))}
      </tr>
      {isExpanded &&
        hasChildren &&
        child.children.map((grandchild) => (
          <ChildRow
            key={grandchild.id}
            child={grandchild}
            parentCells={parentCells}
            onRowClick={onRowClick}
            level={level + 1}
            handleCheckboxChange={handleCheckboxChange}
            selectedValues={selectedValues}
          />
        ))}
    </>
  );
};

export { CustomRow };
