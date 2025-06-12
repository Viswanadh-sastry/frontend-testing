import { FC } from "react";

interface SortButtonProps {
  onSortChange: (sort_by: string) => void;
  currentSortBy?: string;
}

const sortOptions = [
  { label: "Sort by Name (A–Z)", value: "name" },
  { label: "Sort by Name (Z–A)", value: "name_desc" },
  { label: "Sort by Created At (Oldest First)", value: "created_at" },
  { label: "Sort by Created At (Newest First)", value: "created_at_desc" },
];

export const SortButton: FC<SortButtonProps> = ({ onSortChange, currentSortBy }) => {
  return (
    <div className="dropdown">
      <button
        className="btn btn-light-primary dropdown-toggle"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        Sort
      </button>
      <ul className="dropdown-menu">
        {sortOptions.map(({ label, value }) => (
          <li key={value}>
            <button
              className="dropdown-item"
              onClick={() => onSortChange(value)}
            >
              {label} {currentSortBy === value && "✓"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
