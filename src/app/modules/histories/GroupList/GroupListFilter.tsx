import { Dispatch, SetStateAction, useRef, useState } from "react";
import { KTIcon } from "../../../../_metronic/helpers";
import { Typeahead } from "react-bootstrap-typeahead";
import { useQuery } from "@tanstack/react-query";
import { getThingListAll } from "../../things/api/ThingAPI";
import { toast } from "react-toastify";
import moment from "moment";

interface IGroupListHeaderProps {
  setFilterGroup: Dispatch<
    SetStateAction<{
      groupId: any;
      limit: number;
      offset: number;
      status: string;
      from: number;
      to: number;
      name: any;
    }>
  >;
}

const filterDevice = {
  limit: 100,
  offset: 0,
  status: "enabled",
};

interface TypeaheadMethods {
  clear: () => void;
}

const GroupListFilter = ({ setFilterGroup }: IGroupListHeaderProps) => {
  const [filter, setFilter] = useState({ name: "", from: 0, to: 0 });
  const typeaheadRef = useRef<TypeaheadMethods | null>(null);

  const deviceListQuery = useQuery({
    queryKey: [`deviceList`, filterDevice],
    queryFn: async () => getThingListAll(filterDevice).catch((error) => toast.error(error.message)),
    enabled: true,
  });

  // Extract and flatten the tags, then remove duplicates
  const uniqueTags = Array.from(
    new Set(
      (deviceListQuery.data?.things.flatMap((thing: any) => thing.tags as string[]) || [])
        .filter((tag: string | undefined) => tag) // Filter out undefined, null, or empty tags
        .map((tag: string) => tag.trim()) // Normalize tags by trimming and converting to lowercase
    )
  ).map((tag) => ({ label: tag }));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    let newValue: number | undefined;

    if (value) {
      if (name === "from") {
        // Set time to 12:00:00 AM for "from" date
        const fromDate = moment.utc(value).startOf("day");
        newValue = fromDate.valueOf();
      } else if (name === "to") {
        // Set time to 11:59:59 PM for "to" date
        const toDate = moment.utc(value).endOf("day");
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
    setFilterGroup((prev) => ({ ...prev, ...filter, from: filter.from * 1000, to: filter.to * 1000 }));
  };

  const resetFilter = () => {
    setFilter({ name: "", from: 0, to: 0 });
    setFilterGroup((prev) => ({ ...prev, name: "", from: 0, to: 0 }));

    // Clear the Typeahead input
    if (typeaheadRef.current) {
      typeaheadRef.current.clear();
    }
  };

  const handleTypeaheadContainerClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevents the modal from closing
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
        <div className="px-7 py-5" data-kt-user-table-filter="form">
          <div className="mt-1">
            <label className="form-label fs-6 fw-bold">Sensor Type:</label>
            <div onClick={handleTypeaheadContainerClick}>
              <Typeahead
                id="channelList"
                labelKey="label"
                className="fw-bolder"
                onChange={(selected) => {
                  const selectedNames = selected.filter((option) => typeof option === "object" && option !== null).map((option: any) => option.label);
                  setFilter((prev: any) => ({ ...prev, name: selectedNames }));
                }}
                options={uniqueTags || []}
                placeholder="Search Asset"
                multiple={true}
                ref={(ref) => {
                  typeaheadRef.current = ref as TypeaheadMethods;
                }}
              />
            </div>
          </div>
          <div className="mb-5 mt-2">
            <label className="form-label fs-6 fw-bold">From Date</label>
            <input type="date" className="form-control" name="from" onChange={handleChange} value={filter.from ? new Date(filter.from).toISOString().split("T")[0] : ""} />
          </div>
          <div className="mb-5">
            <label className="form-label fs-6 fw-bold">To Date</label>
            <input type="date" className="form-control" name="to" onChange={handleChange} value={filter.to ? new Date(filter.to).toISOString().split("T")[0] : ""} />
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

export { GroupListFilter };
