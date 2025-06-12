import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useTable, ColumnInstance, Row } from "react-table";
import { CustomHeaderColumn } from "./columns/CustomHeaderColumn";
import { CustomRow } from "./columns/CustomRow";
import { usersColumns } from "./columns/_columns";
import { Domain } from "../../api/_models";
import { KTCard, KTCardBody, PaginationState } from "../../../../../_metronic/helpers";
import { DomainListPagination } from "./pagination/DomainListPagination";
import { DomainListLoading } from "./pagination/DomainListLoading";
import { DomainListHeader } from "./DomainListHeader";
import { AddDomain } from "../AddDomain/AddDomain";
import { getDomainListAll } from "../../api/DomainAPI";
import { ImportDomain } from "../AddDomain/ImportDomain/ImportDomain";
import { SortButton } from "../../../../reusable/SortButton/SortButton";

const DomainTable = () => {
  const [showAddDomain, setShowAddDomain] = useState(false);
  const [importModal, setImportModal] = useState(false);
  const [data, setData] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<any>(10);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    items_per_page: 10,
    links: [],
  });
  const [domainList, setDomainList] = useState<any>([]);
  const [filterDomain, setFilterDomain] = useState({
    offset: 0,
    limit: 100,
    name: "",
    permission: "",
    status: "enabled",
    sort_by: "created_at",
  });
  const domainListQuery = useQuery({
    queryKey: [`domainListQuery`, filterDomain],
    queryFn: async () => getDomainListAll(filterDomain).catch((error) => toast.error(error?.response?.data?.message || "Something went wrong")),
    enabled: true,
  });
  const isLoading = domainListQuery.isLoading;
  const columns = useMemo(() => usersColumns, []);
  const { getTableProps, getTableBodyProps, headers, rows, prepareRow } = useTable({
    columns,
    data,
  });

  useEffect(() => {
    if (domainListQuery.data?.domains) {
      setDomainList(domainListQuery.data.domains || []);
    }
  }, [domainListQuery.data?.domains]);
  useEffect(() => {
    setData(
      domainList.filter((_: any, index: number) => {
        return index >= (currentPage - 1) * itemsPerPage && index < currentPage * itemsPerPage;
      })
    );
  }, [domainList, currentPage, itemsPerPage]);

  const onShowAddDomain = () => {
    setShowAddDomain(true);
  };

  const onCloseAddDomain = () => {
    setShowAddDomain(false);
  };

  const onGetDomainList = () => {
    domainListQuery.refetch();
  };

  const onShowImportDomain = () => setImportModal(true);
  const onCloseImportDomain = () => setImportModal(false);

  return (
    <KTCard>
      <DomainListHeader
        onShowAddDomain={onShowAddDomain}
        onShowImportDomain={onShowImportDomain}
        setCurrentPage={setCurrentPage}
        setPagination={setPagination}
        setFilterDomain={setFilterDomain}
        filterDomain={filterDomain}
        setDomainList={setDomainList}
        domainList={domainList}
        domainListQuery={domainListQuery}
        pagination={pagination}
      />
      <KTCardBody className="py-4">
        <div className="table-responsive">
          <table id="kt_table_users" className="table align-middle table-row-dashed fs-6 dataTable no-footer" {...getTableProps()}>
            <thead>
              <tr className="text-start text-muted fw-bolder fs-7 text-uppercase gs-0">
                {headers.map((column: ColumnInstance<Domain>) => (
                  <CustomHeaderColumn key={column.id} column={column} />
                ))}
              </tr>
            </thead>
            <tbody className="text-gray-600" {...getTableBodyProps()}>
              {rows.length > 0 ? (
                rows.map((row: Row<Domain>, i) => {
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
        <DomainListPagination
          domainList={domainList}
          itemsPerPage={itemsPerPage}
          pagination={pagination}
          data={data}
          setCurrentPage={setCurrentPage}
          setItemsPerPage={setItemsPerPage}
          setPagination={setPagination}
          setData={setData}
        />
        {showAddDomain && <AddDomain onCloseAddDomain={onCloseAddDomain} onGetDomainList={onGetDomainList} />}
        {importModal && <ImportDomain onShowImportDomain={importModal} onCloseImportDomain={onCloseImportDomain} onGetDomainList={onGetDomainList} />}
        {isLoading && <DomainListLoading />}
      </KTCardBody>
    </KTCard>
  );
};

export { DomainTable };
