import { MainHeader } from "@edulastic/common";
import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
// ducks
import { fetchClassListAction } from "../../ducks";
// components
import { ButtonsWrapper, CancelClassBtn, IconManageClass, SaveClassBtn } from "./styled";

const Header = ({ classId }) => (
  <MainHeader Icon={IconManageClass} headingText="common.manageClassTitle">
    <ButtonsWrapper>
      <Link to={`/author/manageClass/${classId}`}>
        <CancelClassBtn data-cy="cancel">Cancel</CancelClassBtn>
      </Link>
      <SaveClassBtn data-cy="updateClass" htmlType="submit">
        Update Class
      </SaveClassBtn>
    </ButtonsWrapper>
  </MainHeader>
);

export default connect(
  null,
  { fetchClassList: fetchClassListAction }
)(Header);
