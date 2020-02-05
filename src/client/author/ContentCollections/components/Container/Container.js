import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { get } from "lodash";

import { MainWrapper, StyledContent, StyledLayout } from "../../../../admin/Common/StyledComponents";
import AdminHeader from "../../../src/components/common/AdminHeader/AdminHeader";
import Collections from "../Collections/Collections";

const title = "Manage District";
const menuActive = { mainMenu: "Content", subMenu: "Collections" };

export const Container = ({ history, routeKey }) => {
  return (
    <MainWrapper key={routeKey}>
      <AdminHeader title={title} active={menuActive} history={history} />
      <StyledContent>
        <StyledLayout>
          <Collections history={history} />
        </StyledLayout>
      </StyledContent>
    </MainWrapper>
  );
};

const enhance = compose(
  connect(state => ({
    routeKey: get(state, ["router", "location", "key"])
  }))
);

export default enhance(Container);
