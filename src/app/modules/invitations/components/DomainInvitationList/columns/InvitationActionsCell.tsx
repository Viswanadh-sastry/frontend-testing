import { useQuery } from "@tanstack/react-query";
import { FC } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { deleteInvitation, getInvitationList } from "../../../api/InvitationAPI";

type Props = {
  userId: string;
  domainId: string;
};

const InvitationActionsCell: FC<Props> = ({ userId, domainId }) => {
  const filterInvitation = {
    limit: 10,
    offset: 0,
    invited_by: "",
    domain_id: domainId,
    user_id: "",
    relation: "",
    state: "pending",
  };
  const invitationListQuery = useQuery({
    queryKey: [`invitationList`, filterInvitation],
    queryFn: async () => getInvitationList(filterInvitation).catch((error) => toast.error(error?.response?.data?.error || "Something went wrong")),
    enabled: false,
  });

  const openDeleteInvitationPage = () => {
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
        deleteInvitation(userId, domainId)
          .then(() => {
            toast.success("Invitation deleted successfully");
            invitationListQuery.refetch();
          })
          .catch((error) => toast.error(error?.response?.data?.error || "Something went wrong"));
      }
    });
  };

  return (
    <>
      <button type="button" className="btn btn-light btn-danger btn-sm" onClick={openDeleteInvitationPage}>
        Delete
      </button>
    </>
  );
};

export { InvitationActionsCell };
