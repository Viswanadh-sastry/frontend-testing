import "jspdf-autotable";
import { Dispatch, SetStateAction } from "react";
import { KTIcon } from "../../../../../_metronic/helpers";

interface IRuleListHeaderProps {
  onShowAddRule: () => void;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  setPagination: Dispatch<SetStateAction<any>>;
  ruleListQuery: any;
  pagination: any;
}

const RuleListHeader = ({ onShowAddRule, setCurrentPage, setPagination, ruleListQuery, pagination }: IRuleListHeaderProps) => {
  const onClickRefresh = () => {
    ruleListQuery.refetch();
    setCurrentPage(1);
    setPagination({ ...pagination, page: 1 });
  };

  return (
    <>
      <div className="card-header border-0 pt-6">
        <div className="card-title"></div>

        <div className="card-toolbar">
          <div className="d-flex justify-content-end" data-kt-rule-table-toolbar="base">
            <button type="button" className="btn btn-primary" onClick={onShowAddRule}>
              <KTIcon iconName="plus" className="fs-2" />
              Add Rule
            </button>
            <button type="button" className="btn btn-light-primary me-2 mx-2" onClick={onClickRefresh}>
              <KTIcon iconName="arrows-circle" className="fs-2" />
              Refresh
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export { RuleListHeader };
