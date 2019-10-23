import React from "react";
import PropTypes from "prop-types";
import { FlexContainer } from "@edulastic/common";
import { Title, MenuIcon } from "./styled";
import HeaderWrapper from "../../../src/mainContent/headerWrapper";

const Header = ({ title, toggleSideBar, renderExtra }) => (
  <HeaderWrapper>
    <FlexContainer flexWrap="nowrap">
      <MenuIcon className="hamburger" onClick={() => toggleSideBar()} />
      <Title>{title}</Title>
    </FlexContainer>
    {renderExtra()}
  </HeaderWrapper>
);

Header.propTypes = {
  title: PropTypes.string.isRequired,
  toggleSideBar: PropTypes.func.isRequired,
  renderExtra: PropTypes.func
};

Header.defaultProps = {
  renderExtra: () => null
};

export default Header;
