import React from "react";
import PropTypes from "prop-types";
import { FlexContainer } from "@edulastic/common";
import { Container, Title } from "./styled";

const Header = ({ title }) => {
  return (
    <Container>
      <FlexContainer alignItems="flex-start">
        <Title>{title}</Title>
      </FlexContainer>
    </Container>
  );
};

Header.propTypes = {
  title: PropTypes.string.isRequired
};

export default Header;
