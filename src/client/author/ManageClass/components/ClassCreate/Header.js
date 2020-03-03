import { MainHeader , EduButton } from "@edulastic/common";
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
        <EduButton isGhost data-cy="cancel">Cancel</EduButton>
      </Link>
      <EduButton data-cy="saveClass" htmlType="submit">Save Class</EduButton>
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
