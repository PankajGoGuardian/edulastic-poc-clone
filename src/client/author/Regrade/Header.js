import React from "react";
import { FlexContainer, MainHeader, EduButton } from "@edulastic/common";
import { TitleWrapper } from "@edulastic/common/src/components/MainHeader";

const Header = ({ onApplySettings, title }) => {
  return (
    <MainHeader>
      <TitleWrapper title={title}>{title}</TitleWrapper>
      <FlexContainer>
        <EduButton data-cy="applyRegrade" onClick={onApplySettings}>
          Publish & Regrade
        </EduButton>
      </FlexContainer>
    </MainHeader>
  );
};

export default Header;
