import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { PaginationState } from "../../../../../../../_metronic/helpers";
import { getGroupUsersList } from "../../../../api/GroupUserAPI";

const mappedLabel = (label: string): string => {
  if (label === "&laquo; Previous") {
    return "Previous";
  }

  if (label === "Next &raquo;") {
    return "Next";
  }

  return label;
};

interface IUserListPaginationProps {
  filterUser: any;
  setFilterUser: Dispatch<
    SetStateAction<{
      limit: number;
      offset: number;
      name: string;
      metadata: string;
      permission: string;
      status: string;
    }>
  >;
}

const UserListPagination = ({ filterUser, setFilterUser }: IUserListPaginationProps) => {
  const params = useParams();
  const id = params.id as string;
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    items_per_page: filterUser.limit,
    links: [],
  });
  const userListQuery = useQuery({
    queryKey: [`userList`, filterUser],
    queryFn: async () => getGroupUsersList(id, filterUser).catch((error) => toast.error(error?.response?.data?.error || "Something went wrong")),
    enabled: false,
  });
  const isLoading = userListQuery.isLoading;

  useEffect(() => {
    if (userListQuery.data) {
      const noOfLinks = userListQuery.data.total;
      const noOfPages = Math.ceil(noOfLinks / userListQuery.data.limit);
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
    }
  }, [userListQuery.data]);

  const onChangePageSize = (e: any) => {
    setFilterUser((prevState: any) => ({
      ...prevState,
      limit: parseInt(e.target.value),
      offset: 0,
    }));
  };

  const updateState = (state: any) => {
    setPagination({
      ...pagination,
      page: state.page,
      items_per_page: state.items_per_page,
    });
    setFilterUser((prevState: any) => ({
      ...prevState,
      offset: state.items_per_page * (state.page - 1),
      limit: state.items_per_page,
    }));
  };

  const updatePage = (page: number | undefined | null) => {
    if (!page || isLoading || pagination.page === page) {
      return;
    }
    updateState({ page, items_per_page: filterUser.limit });
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
      <div className="col-sm-12 col-md-5 d-flex align-items-center justify-content-center justify-content-md-start">
        <select className="form-select form-select-solid w-90px ps-8 me-2" onChange={onChangePageSize}>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="30">30</option>
          <option value="40">40</option>
          <option value="50">50</option>
        </select>
        <div id="kt_table_users_info" className="dataTables_info">
          {isLoading ? "Loading..." : `Total ${userListQuery.data?.total || 0} members`}
        </div>
      </div>
      <div className="col-sm-12 col-md-7 d-flex align-items-center justify-content-center justify-content-md-end">
        <div id="kt_table_users_paginate">
          <ul className="pagination">
            <li
              className={clsx("page-item", {
                disabled: isLoading || pagination.page === 1,
              })}
            >
              <a onClick={() => updatePage(1)} style={{ cursor: "pointer" }} className="page-link">
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
                    disabled: isLoading,
                    previous: link.label === "Previous",
                    next: link.label === "Next",
                  })}
                >
                  <a
                    className={clsx("page-link", {
                      "page-text": link.label === "Previous" || link.label === "Next",
                      "me-5": link.label === "Previous",
                    })}
                    onClick={() => updatePage(link.page)}
                    style={{ cursor: "pointer" }}
                  >
                    {mappedLabel(link.label)}
                  </a>
                </li>
              ))}
            <li
              className={clsx("page-item", {
                disabled: isLoading || pagination.page === (pagination.links?.length || 3) - 2,
              })}
            >
              <a onClick={() => updatePage((pagination.links?.length || 3) - 2)} style={{ cursor: "pointer" }} className="page-link">
                Last
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export { UserListPagination };
