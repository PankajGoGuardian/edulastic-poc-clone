import React, { useState } from "react";
import styled from "styled-components";
import { test } from "@edulastic/constants";
import PracticePlayerHeader from "./AssessmentPlayerSimple/PlayerHeader";
import DocBasedPlayerHeader from "./AssessmentPlayerDocBased/PlayerHeader";
import DefaultAssessmentPlayerHeader from "./AssessmentPlayerDefault/PlayerHeader";
import ParccHeader from "./skins/Parcc/PlayerHeader";
import SidebarQuestionList from "./AssessmentPlayerSimple/PlayerSideBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { IPAD_LANDSCAPE_WIDTH } from "../constants/others";
import { FlexContainer } from "@edulastic/common";
import { Nav } from "./common";
import { isUndefined } from "lodash";
import SbacHeader from "./skins/Sbac/PlayerHeader";

const AssessmentPlayerSkinWrapper = ({
  children,
  defaultAP,
  docUrl,
  playerSkinType = test.playerSkinTypes.edulastic,
  ...restProps
}) => {
  const [isSidebarVisible, setSidebarVisible] = useState(true);
  const toggleSideBar = () => {
    setSidebarVisible(!isSidebarVisible);
  };
  const { moveToNext, moveToPrev, currentItem } = restProps;
  const header = () => {
    if (playerSkinType === "parcc") {
      return (
        <ParccHeader
          {...restProps}
          options={restProps.options || restProps.dropdownOptions}
          defaultAP={defaultAP}
          isDocbased={!isUndefined(docUrl)}
        />
      );
    } else if (playerSkinType == "sbac") {
      return (
        <SbacHeader
          {...restProps}
          options={restProps.options || restProps.dropdownOptions}
          defaultAP={defaultAP}
          isDocbased={!isUndefined(docUrl)}
        />
      );
    } else if (!isUndefined(docUrl)) {
      return <DocBasedPlayerHeader {...restProps} />;
    } else if (defaultAP) {
      return <DefaultAssessmentPlayerHeader {...restProps} />;
    } else {
      return <PracticePlayerHeader {...restProps} />;
    }
  };

  const leftSideBar = () => {
    if (!defaultAP && isUndefined(docUrl)) {
      return (
        <Sidebar isVisible={isSidebarVisible}>
          <SidebarQuestionList
            questions={restProps.dropdownOptions}
            selectedQuestion={restProps.currentItem}
            gotoQuestion={restProps.gotoQuestion}
            toggleSideBar={toggleSideBar}
            isSidebarVisible={isSidebarVisible}
            theme={restProps.theme}
          />
        </Sidebar>
      );
    }
    return null;
  };

  const getMainContainerStyle = () => {
    if (playerSkinType.toLowerCase() === test.playerSkinTypes.edulastic.toLowerCase()) {
      if (!isUndefined(docUrl) || defaultAP) {
        return { width: "100%" };
      } else {
        return {
          margin: "40px 40px 0 40px",
          width: "100%"
        };
      }
    } else if (playerSkinType.toLowerCase() === test.playerSkinTypes.parcc.toLowerCase()) {
      return {
        paddingLeft: 0,
        paddingRight: 0,
        marginTop: defaultAP ? "82px" : "47px"
      };
    } else if (playerSkinType.toLowerCase() === test.playerSkinTypes.sbac.toLowerCase()) {
      return {
        paddingLeft: 0,
        paddingRight: 0,
        marginTop: defaultAP ? "48px" : "38px"
      };
    }
    return {};
  };

  const getStyle = () => {
    if (playerSkinType.toLowerCase() === test.playerSkinTypes.edulastic.toLowerCase()) {
      if (!isUndefined(docUrl) || defaultAP) {
        return { width: "100%" };
      } else {
        return {
          width: isSidebarVisible ? "calc(100% - 220px)" : "calc(100%)",
          background: restProps.theme.widgets.assessmentPlayers.mainBgColor
        };
      }
    } else if (
      playerSkinType.toLowerCase() === test.playerSkinTypes.parcc.toLowerCase() ||
      playerSkinType.toLowerCase() === test.playerSkinTypes.sbac.toLowerCase()
    ) {
      return {
        width: "100%"
      };
    }
    return {};
  };

  const navigationBtns = () => {
    return (
      <>
        {currentItem > 0 && (
          <Nav.BackArrow onClick={moveToPrev}>
            <FontAwesomeIcon icon={faAngleLeft} />
          </Nav.BackArrow>
        )}
        <Nav.NextArrow onClick={moveToNext}>
          <FontAwesomeIcon icon={faAngleRight} />
        </Nav.NextArrow>
      </>
    );
  };

  return (
    <>
      {header()}
      <FlexContainer>
        {playerSkinType.toLowerCase() === test.playerSkinTypes.edulastic.toLowerCase() && leftSideBar()}
        <StyledMainContainer
          mainContainerStyle={getMainContainerStyle()}
          style={getStyle()}
          playerSkin={playerSkinType}
          isSidebarVisible={isSidebarVisible}
        >
          {children}
        </StyledMainContainer>
        {playerSkinType === test.playerSkinTypes.edulastic.toLowerCase() && defaultAP && navigationBtns()}
      </FlexContainer>
    </>
  );
};

const Sidebar = styled.div`
  width: ${({ isVisible }) => (isVisible ? 220 : 65)}px;
  background-color: ${props => props.theme.widgets.assessmentPlayers.sidebarBgColor};
  color: ${props => props.theme.widgets.assessmentPlayers.sidebarTextColor};
  padding-top: ${({ isVisible }) => (isVisible ? "35px" : "68px")};
  height: ${({ isVisible }) => (isVisible ? "auto" : "100vh")};
  @media (max-width: ${IPAD_LANDSCAPE_WIDTH - 1}px) {
    display: none;
  }
`;

const StyledMainContainer = styled.div`
  main {
    ${({ mainContainerStyle }) => mainContainerStyle};
    @media (max-width: 768px) {
      padding: 58px 0 0;
    }
    .practice-player-footer {
      left: ${({ isSidebarVisible }) => (isSidebarVisible ? "220px" : "65px")};
    }
  }
  ${({ playerSkin }) =>
    playerSkin.toLowerCase() === test.playerSkinTypes.parcc.toLowerCase() ||
    playerSkin.toLowerCase() === test.playerSkinTypes.sbac.toLowerCase()
      ? `
    .question-tab-container {
      padding-top: 0!important;
    }
    .scratchpad-tools {
      top: 130px;
    }
    .question-audio-controller {
      display: ${playerSkin.toLowerCase() === test.playerSkinTypes.parcc.toLowerCase() ? "block" : "none!important"};
      z-index: 1;
      position: fixed;
      top: 50%;
      right: 0;
      > div {
        display: flex!important;
        flex-direction: column;
      }
      button {
        background: #EEEEEE!important;
        margin-bottom: 5px;
        svg {
          fill: #7A7A7A;
        }
      }
    }
  `
      : ``}
`;
export default AssessmentPlayerSkinWrapper;
