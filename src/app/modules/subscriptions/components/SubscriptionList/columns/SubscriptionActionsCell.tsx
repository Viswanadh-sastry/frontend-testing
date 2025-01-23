import { FC, useState } from "react";
import { EditSubscription } from "../../AddEditSubscription/EditSubscription";

type Props = {
  row: any;
};

const SubscriptionActionsCell: FC<Props> = ({ row }) => {
  const [showEditSubscription, setShowEditSubscription] = useState(false);

  const openEditSubscriptionPage = () => {
    setShowEditSubscription(true);
  };

  const onCloseEditSubscription = () => {
    setShowEditSubscription(false);
  };

  return (
    <>
      <button type="button" className="btn btn-light btn-light-primary btn-sm" onClick={openEditSubscriptionPage}>
        Edit
      </button>
      {showEditSubscription && <EditSubscription row={row} onCloseEditSubscription={onCloseEditSubscription} />}
    </>
  );
};

export { SubscriptionActionsCell };
