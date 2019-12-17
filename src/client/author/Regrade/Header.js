import React from "react";
import { FlexContainer } from "@edulastic/common";
import HeaderWrapper from "../src/mainContent/headerWrapper";
import { Title, ApplyButton } from "./styled";

const Header = ({ onApplySettings, onCancelRegrade }) => {
  return (
    <HeaderWrapper>
      <Title>Regrade</Title>
      <FlexContainer>
        <ApplyButton data-cy="cancelRegrade" onClick={onCancelRegrade}>
          Cancel
        </ApplyButton>
        <ApplyButton data-cy="applyRegrade" onClick={onApplySettings}>
          Apply
        </ApplyButton>
      </FlexContainer>
    </HeaderWrapper>
  );
};

export default Header;
