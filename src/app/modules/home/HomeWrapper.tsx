import { useIntl } from "react-intl";
import { PageTitle } from "../../../_metronic/layout/core";
import { HomePage } from "./HomePage";

const HomeWrapper = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({ id: "MENU.HOME" })}</PageTitle>
      <HomePage />
    </>
  );
};

export default HomeWrapper;
