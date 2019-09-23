/* eslint-disable react/prop-types */
import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { IconLogoCompact, IconSave, IconPause, IconLogout, IconSend } from "@edulastic/icons";
import { boxShadowDefault } from "@edulastic/colors";
import { Header, FlexContainer, HeaderLeftMenu, MobileMainMenu as Mobile, HeaderMainMenu } from "../common";
import { IPAD_PORTRAIT_WIDTH } from "../../constants/others";
import QuestionSelectDropdown from "../common/QuestionSelectDropdown";

import ProgressContainer from "./ProgressContainer";

const PlayerHeader = ({
  title,
  dropdownOptions,
  currentItem,
  onOpenExitPopup,
  theme,
  gotoQuestion,
  onPause,
  onSaveProgress,
  showSubmit,
  onSubmit
}) => (
  <Fragment>
    <HeaderPracticePlayer>
      <HeaderLeftMenu skinb="true">
        <LogoCompact color="#fff" />
      </HeaderLeftMenu>
      <HeaderMainMenu skinb="true">
        <FlexContainer>
          <PlayerTitle>{title}</PlayerTitle>
          <ProgressContainer questions={dropdownOptions} current={currentItem + 1} desktop="true" />
          <ContainerRight>
            <FlexDisplay>
              {showSubmit && (
                <Save onClick={onSubmit} title="Submit">
                  <IconSend color={theme.headerIconColor} />
                </Save>
              )}
              <Save onClick={onSaveProgress} title="Save">
                <IconSave color={theme.headerIconColor} />
              </Save>
              {onPause && (
                <Save onClick={onPause} title="Pause">
                  <IconPause color={theme.headerIconColor} />
                </Save>
              )}
              {!onPause && (
                <StyledLink to="/home/assignments">
                  <IconPause color={theme.headerIconColor} />
                </StyledLink>
              )}
              <Save onClick={onOpenExitPopup} title="Exit">
                <IconLogout color={theme.headerIconColor} />
              </Save>
            </FlexDisplay>
          </ContainerRight>
        </FlexContainer>
        <Mobile>
          <ProgressContainer questions={dropdownOptions} current={currentItem + 1} />
        </Mobile>
      </HeaderMainMenu>
    </HeaderPracticePlayer>
    <Mobile>
      <QuestionSelectDropdown
        key={currentItem}
        currentItem={currentItem}
        gotoQuestion={gotoQuestion}
        options={dropdownOptions}
        skinb="true"
      />
    </Mobile>
  </Fragment>
);

PlayerHeader.defaultProps = {
  onSaveProgress: () => {}
};

export default PlayerHeader;

const LogoCompact = styled(IconLogoCompact)`
  width: 21px;
  height: 21px;
  margin: 10px;
  fill: ${props => props.theme.logoColor};
  &:hover {
    fill: ${props => props.theme.headerIconHoverColor};
  }
`;

const PlayerTitle = styled.h1`
  font-size: 20px;
  font-weight: bold;
  margin: 0;
  color: #fff;
  @media (max-width: ${IPAD_PORTRAIT_WIDTH}px) {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;
const Save = styled.div`
  background: ${props => props.theme.headerIconBgColor};
  border-radius: 5px;
  padding: 12px 14px;
  margin-left: 10px;
  cursor: pointer;
  &:hover {
    svg {
      fill: ${props => props.theme.headerIconHoverColor};
    }
  }
`;

const StyledLink = styled(Link)`
  background: ${props => props.theme.headerIconBgColor};
  border-radius: 5px;
  padding: 12px 14px;
  margin-left: 10px;
  cursor: pointer;
  &:hover {
    svg {
      fill: ${props => props.theme.headerIconHoverColor};
    }
  }
`;

const FlexDisplay = styled.div`
  display: flex;
`;

const ContainerRight = styled.div`
  display: flex;
  margin-left: 40px;
  @media (max-width: ${IPAD_PORTRAIT_WIDTH}px) {
    margin-left: auto;
  }
`;

const HeaderPracticePlayer = styled(Header)`
  background: ${props => props.theme.headerBg};
  box-shadow: ${boxShadowDefault};
  height: 70px;
  z-index: 1;
  @media (max-width: ${IPAD_PORTRAIT_WIDTH}px) {
    height: 104px;
  }
`;
