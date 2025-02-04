import clsx from "clsx";
import { useEffect, useMemo } from "react";
import { PaginationState } from "../../../../../../_metronic/helpers";
import { getHistoryList } from "../../../../histories/api/HistoryAPI";
import { getThingChannelList } from "../../../api/ThingChannelAPI";

const mappedLabel = (label: string): string => {
  if (label === "&laquo; Previous") {
    return "Previous";
  }

  if (label === "Next &raquo;") {
    return "Next";
  }

  return label;
};

interface IThingsListPaginationProps {
  thingList: any[];
  itemsPerPage: any;
  pagination: PaginationState;
  data: any;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (itemsPerPage: any) => void;
  setPagination: (pagination: PaginationState) => void;
  setData: (data: any) => void;
}

const ThingsListPagination = ({ thingList, itemsPerPage, pagination, data, setCurrentPage, setItemsPerPage, setPagination, setData }: IThingsListPaginationProps) => {
  useEffect(() => {
    getLinks();
  }, [data]);

  const getLinks = () => {
    const noOfLinks = thingList.length;
    const noOfPages = Math.ceil(noOfLinks / itemsPerPage);
    const links = [];
    links.push({ label: "&laquo; Previous", active: false, url: null, page: pagination.page === 1 ? null : pagination.page - 1 });
    for (let i = 1; i <= noOfPages; i++) {
      links.push({ label: i.toString(), active: false, url: null, page: i });
    }
    links.push({ label: "Next &raquo;", active: false, url: null, page: pagination.page === noOfPages ? null : pagination.page + 1 });
    setPagination({
      ...pagination,
      links,
    });
  };

  const getUpdatedThingList = async (currentPage: number, itemsPerPage: number) => {
    const filterChannel = {
      limit: 10,
      offset: 0,
      name: "",
      metadata: "",
      status: "enabled",
    };
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = currentPage * itemsPerPage;
    const things = thingList.filter((_: any, index: any) => index >= startIndex && index < endIndex);

    const updatedThings = await Promise.all(
      things.map(async (thing: any) => {
        try {
          const channel = await getThingChannelList(thing.id, filterChannel);
          const historyData = await Promise.all(
            channel.groups.map(async (group: any) => {
              try {
                const filterHistory = {
                  offset: 0,
                  limit: 10,
                  name: "",
                  publisher: thing.id,
                  status: "enabled",
                };
                const history = await getHistoryList(group.id, filterHistory);
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
    return updatedThings;
  };

  const onChangePageSize = (e: any) => {
    setItemsPerPage(e.target.value);
    setCurrentPage(1);
    setPagination({ ...pagination, page: 1, items_per_page: e.target.value });
  };

  const updateState = async (state: any) => {
    setPagination({
      ...pagination,
      page: state.page,
      items_per_page: state.items_per_page,
    });
    setCurrentPage(state.page);
    setItemsPerPage(state.items_per_page);
    const historyData = await getUpdatedThingList(state.page, state.items_per_page);
    setData(historyData);
  };

  const updatePage = async (page: number | undefined | null) => {
    if (!page || pagination.page === page) {
      return;
    }
    await updateState({ page, items_per_page: itemsPerPage });
  };

  const PAGINATION_PAGES_COUNT = 10;
  const sliceLinks = (pagination?: PaginationState) => {
    if (!pagination?.links?.length) {
      return [];
    }

    const scopedLinks = [...pagination.links];

    let pageLinks: Array<{
      label: string;
      active: boolean;
      url: string | null;
      page: number | null;
    }> = [];
    const previousLink: { label: string; active: boolean; url: string | null; page: number | null } = scopedLinks.shift()!;
    const nextLink: { label: string; active: boolean; url: string | null; page: number | null } = scopedLinks.pop()!;

    const halfOfPagesCount = Math.floor(PAGINATION_PAGES_COUNT / 2);

    pageLinks.push(previousLink);

    if (pagination.page <= Math.round(PAGINATION_PAGES_COUNT / 2) || scopedLinks.length <= PAGINATION_PAGES_COUNT) {
      pageLinks = [...pageLinks, ...scopedLinks.slice(0, PAGINATION_PAGES_COUNT)];
    }

    if (pagination.page > scopedLinks.length - halfOfPagesCount && scopedLinks.length > PAGINATION_PAGES_COUNT) {
      pageLinks = [...pageLinks, ...scopedLinks.slice(scopedLinks.length - PAGINATION_PAGES_COUNT, scopedLinks.length)];
    }

    if (
      !(pagination.page <= Math.round(PAGINATION_PAGES_COUNT / 2) || scopedLinks.length <= PAGINATION_PAGES_COUNT) &&
      !(pagination.page > scopedLinks.length - halfOfPagesCount)
    ) {
      pageLinks = [...pageLinks, ...scopedLinks.slice(pagination.page - 1 - halfOfPagesCount, pagination.page + halfOfPagesCount)];
    }

    pageLinks.push(nextLink);

    return pageLinks;
  };

  const paginationLinks = useMemo(() => sliceLinks(pagination), [pagination]);

  return (
    <div className="row">
      <div className="col-sm-12 col-md-4 d-flex align-items-center justify-content-center justify-content-md-start">
        <select className="form-select form-select-solid w-90px ps-8 me-2" onChange={onChangePageSize}>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="30">30</option>
          <option value="40">40</option>
          <option value="50">50</option>
        </select>
        <div id="kt_table_things_info" className="dataTables_info">
          Total {thingList.length || 0} devices
        </div>
      </div>
      <div className="col-sm-12 col-md-8 d-flex align-items-center justify-content-center justify-content-md-end">
        <div id="kt_table_things_paginate">
          <ul className="pagination">
            <li
              className={clsx("page-item", {
                disabled: pagination.page === 1,
              })}
            >
              <a onClick={async () => await updatePage(1)} style={{ cursor: "pointer" }} className="page-link">
                First
              </a>
            </li>
            {paginationLinks
              ?.map((link) => {
                return { ...link, label: mappedLabel(link.label) };
              })
              .map((link) => (
                <li
                  key={link.label}
                  className={clsx("page-item", {
                    active: pagination.page === link.page,
                    previous: link.label === "Previous",
                    next: link.label === "Next",
                  })}
                >
                  <a
                    className={clsx("page-link", {
                      "page-text": link.label === "Previous" || link.label === "Next",
                      "me-5": link.label === "Previous",
                    })}
                    onClick={async () => await updatePage(link.page)}
                    style={{ cursor: "pointer" }}
                  >
                    {mappedLabel(link.label)}
                  </a>
                </li>
              ))}
            <li
              className={clsx("page-item", {
                disabled: pagination.page === (pagination.links?.length || 3) - 2,
              })}
            >
              <a onClick={async () => await updatePage((pagination.links?.length || 3) - 2)} style={{ cursor: "pointer" }} className="page-link">
                Last
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export { ThingsListPagination };
