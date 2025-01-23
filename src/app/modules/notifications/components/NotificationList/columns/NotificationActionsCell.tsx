import { FC } from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  id: string | undefined;
};

const NotificationActionsCell: FC<Props> = ({ id }) => {
  const navigate = useNavigate();

  const openEditNotificationPage = () => {
    navigate(`/notification/edit/${id}`);
  };

  return (
    <>
      <button type="button" className="btn btn-light btn-light-primary btn-sm" onClick={openEditNotificationPage}>
        View
      </button>
    </>
  );
};

export { NotificationActionsCell };
