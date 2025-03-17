import { useQuery } from "@tanstack/react-query";
import { FC } from "react";
import { disconnectChannelThing, getChannelThingList } from "../../../../api/ChannelThingAPI";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";

type Props = {
  id: string | undefined;
};

const ThingActionsCell: FC<Props> = ({ id }) => {
  const params = useParams();
  const channelID = params.id as string;
  const filterThing = {
    limit: 10,
    offset: 0,
    name: "",
    metadata: "",
    tags: "",
    status: "enabled",
  };
  const thingListQuery = useQuery({
    queryKey: [`thingList`, filterThing],
    queryFn: async () => getChannelThingList(channelID, filterThing).catch((error) => toast.error(error?.response?.data?.error || "Something went wrong")),
    enabled: false,
  });

  const disconnectChannelThingData = () => {
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
        disconnectChannelThing(channelID, id)
          .then(() => {
            toast.success("Device disconnected successfully");
            thingListQuery.refetch();
          })
          .catch((error) => toast.error(error?.response?.data?.error || "Something went wrong"));
      }
    });
  };

  return (
    <>
      <button type="button" className="btn btn-light btn-danger btn-sm" onClick={disconnectChannelThingData}>
        Delete
      </button>
    </>
  );
};

export { ThingActionsCell };
