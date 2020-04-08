import React from "react";
import { FlexContainer, MainHeader, EduButton } from "@edulastic/common";
import { Title } from "./styled";

const Header = ({ onApplySettings, onCancelRegrade }) => {
  return (
    <MainHeader>
      <Title>Regrade</Title>
      <FlexContainer>
        <EduButton data-cy="cancelRegrade" onClick={onCancelRegrade}>
          Cancel
        </EduButton>
        <EduButton data-cy="applyRegrade" onClick={onApplySettings}>
          Publish & Regrade
        </EduButton>
      </FlexContainer>
    </MainHeader>
  );
};

export default Header;
