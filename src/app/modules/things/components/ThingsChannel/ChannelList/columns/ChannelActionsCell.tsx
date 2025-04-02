import { useQuery } from "@tanstack/react-query";
import { FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import * as roleHelper from "../../../../../auth/core/RoleHelpers";
import { disconnectThingChannel, getThingChannelList } from "../../../../api/ThingChannelAPI";

type Props = {
  id: string | undefined;
};

const ChannelActionsCell: FC<Props> = ({ id }) => {
  const params = useParams();
  const thingId = params.id as string;
  const role = roleHelper.getRole();
  const navigate = useNavigate();
  const filterChannel = {
    limit: 10,
    offset: 0,
    name: "",
    metadata: "",
    status: "enabled",
  };
  const channelListQuery = useQuery({
    queryKey: [`channelThingList`, filterChannel],
    queryFn: async () => getThingChannelList(thingId, filterChannel).catch((error) => toast.error(error?.response?.data?.message || "Something went wrong")),
    enabled: false,
  });

  const openChannelPage = () => {
    navigate(`/channels/${id}`);
  };

  const disconnectThingChannelData = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Are you sure you want to disconnect this record?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, disconnect it!",
      cancelButtonText: "Cancel",
      customClass: {
        confirmButton: "btn btn-danger",
        cancelButton: "btn btn-secondary",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        disconnectThingChannel(thingId, id)
          .then(() => {
            toast.success("Channel disconnected successfully");
            channelListQuery.refetch();
          })
          .catch((error) => toast.error(error?.response?.data?.message || "Something went wrong"));
      }
    });
  };

  return (
    <>
      <button type="button" className="btn btn-light btn-light-primary btn-sm mx-2" onClick={openChannelPage}>
        View
      </button>
      {role !== "viewer" && (
        <button type="button" className="btn btn-light btn-danger btn-sm" onClick={disconnectThingChannelData}>
          Delete
        </button>
      )}
    </>
  );
};

export { ChannelActionsCell };
