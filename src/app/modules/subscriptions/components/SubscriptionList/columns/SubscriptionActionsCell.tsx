import { useQuery } from "@tanstack/react-query";
import { FC, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { deleteSubscription, getSubscriptionList } from "../../../api/SubscriptionAPI";
import { EditSubscription } from "../../AddEditSubscription/EditSubscription";

type Props = {
  row: any;
};

const SubscriptionActionsCell: FC<Props> = ({ row }) => {
  const [showEditSubscription, setShowEditSubscription] = useState(false);
  const filterSubscription = {
    limit: 10,
    offset: 0,
  };
  const subscriptionListQuery = useQuery({
    queryKey: [`subscriptionList`, filterSubscription],
    queryFn: async () => getSubscriptionList(filterSubscription).catch((error) => toast.error(error?.response?.data?.message || "Something went wrong")),
    enabled: false,
  });

  const openEditSubscriptionPage = () => {
    setShowEditSubscription(true);
  };

  const onCloseEditSubscription = () => {
    setShowEditSubscription(false);
  };

  const openDeleteSubscriptionPage = () => {
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
        deleteSubscription(row.original.name)
          .then(() => {
            toast.success("Subscription deleted successfully");
            subscriptionListQuery.refetch();
          })
          .catch((error) => toast.error(error?.response?.data?.message || "Something went wrong"));
      }
    });
  };

  return (
    <>
      <button type="button" className="btn btn-light btn-light-primary btn-sm me-2" onClick={openEditSubscriptionPage}>
        Edit
      </button>
      <button type="button" className="btn btn-light btn-danger btn-sm" onClick={openDeleteSubscriptionPage}>
        Delete
      </button>
      {showEditSubscription && <EditSubscription row={row} onCloseEditSubscription={onCloseEditSubscription} />}
    </>
  );
};

export { SubscriptionActionsCell };
