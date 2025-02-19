import { FC } from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  id: string | undefined;
};

const AssetActionsCell: FC<Props> = ({ id }) => {
  const navigate = useNavigate();

  const openEditGroupPage = () => {
    navigate(`/groups/${id}`);
  };

  return (
    <>
      <button type="button" className="btn btn-light btn-light-primary btn-sm" onClick={openEditGroupPage}>
        View
      </button>
    </>
  );
};

export { AssetActionsCell };
