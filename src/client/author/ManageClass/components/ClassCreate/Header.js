import { MainHeader } from "@edulastic/common";
import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { compose } from "redux";
// ducks
import { fetchClassListAction } from "../../ducks";
// components
import { ButtonsWrapper, CancelClassBtn, IconManageClass, SaveClassBtn } from "./styled";

const Header = () => (
  <MainHeader Icon={IconManageClass} headingText="common.manageClassTitle">
    <ButtonsWrapper>
      <Link to="/author/manageClass">
        <CancelClassBtn data-cy="cancel">Cancel</CancelClassBtn>
      </Link>
      <SaveClassBtn data-cy="saveClass" htmlType="submit">
        Save Class
      </SaveClassBtn>
    </ButtonsWrapper>
  </MainHeader>
);

const enhance = compose(
  connect(
    null,
    { fetchClassList: fetchClassListAction }
  )
);
export default enhance(Header);
