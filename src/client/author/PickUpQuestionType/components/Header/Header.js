import React from "react";
import PropTypes from "prop-types";
import { FlexContainer } from "@edulastic/common";
import { Container, Title, MenuIcon } from "./styled";

const Header = ({ title, toggleSideBar, renderExtra }) => (
  <Container>
    <FlexContainer alignItems="flex-start">
      <MenuIcon className="hamburger" onClick={() => toggleSideBar()} />
      <Title>{title}</Title>
    </FlexContainer>
    {renderExtra()}
  </Container>
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
