import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ColumnInstance, Row, useTable } from "react-table";
import { toast } from "react-toastify";
import { KTCard, KTCardBody } from "../../../../../_metronic/helpers";
import { getHistoryList } from "../../../histories/api/HistoryAPI";
import { getThingList } from "../../api/ThingAPI";
import { getThingChannelList } from "../../api/ThingChannelAPI";
import { Thing } from "../../api/_models";
import { AddThing } from "../AddEditThing/AddThing";
import { ImportThings } from "../AddEditThing/ImportThings/ImportThings";
import { ThingsListHeader } from "./ThingsListHeader";
import { CustomHeaderColumn } from "./columns/CustomHeaderColumn";
import { CustomRow } from "./columns/CustomRow";
import { thingsColumns } from "./columns/_columns";
import { ThingsListLoading } from "./pagination/ThingsListLoading";
import { ThingsListPagination } from "./pagination/ThingsListPagination";

const ThingsTable = () => {
  const [showAddThing, setShowAddThing] = useState(false);
  const [importModal, setImportModal] = useState(false);
  const filterChannel = {
    limit: 10,
    offset: 0,
    name: "",
    metadata: "",
    status: "enabled",
  };
  const [filterThing, setFilterThing] = useState({
    limit: 10,
    offset: 0,
    name: "",
    metadata: "",
    tags: "",
    status: "enabled",
  });

  const onShowImportThing = () => setImportModal(true);
  const onCloseImportThing = () => setImportModal(false);

  const thingListQuery = useQuery({
    queryKey: [`thingList`, filterThing],
    queryFn: async () =>
      getThingList(filterThing)
        .then(async (response) => {
          const things = await Promise.all(
            response.things.map(async (thing: any) => {
              try {
                const channel = await getThingChannelList(thing.id, filterChannel).catch((error) => toast.error(error?.response?.data?.message || "Something went wrong"));
                const historyData = await Promise.all(
                  channel.groups.map(async (group: any) => {
                    try {
                      const filterHistory = {
                        limit: 10,
                        offset: 0,
                        name: "",
                        publisher: thing.id,
                        status: "enabled",
                      };
                      const history = await getHistoryList(group.id, filterHistory).catch((error) => toast.error(error?.response?.data?.message || "Something went wrong"));
                      return history;
                    } catch (error) {
                      return [];
                    }
                  })
                );

                const flatHistory: any = historyData.flat().sort((a: any, b: any) => a.time - b.time);

                // Convert current time to Unix timestamp
                const now = Number(String(new Date().getTime()).slice(0, 10));

                // Calculate activity status
                let activity = "inactive";

                if (thing.metadata?.Update_Frequency) {
                  const updateFrequency = parseInt(thing.metadata.Update_Frequency);

                  if (flatHistory.length > 0 && flatHistory[0].messages?.length > 0) {
                    const firstRecordTime = Number(String(flatHistory[0].messages[0].time).slice(0, 10));
                    const timeDifference = now - firstRecordTime;
                    if (timeDifference >= 0 && timeDifference <= updateFrequency) {
                      activity = "active";
                    }
                  }
                }

                return {
                  ...thing,
                  isConnected: channel.total > 0,
                  activity,
                  lastSeenMsg: flatHistory.length > 0 && flatHistory[0].messages?.length > 0 && flatHistory[0].messages[0].time ? flatHistory[0].messages[0].time : null,
                };
              } catch (error) {
                return {
                  ...thing,
                  isConnected: false,
                  activity: "inactive",
                  lastSeenMsg: null,
                };
              }
            })
          );
          return { ...response, things };
        })
        .catch((error) => toast.error(error?.response?.data?.message || "Something went wrong")),
    enabled: true,
  });

  const isLoading = thingListQuery.isLoading;
  const data = useMemo(() => thingListQuery.data?.things || [], [thingListQuery.data]);
  const columns = useMemo(() => thingsColumns, []);
  const { getTableProps, getTableBodyProps, headers, rows, prepareRow } = useTable({
    columns,
    data,
  });

  const onShowAddThing = () => {
    setShowAddThing(true);
  };

  const onCloseAddThing = () => {
    setShowAddThing(false);
  };

  const onGetThingList = () => {
    thingListQuery.refetch();
  };

  return (
    <KTCard>
      <ThingsListHeader onShowAddThing={onShowAddThing} onShowImportThing={onShowImportThing} setFilterThing={setFilterThing} filterThing={filterThing} />
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
        {showAddThing && <AddThing onCloseAddThing={onCloseAddThing} onGetThingList={onGetThingList} />}
        {importModal && <ImportThings onShowImportThing={importModal} onCloseImportThing={onCloseImportThing} onGetThingList={onGetThingList} />}
        {isLoading && <ThingsListLoading />}
      </KTCardBody>
    </KTCard>
  );
};

export { ThingsTable };
