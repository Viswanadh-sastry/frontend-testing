import { useQuery } from "@tanstack/react-query";
import { FC, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { deleteStream, getStreamList } from "../../../api/StreamAPI";
import { EditStream } from "../../AddEditStream/EditStream";

type Props = {
  row: any;
};

const StreamActionsCell: FC<Props> = ({ row }) => {
  const [showEditStream, setShowEditStream] = useState(false);
  const streamListQuery = useQuery({
    queryKey: [`streamList`],
    queryFn: async () => getStreamList(),
    enabled: true,
  });

  const openEditStreamPage = () => {
    setShowEditStream(true);
  };

  const onCloseEditStream = () => {
    setShowEditStream(false);
  };

  const openDeleteStreamPage = () => {
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
        deleteStream(row.original.name)
          .then(() => {
            toast.success("Stream deleted successfully");
            streamListQuery.refetch();
          })
          .catch((error) => toast.error(error.message));
      }
    });
  };

  return (
    <>
      <button type="button" className="btn btn-light btn-light-primary btn-sm me-2" onClick={openEditStreamPage}>
        Edit
      </button>
      <button type="button" className="btn btn-light btn-danger btn-sm" onClick={openDeleteStreamPage}>
        Delete
      </button>
      {showEditStream && <EditStream row={row} onCloseEditStream={onCloseEditStream} />}
    </>
  );
};

export { StreamActionsCell };
