import React from "react";

import { MainWrapper, StyledContent, StyledLayout } from "../../../../admin/Common/StyledComponents";
import AdminHeader from "../../../src/components/common/AdminHeader/AdminHeader";

import ExternalTools from "../ExternalTools/ExternalTools";

const title = "Manage District";
const menuActive = { mainMenu: "Content", subMenu: "ExternalTools" };

const Container = ({ history, routeKey }) => {
  return (
    <MainWrapper key={routeKey}>
      <AdminHeader title={title} active={menuActive} history={history} />
      <StyledContent>
        <StyledLayout>
          <ExternalTools history={history} />
        </StyledLayout>
      </StyledContent>
    </MainWrapper>
  );
};

export default Container;
