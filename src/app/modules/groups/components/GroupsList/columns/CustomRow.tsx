import clsx from "clsx";
import { FC, useState } from "react";
import { Row } from "react-table";
import { convertGMTToLocalDateTime } from "../../../../../constants/Common";
import { Group } from "../../../api/_models";
import { GroupActionsCell } from "./GroupActionsCell";

type Props = {
  row: Row<Group>;
  onRowClick: (rowId: string) => void;
  isExpanded: boolean;
  level?: number;
};

const CustomRow: FC<Props> = ({ row, onRowClick, isExpanded, level = 0 }) => {
  const hasChildren = row.original.children && row.original.children.length > 0;

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
            {cell.column.id === "tree" ? (
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
        row.original.children.map((child) => <ChildRow key={child.id} child={child} parentCells={row.cells} onRowClick={onRowClick} level={level + 1} />)}
    </>
  );
};

type ChildRowProps = {
  child: Group;
  parentCells: any[];
  onRowClick: (rowId: string) => void;
  level: number;
};

const ChildRow: FC<ChildRowProps> = ({ child, parentCells, onRowClick, level }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = child.children && child.children.length > 0;

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
            {cell.column.id === "tree" ? (
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
            ) : cell.column.id === "actions" ? (
              <GroupActionsCell id={child.id} />
            ) : null}
          </td>
        ))}
      </tr>
      {isExpanded &&
        hasChildren &&
        child.children.map((grandchild) => <ChildRow key={grandchild.id} child={grandchild} parentCells={parentCells} onRowClick={onRowClick} level={level + 1} />)}
    </>
  );
};

export { CustomRow };
