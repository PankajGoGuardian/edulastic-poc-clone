/* eslint-disable react/prop-types */
import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { IconLogoCompact, IconSave, IconPause, IconLogout, IconSend } from "@edulastic/icons";
import { boxShadowDefault } from "@edulastic/colors";
import { Header, FlexContainer, HeaderLeftMenu, MobileMainMenu as Mobile, HeaderMainMenu } from "../common";
import { IPAD_PORTRAIT_WIDTH, headerOffsetHashMap } from "../../constants/others";
import QuestionSelectDropdown from "../common/QuestionSelectDropdown";
import { ifZoomed } from "../../../common/utils/helpers";

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
  onSubmit,
  zoomLevel,
  windowWidth
}) => {
  const isZoomed = ifZoomed(theme?.zoomLevel);
  const InnerContainer = isZoomed ? HeaderInnerContainer : Fragment;
  return (
    <Fragment>
      <HeaderPracticePlayer>
        <HeaderLeftMenu skinb={"true"}>
          <LogoCompact color="#fff" />
        </HeaderLeftMenu>
        <HeaderMainMenu skinb={"true"}>
          <FlexContainer
            style={{
              transform: `scale(${zoomLevel >= "1.75" ? "1.5" : "1.25"})`, // maxScale of 1.5 to header
              transformOrigin: "0px 0px",
              width: `${zoomLevel >= "1.75" ? "66.67" : "80"}%`,
              padding: `${zoomLevel >= "1.75" ? "10px 10px 40px" : "10px 5px 25px"}`,
              justifyContent: windowWidth <= IPAD_PORTRAIT_WIDTH && "space-between"
            }}
          >
            <PlayerTitle>{title}</PlayerTitle>
            <InnerContainer>
              <ContainerRight>
                <div style={{ display: "flex" }}>
                  {showSubmit && (
                    <Save onClick={onSubmit} title="Submit">
                      <IconSend color={theme.widgets.assessmentPlayerSimple.headerIconColor} />
                    </Save>
                  )}
                  <Save onClick={onSaveProgress} title="Save">
                    <IconSave color={theme.widgets.assessmentPlayerSimple.headerIconColor} />
                  </Save>
                  {onPause && (
                    <Save onClick={onPause} title="Pause">
                      <IconPause color={theme.widgets.assessmentPlayerSimple.headerIconColor} />
                    </Save>
                  )}
                  {!onPause && (
                    <StyledLink to="/home/assignments">
                      <IconPause color={theme.widgets.assessmentPlayerSimple.headerIconColor} />
                    </StyledLink>
                  )}
                  <Save onClick={onOpenExitPopup} title="Exit">
                    <IconLogout color={theme.widgets.assessmentPlayerSimple.headerIconColor} />
                  </Save>
                </div>
              </ContainerRight>
            </InnerContainer>
          </FlexContainer>
        </HeaderMainMenu>
      </HeaderPracticePlayer>
      <Mobile>
        <QuestionSelectDropdown
          key={currentItem}
          currentItem={currentItem}
          gotoQuestion={gotoQuestion}
          options={dropdownOptions}
          skinb={"true"}
        />
      </Mobile>
    </Fragment>
  );
};

PlayerHeader.defaultProps = {
  onSaveProgress: () => {}
};

export default PlayerHeader;

const LogoCompact = styled(IconLogoCompact)`
  zoom: ${({ theme }) => theme?.widgets?.assessmentPlayers?.textZoom};
  width: 21px;
  height: 21px;
  margin: 10px;
  fill: ${props => props.theme.widgets.assessmentPlayers.logoColor};
  &:hover {
    fill: ${props => props.theme.widgets.assessmentPlayers.logoColor};
  }
`;

const PlayerTitle = styled.h1`
  zoom: ${({ theme }) => theme?.widgets?.assessmentPlayers?.textZoom};
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
  padding: 13px;
  margin-left: 10px;
  cursor: pointer;
  display: flex;
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

const ContainerRight = styled.div`
  zoom: ${({ theme }) => theme?.widgets?.assessmentPlayers?.textZoom};
  display: flex;
  margin-left: 40px;
  @media (max-width: ${IPAD_PORTRAIT_WIDTH}px) {
    margin-left: auto;
  }
`;

const HeaderPracticePlayer = styled(Header)`
  background: ${props => props.theme.headerBg};
  box-shadow: ${boxShadowDefault};
  height: ${({ theme }) => headerOffsetHashMap[(theme?.zoomLevel)]}px;
  z-index: 1000;
`;

const HeaderInnerContainer = styled.div`
  display: flex;
  margin-top: 10px;
  margin-left: auto;
`;
