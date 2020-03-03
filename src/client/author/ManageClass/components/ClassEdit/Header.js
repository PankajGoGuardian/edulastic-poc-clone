import { MainHeader } from "@edulastic/common";
import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
// ducks
import { fetchClassListAction } from "../../ducks";
// components
import { ButtonsWrapper, CancelClassBtn, IconManageClass, SaveClassBtn } from "./styled";
import { EduButton } from "@edulastic/common";

const Header = ({ classId }) => (
  <MainHeader Icon={IconManageClass} headingText="common.manageClassTitle">
    <ButtonsWrapper>
      <Link to={`/author/manageClass/${classId}`}>
        <EduButton height="40px" isGhost data-cy="cancel">
          Cancel
        </EduButton>
      </Link>
      <EduButton height="40px" data-cy="updateClass" htmlType="submit">
        Update Class
      </EduButton>
    </ButtonsWrapper>
  </MainHeader>
);

export default connect(
  null,
  { fetchClassList: fetchClassListAction }
)(Header);
