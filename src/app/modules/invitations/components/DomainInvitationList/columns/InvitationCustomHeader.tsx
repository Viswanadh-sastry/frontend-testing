import { FC, PropsWithChildren } from "react";
import { HeaderProps } from "react-table";
// import { initialQueryState } from "../../../../../_metronic/helpers";
// import { useQueryRequest } from "../../core/QueryRequestProvider";
import { Invitation } from "../../../api/_models";

type Props = {
  className?: string;
  title?: string;
  tableProps: PropsWithChildren<HeaderProps<Invitation>>;
};
const InvitationCustomHeader: FC<Props> = ({ className, title, tableProps }) => {
  // const id = tableProps.column.id;
  // const { state, updateState } = useQueryRequest();

  // const isSelectedForSorting = useMemo(() => {
  //   return state.sort && state.sort === id;
  // }, [state, id]);
  // const order: "asc" | "desc" | undefined = useMemo(() => state.order, [state]);

  // const sortColumn = () => {
  //   // avoid sorting for these columns
  //   if (id === "actions" || id === "selection") {
  //     return;
  //   }

  //   if (!isSelectedForSorting) {
  //     // enable sort asc
  //     updateState({ sort: id, order: "asc", ...initialQueryState });
  //     return;
  //   }

  //   if (isSelectedForSorting && order !== undefined) {
  //     if (order === "asc") {
  //       // enable sort desc
  //       updateState({ sort: id, order: "desc", ...initialQueryState });
  //       return;
  //     }

  //     // disable sort
  //     updateState({ sort: undefined, order: undefined, ...initialQueryState });
  //   }
  // };

  return (
    <th
      {...tableProps.column.getHeaderProps()}
      className={className}
      key={tableProps.column.id}
      // className={clsx(className, isSelectedForSorting && order !== undefined && `table-sort-${order}`)}
      // className="cursor-pointer"
      // onClick={sortColumn}
    >
      {title}
    </th>
  );
};

export { InvitationCustomHeader };
