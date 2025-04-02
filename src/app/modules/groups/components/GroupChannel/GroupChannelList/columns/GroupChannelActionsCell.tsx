import { useQuery } from "@tanstack/react-query";
import { FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { getGroupChannelList, unassignGroupChannel } from "../../../../api/GroupChannelAPI";

type Props = {
  id: string | undefined;
};

const GroupChannelActionsCell: FC<Props> = ({ id }) => {
  const navigate = useNavigate();
  const params = useParams();
  const groupId = params.id as string;
  const filterGroupChannel = {
    offset: 0,
    limit: 10,
    name: "",
    metadata: "",
    parentID: "",
    status: "enabled",
  };
  const groupListQuery = useQuery({
    queryKey: [`groupChannelList`, filterGroupChannel],
    queryFn: async () => getGroupChannelList(id, filterGroupChannel).catch((error) => toast.error(error?.response?.data?.message || "Something went wrong")),
    enabled: false,
  });

  const openChannelPage = () => {
    navigate(`/channels/${id}`);
  };

  const unAssignGroupChannelData = () => {
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
        unassignGroupChannel(groupId, data)
          .then(() => {
            toast.success("Channel unassigned successfully");
            groupListQuery.refetch();
          })
          .catch((error) => toast.error(error?.response?.data?.message || "Something went wrong"));
      }
    });
  };

  return (
    <>
      <button type="button" className="btn btn-light btn-active-light-primary btn-sm mx-2" onClick={openChannelPage}>
        View
      </button>
      <button type="button" className="btn btn-light btn-danger btn-sm" onClick={unAssignGroupChannelData}>
        Delete
      </button>
    </>
  );
};

export { GroupChannelActionsCell };
