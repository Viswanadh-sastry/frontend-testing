import { FC, PropsWithChildren } from "react";
import { HeaderProps } from "react-table";
import { Gateway } from "../../../api/_models";

type Props = {
  className?: string;
  title?: string;
  tableProps: PropsWithChildren<HeaderProps<Gateway>>;
};

const GatewayCustomHeader: FC<Props> = ({ className, title, tableProps }) => {
  return (
    <th {...tableProps.column.getHeaderProps()} className={className} key={tableProps.column.id}>
      {title}
    </th>
  );
};

export { GatewayCustomHeader };
