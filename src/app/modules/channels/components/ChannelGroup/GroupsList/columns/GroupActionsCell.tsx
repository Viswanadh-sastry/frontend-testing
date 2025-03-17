import { useQuery } from "@tanstack/react-query";
import { FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { getChannelGroupList, unassignChannelGroup } from "../../../../api/ChannelGroupAPI";
import * as roleHelper from "../../../../../auth/core/RoleHelpers";

type Props = {
  id: string | undefined;
};

const GroupActionsCell: FC<Props> = ({ id }) => {
  const navigate = useNavigate();
  const params = useParams();
  const channelId = params.id as string;
  const role = roleHelper.getRole();
  const filterGroup = {
    limit: 10,
    offset: 0,
    name: "",
    metadata: "",
    parentID: "",
    status: "enabled",
  };
  const groupListQuery = useQuery({
    queryKey: [`groupList`, filterGroup],
    queryFn: async () => getChannelGroupList(channelId, filterGroup).catch((error) => toast.error(error?.response?.data?.error || "Something went wrong")),
    enabled: false,
  });

  const openEditGroupPage = () => {
    navigate(`/groups/${id}`);
  };

  const unAssignChannelGroupData = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Are you sure you want to unassign this record?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, unassign it!",
      cancelButtonText: "Cancel",
      customClass: {
        confirmButton: "btn btn-danger",
        cancelButton: "btn btn-secondary",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const data = {
          group_ids: [id],
        };
        unassignChannelGroup(channelId, data)
          .then(() => {
            toast.success("Group unassigned successfully");
            groupListQuery.refetch();
          })
          .catch((error) => toast.error(error?.response?.data?.error || "Something went wrong"));
      }
    });
  };

  return (
    <>
      <button type="button" className="btn btn-light btn-light-primary btn-sm mx-2" onClick={openEditGroupPage}>
        View
      </button>
      {role !== "viewer" && (
        <button type="button" className="btn btn-light btn-danger btn-sm" onClick={unAssignChannelGroupData}>
          Delete
        </button>
      )}
    </>
  );
};

export { GroupActionsCell };
