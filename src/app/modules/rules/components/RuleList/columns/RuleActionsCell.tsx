import { useQuery } from "@tanstack/react-query";
import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { deleteRule, getRuleList, startRule, stopRule } from "../../../api/RuleAPI";

type Props = {
  row: any;
};

const RuleActionsCell: FC<Props> = ({ row }) => {
  const navigate = useNavigate();
  const ruleListQuery = useQuery({
    queryKey: [`ruleList`],
    queryFn: async () => getRuleList(),
    enabled: true,
  });

  const openDeleteRulePage = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Are you sure you want to delete this record?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      customClass: {
        confirmButton: "btn btn-danger",
        cancelButton: "btn btn-secondary",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        deleteRule(row.original.name)
          .then(() => {
            toast.success("Rule deleted successfully");
            ruleListQuery.refetch();
          })
          .catch((error) => toast.error(error?.response?.data?.error || "Something went wrong"));
      }
    });
  };

  const openStartRule = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Are you sure you want to start this rule?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, start it!",
      cancelButtonText: "Cancel",
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-secondary",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        startRule(row.original.name)
          .then(() => {
            toast.success("Rule started successfully");
            ruleListQuery.refetch();
          })
          .catch((error) => toast.error(error?.response?.data?.error || "Something went wrong"));
      }
    });
  };

  const openStopRule = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Are you sure you want to stop this rule?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, stop it!",
      cancelButtonText: "Cancel",
      customClass: {
        confirmButton: "btn btn-danger",
        cancelButton: "btn btn-secondary",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        stopRule(row.original.name)
          .then(() => {
            toast.success("Rule stopped successfully");
            ruleListQuery.refetch();
          })
          .catch((error) => toast.error(error?.response?.data?.error || "Something went wrong"));
      }
    });
  };

  const openEditRulePage = () => {
    navigate(`/rule/${row.original.name}`);
  };

  return (
    <>
      <button type="button" className="btn btn-light btn-light-success btn-sm me-2" onClick={openStartRule}>
        Start
      </button>
      <button type="button" className="btn btn-light btn-light-danger btn-sm me-2" onClick={openStopRule}>
        Stop
      </button>
      <button type="button" className="btn btn-light btn-light-primary btn-sm me-2" onClick={openEditRulePage}>
        Edit
      </button>
      <button type="button" className="btn btn-light btn-danger btn-sm" onClick={openDeleteRulePage}>
        Delete
      </button>
    </>
  );
};

export { RuleActionsCell };
