import { useQuery } from "@tanstack/react-query";
import { FC } from "react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { deleteInvitation, acceptInvitation, getInvitationList } from "../../../api/InvitationAPI";
import { getUser } from "../../../../auth/core/AuthHelpers";

type Props = {
  userId: string;
  domainId: string;
};

const InvitationActionsCell: FC<Props> = ({ userId, domainId }) => {
  const { id } = getUser();
  const filterInvitation = {
    limit: 10,
    offset: 0,
    invited_by: "",
    domain_id: "",
    user_id: "",
    relation: "",
    state: "pending",
  };
  const invitationListQuery = useQuery({
    queryKey: [`invitationList`, filterInvitation],
    queryFn: async () => getInvitationList(filterInvitation).catch((error) => toast.error(error?.response?.data?.message || "Something went wrong")),
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
          .catch((error) => toast.error(error?.response?.data?.message || "Something went wrong"));
      }
    });
  };

  const openAcceptInvitationPage = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Are you sure you want to accept this invitation?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, accept it!",
      cancelButtonText: "Cancel",
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-secondary",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        acceptInvitation({ domain_id: domainId })
          .then(() => {
            toast.success("Invitation accepted successfully");
            invitationListQuery.refetch();
          })
          .catch((error) => toast.error(error?.response?.data?.message || "Something went wrong"));
      }
    });
  };

  return (
    <>
      {userId === id && (
        <button type="button" className="btn btn-light btn-success btn-sm me-2" onClick={openAcceptInvitationPage}>
          Accept
        </button>
      )}
      <button type="button" className="btn btn-light btn-danger btn-sm" onClick={openDeleteInvitationPage}>
        Delete
      </button>
    </>
  );
};

export { InvitationActionsCell };
