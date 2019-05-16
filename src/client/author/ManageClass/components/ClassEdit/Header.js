import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { white } from "@edulastic/colors";
// components
import { Title, IconManageClass, SaveClassBtn, CancelClassBtn, ButtonsWrapper } from "./styled";
import HeaderWrapper from "../../../src/mainContent/headerWrapper";
// ducks
import { fetchClassListAction } from "../../ducks";

const Header = ({ onCancel }) => (
  <HeaderWrapper>
    <Title>
      <IconManageClass color={white} width={20} height={20} /> <span>Manage Class</span>
    </Title>
    <ButtonsWrapper>
      <CancelClassBtn onClick={onCancel}>Cancel</CancelClassBtn>
      <SaveClassBtn htmlType="submit">Update Class</SaveClassBtn>
    </ButtonsWrapper>
  </HeaderWrapper>
);

Header.propTypes = {
  onCancel: PropTypes.func
};

Header.defaultProps = {
  onCancel: () => null
};

export default connect(
  null,
  { fetchClassList: fetchClassListAction }
)(Header);
