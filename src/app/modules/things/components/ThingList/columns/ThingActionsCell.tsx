import { FC } from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  id: string | undefined;
};

const ThingActionsCell: FC<Props> = ({ id }) => {
  const navigate = useNavigate();

  const openEditThingPage = () => {
    navigate(`/things/${id}`);
  };

  return (
    <>
      <button type="button" className="btn btn-light btn-light-primary btn-sm" onClick={openEditThingPage}>
        View
      </button>
    </>
  );
};

export { ThingActionsCell };
