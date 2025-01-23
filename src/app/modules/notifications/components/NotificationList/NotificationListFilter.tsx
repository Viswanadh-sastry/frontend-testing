import moment from "moment";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { toast } from "react-toastify";
import { KTIcon } from "../../../../../_metronic/helpers";
import { ThemeModeComponent } from "../../../../../_metronic/assets/ts/layout";

interface INotificationListHeaderProps {
  setFilterNotification: Dispatch<
    SetStateAction<{
      status: string;
      from: number;
      to: number;
    }>
  >;
  setNotificationList: Dispatch<SetStateAction<any>>;
}

interface TypeaheadMethods {
  clear: () => void;
}

const NotificationListFilter = ({ setFilterNotification, setNotificationList }: INotificationListHeaderProps) => {
  let ktThemeModeValue = localStorage.getItem("kt_theme_mode_value");
  if (ktThemeModeValue === "system") {
    ktThemeModeValue = ThemeModeComponent.getSystemMode() as "light" | "dark";
  }
  const [filter, setFilter] = useState({ from: 0, to: 0, cleanupByAge: 0, cleanup: 0 });
  const typeaheadRef = useRef<TypeaheadMethods | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    let newValue: number | undefined;

    if (value) {
      if (name === "from") {
        // Set time to 12:00:00 AM for "from" date
        const fromDate = moment(value).startOf("day");
        newValue = fromDate.valueOf();
      } else if (name === "to") {
        // Set time to 11:59:59 PM for "to" date
        const toDate = moment(value).endOf("day");
        newValue = toDate.valueOf();
      }
    }

    setFilter((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const applyFilter = () => {
    if (filter.from != 0 && filter.to != 0) {
      if (filter.from > filter.to) {
        toast.error("To date should be greater than from date.");
        return;
      }
    }
    setNotificationList([]);
    setFilterNotification((prev) => ({ ...prev, ...filter, from: filter.from / 1000, to: filter.to / 1000 }));
  };

  const resetFilter = () => {
    setNotificationList([]);
    setFilter({ from: 0, to: 0, cleanupByAge: 0, cleanup: 0 });
    setFilterNotification((prev) => ({ ...prev, from: 0, to: 0 }));

    // Clear the Typeahead input
    if (typeaheadRef.current) {
      typeaheadRef.current.clear();
    }
  };

  return (
    <>
      <button type="button" className="btn btn-light-primary me-3" data-kt-menu-trigger="click" data-kt-menu-placement="bottom-end">
        <KTIcon iconName="filter" className="fs-2" />
        Filter
      </button>
      <div className="menu menu-sub menu-sub-dropdown w-300px w-md-325px" data-kt-menu="true">
        <div className="px-7 py-5">
          <div className="fs-5 text-gray-900 fw-bolder">Filter Options</div>
        </div>
        <div className="separator border-gray-200"></div>
        <div className="px-7 py-5" data-kt-notification-table-filter="form">
          <div className="mt-1">
            <label className="form-label fs-6 fw-bold">From Date</label>
            <input
              type="date"
              className="form-control"
              name="from"
              onChange={handleChange}
              value={filter.from ? moment(filter.from).format("YYYY-MM-DD") : ""}
              style={{ colorScheme: ktThemeModeValue || undefined }}
            />
          </div>
          <div className="mb-5 mt-2">
            <label className="form-label fs-6 fw-bold">To Date</label>
            <input
              type="date"
              className="form-control"
              name="to"
              onChange={handleChange}
              value={filter.to ? moment(filter.to).format("YYYY-MM-DD") : ""}
              style={{ colorScheme: ktThemeModeValue || undefined }}
            />
          </div>
          <div className="mb-5 mt-2">
            <label className="form-label fs-6 fw-bold">Cleanup By Age</label>
            <input
              type="date"
              className="form-control"
              name="cleanupByAge"
              onChange={handleChange}
              value={filter.cleanupByAge ? new Date(filter.cleanupByAge).toISOString().split("T")[0] : ""}
              style={{ colorScheme: ktThemeModeValue || undefined }}
            />
          </div>
          <div className="mb-5 mt-2">
            <label className="form-label fs-6 fw-bold">Cleanup</label>
            <input
              type="date"
              className="form-control"
              name="cleanup"
              onChange={handleChange}
              value={filter.cleanup ? new Date(filter.cleanup).toISOString().split("T")[0] : ""}
              style={{ colorScheme: ktThemeModeValue || undefined }}
            />
          </div>
          <div className="d-flex justify-content-end">
            <button type="button" className="btn btn-light btn-active-light-primary fw-bold me-2 px-6" data-kt-menu-dismiss="true" onClick={resetFilter}>
              Reset
            </button>
            <button type="button" className="btn btn-primary fw-bold px-6" data-kt-menu-dismiss="true" onClick={applyFilter}>
              Apply
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export { NotificationListFilter };
