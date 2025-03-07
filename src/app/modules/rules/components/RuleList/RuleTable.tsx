import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { ColumnInstance, Row, useTable } from "react-table";
import { KTCard, KTCardBody, PaginationState } from "../../../../../_metronic/helpers";
import { getRuleList } from "../../api/RuleAPI";
import { Rule } from "../../api/_models";
import { AddRule } from "../AddEditRule/AddRule";
import { RuleListHeader } from "./RuleListHeader";
import { CustomHeaderColumn } from "./columns/CustomHeaderColumn";
import { CustomRow } from "./columns/CustomRow";
import { rulesColumns } from "./columns/_columns";
import { RuleListLoading } from "./pagination/RuleListLoading";
import { RuleListPagination } from "./pagination/RuleListPagination";

const RuleTable = () => {
  const [showAddRule, setShowAddRule] = useState(false);
  const [data, setData] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<any>(10);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    items_per_page: 10,
    links: [],
  });
  const [ruleList, setRuleList] = useState<any>([]);
  const ruleListQuery = useQuery({
    queryKey: [`ruleList`],
    queryFn: async () => getRuleList(),
    enabled: true,
  });

  const isLoading = ruleListQuery.isLoading;

  useEffect(() => {
    if (ruleListQuery.data) {
      setRuleList(ruleListQuery.data || []);
    }
  }, [ruleListQuery.data]);
  useEffect(() => {
    setData(
      ruleList.filter((_: any, index: number) => {
        return index >= (currentPage - 1) * itemsPerPage && index < currentPage * itemsPerPage;
      })
    );
  }, [ruleList, currentPage, itemsPerPage]);

  const columns = useMemo(() => rulesColumns, []);
  const { getTableProps, getTableBodyProps, headers, rows, prepareRow } = useTable({
    columns,
    data,
  });

  const onShowAddRule = () => {
    setShowAddRule(true);
  };

  const onCloseAddRule = () => {
    setShowAddRule(false);
  };

  const onGetRuleList = () => {
    ruleListQuery.refetch();
  };

  return (
    <KTCard>
      <RuleListHeader onShowAddRule={onShowAddRule} setCurrentPage={setCurrentPage} setPagination={setPagination} ruleListQuery={ruleListQuery} pagination={pagination} />
      <KTCardBody className="py-4">
        <div className="table-responsive">
          <table id="kt_table_rules" className="table align-middle table-row-dashed fs-6 dataTable no-footer" {...getTableProps()}>
            <thead>
              <tr className="text-start text-muted fw-bolder fs-7 text-uppercase gs-0">
                {headers.map((column: ColumnInstance<Rule>) => (
                  <CustomHeaderColumn key={column.id} column={column} />
                ))}
              </tr>
            </thead>
            <tbody className="text-gray-600" {...getTableBodyProps()}>
              {rows.length > 0 ? (
                rows.map((row: Row<Rule>, i) => {
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
        <RuleListPagination
          ruleList={ruleList}
          itemsPerPage={itemsPerPage}
          pagination={pagination}
          data={data}
          setCurrentPage={setCurrentPage}
          setItemsPerPage={setItemsPerPage}
          setPagination={setPagination}
          setData={setData}
        />
        {showAddRule && <AddRule onCloseAddRule={onCloseAddRule} onGetRuleList={onGetRuleList} />}
        {isLoading && <RuleListLoading />}
      </KTCardBody>
    </KTCard>
  );
};

export { RuleTable };
