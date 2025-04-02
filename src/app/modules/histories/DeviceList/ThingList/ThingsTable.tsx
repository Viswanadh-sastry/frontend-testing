import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ColumnInstance, Row, useTable } from "react-table";
import { toast } from "react-toastify";
import { KTCard, KTCardBody } from "../../../../../_metronic/helpers";
import { getThingList } from "../../../things/api/ThingAPI";
import { SelectedValuesProvider } from "../../HistoryContext";
import { Thing } from "../../api/_models";
import { ThingsListHeader } from "./ThingsListHeader";
import { CustomHeaderColumn } from "./columns/CustomHeaderColumn";
import { CustomRow } from "./columns/CustomRow";
import { thingsColumns } from "./columns/_columns";
import { ThingsListLoading } from "./pagination/ThingsListLoading";
import { ThingsListPagination } from "./pagination/ThingsListPagination";

const ThingsTable = () => {
  const [filterThing, setFilterThing] = useState({
    limit: 10,
    offset: 0,
    name: "",
    metadata: "",
    tags: "",
    status: "enabled",
  });

  const thingListQuery = useQuery({
    queryKey: [`thingList`, filterThing],
    queryFn: async () => getThingList(filterThing).catch((error) => toast.error(error?.response?.data?.message || "Something went wrong")),
    enabled: true,
  });

  const isLoading = thingListQuery.isLoading;
  const data = useMemo(() => thingListQuery.data?.things || [], [thingListQuery.data]);
  const columns = useMemo(() => thingsColumns, []);
  const { getTableProps, getTableBodyProps, headers, rows, prepareRow } = useTable({
    columns,
    data,
  });

  return (
    <SelectedValuesProvider>
      <KTCard>
        <ThingsListHeader setFilterThing={setFilterThing} />
        <KTCardBody className="py-4">
          <div className="table-responsive">
            <table id="kt_table_things" className="table align-middle table-row-dashed fs-6 dataTable no-footer" {...getTableProps()}>
              <thead>
                <tr className="text-start text-muted fw-bolder fs-7 text-uppercase gs-0">
                  {headers.map((column: ColumnInstance<Thing>) => (
                    <CustomHeaderColumn key={column.id} column={column} />
                  ))}
                </tr>
              </thead>
              <tbody className="text-gray-600" {...getTableBodyProps()}>
                {rows.length > 0 ? (
                  rows.map((row: Row<Thing>, i) => {
                    prepareRow(row);
                    return <CustomRow row={row} key={`row-${i}-${row.id}`} />;
                  })
                ) : (
                  <tr>
                    <td colSpan={7}>
                      <div className="d-flex text-center w-100 align-content-center justify-content-center">No matching records found</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <ThingsListPagination filterThing={filterThing} setFilterThing={setFilterThing} />
          {isLoading && <ThingsListLoading />}
        </KTCardBody>
      </KTCard>
    </SelectedValuesProvider>
  );
};

export { ThingsTable };
