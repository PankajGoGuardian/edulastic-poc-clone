import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { white } from "@edulastic/colors";
// components
import { Title, IconManageClass, EditButton, ButtonsWrapper } from "./styled";
import HeaderWrapper from "../../../src/mainContent/headerWrapper";
// ducks
import { fetchClassListAction } from "../../ducks";

const Header = ({ onEdit }) => (
  <HeaderWrapper>
    <Title>
      <IconManageClass color={white} width={20} height={20} />
      Manage Class / <span>Class Name</span>
    </Title>
    <ButtonsWrapper>
      <EditButton onClick={onEdit}>Edit Class</EditButton>
    </ButtonsWrapper>
  </HeaderWrapper>
);

Header.propTypes = {
  onEdit: PropTypes.func
};

Header.defaultProps = {
  onEdit: () => null
};

export default connect(
  null,
  { fetchClassList: fetchClassListAction }
)(Header);
