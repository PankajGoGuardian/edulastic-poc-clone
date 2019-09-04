import React from "react";
import HeaderWrapper from "../src/mainContent/headerWrapper";
import { Title, ApplyButton } from "./styled";
import { FlexContainer } from "@edulastic/common";

const Header = ({ onApplySettings, onCancelRegrade }) => {
  return (
    <HeaderWrapper>
      <Title>Regrade</Title>
      <FlexContainer>
        <ApplyButton onClick={onCancelRegrade}>Cancel</ApplyButton>
        <ApplyButton onClick={onApplySettings}>Apply</ApplyButton>
      </FlexContainer>
    </HeaderWrapper>
  );
};

export default Header;
