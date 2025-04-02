import { useQuery } from "@tanstack/react-query";
import { FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { getChannelUserList, unAssignChannelUser } from "../../../../api/ChannelUserAPI";
import * as roleHelper from "../../../../../auth/core/RoleHelpers";

type Props = {
  id: string | undefined;
  relation: string | undefined;
};

const UserActionsCell: FC<Props> = ({ id, relation }) => {
  const params = useParams();
  const channelId = params.id as string;
  const role = roleHelper.getRole();
  const navigate = useNavigate();
  const filterUser = {
    limit: 10,
    offset: 0,
    name: "",
    metadata: "",
    permission: relation,
    status: "enabled",
  };
  const userListQuery = useQuery({
    queryKey: [`userList`, filterUser],
    queryFn: async () =>
      getChannelUserList(channelId, filterUser)
        .then(async (response) => {
          const users = await Promise.all(
            response.users.map(async (user: any) => ({
              ...user,
              relation: filterUser.permission,
            }))
          );
          return { ...response, users };
        })
        .catch((error) => toast.error(error?.response?.data?.message || "Something went wrong")),
    enabled: false,
  });

  const displayUserData = () => {
    navigate(`/channels/${id}/view`);
  };

  const unAssignChannelUserData = () => {
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
        const data = {
          user_ids: [id],
          relation,
        };
        unAssignChannelUser(channelId, data)
          .then(() => {
            toast.success("Member deleted successfully");
            userListQuery.refetch();
          })
          .catch((error) => toast.error(error?.response?.data?.message || "Something went wrong"));
      }
    });
  };

  return (
    <>
      <button type="button" className="btn btn-light btn-active-light-primary btn-sm mx-2" onClick={displayUserData}>
        View
      </button>
      {role !== "viewer" && (
        <button type="button" className="btn btn-light btn-danger btn-sm" onClick={unAssignChannelUserData}>
          Delete
        </button>
      )}
    </>
  );
};

export { UserActionsCell };
