import { FC } from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  id: string | undefined;
};

const RuleActionsCell: FC<Props> = ({ id }) => {
  const navigate = useNavigate();

  const openEditRulePage = () => {
    navigate(`/rule/${id}`);
  };

  return (
    <>
      <button type="button" className="btn btn-light btn-light-primary btn-sm" onClick={openEditRulePage}>
        View
      </button>
    </>
  );
};

export { RuleActionsCell };
