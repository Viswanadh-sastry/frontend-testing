import { FC } from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  id: string | undefined;
};

const StreamActionsCell: FC<Props> = ({ id }) => {
  const navigate = useNavigate();

  const openEditStreamPage = () => {
    navigate(`/stream/${id}`);
  };

  return (
    <>
      <button type="button" className="btn btn-light btn-light-primary btn-sm" onClick={openEditStreamPage}>
        View
      </button>
    </>
  );
};

export { StreamActionsCell };
