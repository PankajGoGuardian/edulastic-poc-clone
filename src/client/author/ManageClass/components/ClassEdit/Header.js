import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { white } from "@edulastic/colors";
// components
import { Title, IconManageClass, SaveClassBtn, CancelClassBtn, ButtonsWrapper } from "./styled";
import HeaderWrapper from "../../../src/mainContent/headerWrapper";
// ducks
import { fetchClassListAction } from "../../ducks";

const Header = ({ classId }) => (
  <HeaderWrapper>
    <Title>
      <IconManageClass color={white} width={20} height={20} /> <span>Manage Class</span>
    </Title>
    <ButtonsWrapper>
      <Link to={`/author/manageClass/${classId}`}>
        <CancelClassBtn>Cancel</CancelClassBtn>
      </Link>
      <SaveClassBtn htmlType="submit">Update Class</SaveClassBtn>
    </ButtonsWrapper>
  </HeaderWrapper>
);

export default connect(
  null,
  { fetchClassList: fetchClassListAction }
)(Header);
