import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { test, questionType } from "@edulastic/constants";
import { FlexContainer } from "@edulastic/common";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import PracticePlayerHeader from "./AssessmentPlayerSimple/PlayerHeader";
import DocBasedPlayerHeader from "./AssessmentPlayerDocBased/PlayerHeader";
import DefaultAssessmentPlayerHeader from "./AssessmentPlayerDefault/PlayerHeader";
import ParccHeader from "./skins/Parcc/PlayerHeader";
import SidebarQuestionList from "./AssessmentPlayerSimple/PlayerSideBar";
import { IPAD_LANDSCAPE_WIDTH } from "../constants/others";
import { Nav } from "./common";
import SbacHeader from "./skins/Sbac/PlayerHeader";
import Magnifier from "../../common/components/Magnifier";

const AssessmentPlayerSkinWrapper = ({
  children,
  defaultAP,
  docUrl,
  playerSkinType = test.playerSkinValues.edulastic,
  handleMagnifier,
  qId,
  enableMagnifier = false,
  ...restProps
}) => {
  const [isSidebarVisible, setSidebarVisible] = useState(true);
  const {
    moveToNext,
    moveToPrev,
    currentItem,
    qType,
    changeTool,
    toggleToolsOpenStatus,
    tool,
    toolsOpenStatus
  } = restProps;

  useEffect(() => {
    const toolsStatusArray = toolsOpenStatus || tool;
    const toolToggleFunc = toggleToolsOpenStatus || changeTool;
    // 5 is Scratchpad mode
    if (qType === questionType.HIGHLIGHT_IMAGE && toolToggleFunc && !toolsStatusArray?.includes(5)) {
      toolToggleFunc(5);
    } else if (qType !== questionType.HIGHLIGHT_IMAGE && toolToggleFunc && toolsStatusArray?.includes(5)) {
      toolToggleFunc(5);
    }
  }, [qType, qId]);

  const toggleSideBar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  const isDocBased = !!docUrl;

  const header = () => {
    if (playerSkinType === "parcc") {
      return (
        <ParccHeader
          {...restProps}
          options={restProps.options || restProps.dropdownOptions}
          defaultAP={defaultAP}
          isDocbased={isDocBased}
          handleMagnifier={handleMagnifier}
          enableMagnifier={enableMagnifier}
        />
      );
    }
    if (playerSkinType == "sbac") {
      return (
        <SbacHeader
          {...restProps}
          options={restProps.options || restProps.dropdownOptions}
          defaultAP={defaultAP}
          isDocbased={isDocBased}
          handleMagnifier={handleMagnifier}
          enableMagnifier={enableMagnifier}
        />
      );
    }
    if (docUrl) {
      return <DocBasedPlayerHeader {...restProps} handleMagnifier={handleMagnifier} />;
    }
    if (defaultAP) {
      return (
        <DefaultAssessmentPlayerHeader
          {...restProps}
          handleMagnifier={handleMagnifier}
          enableMagnifier={enableMagnifier}
        />
      );
    }
    return <PracticePlayerHeader {...restProps} handleMagnifier={handleMagnifier} enableMagnifier={enableMagnifier} />;
  };

  const leftSideBar = () => {
    if (!defaultAP && !isDocBased) {
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
    if (playerSkinType.toLowerCase() === test.playerSkinValues.edulastic.toLowerCase()) {
      if (isDocBased || defaultAP) {
        return { width: "100%" };
      }
      return {
        margin: "40px 40px 0 40px",
        width: "100%"
      };
    }
    if (playerSkinType.toLowerCase() === test.playerSkinValues.parcc.toLowerCase()) {
      return {
        paddingLeft: 0,
        paddingRight: 0,
        marginTop: defaultAP ? "82px" : "47px"
      };
    }
    if (playerSkinType.toLowerCase() === test.playerSkinValues.sbac.toLowerCase()) {
      return {
        paddingLeft: 0,
        paddingRight: 0,
        marginTop: defaultAP ? "78px" : "38px"
      };
    }
    return { width: "100%" };
  };

  const getStyle = () => {
    if (playerSkinType.toLowerCase() === test.playerSkinValues.edulastic.toLowerCase()) {
      if (isDocBased || defaultAP) {
        return { width: "100%" };
      }
      return {
        width: isSidebarVisible ? "calc(100% - 220px)" : "calc(100%)",
        background: restProps.theme.widgets.assessmentPlayers.mainBgColor
      };
    }
    if (
      playerSkinType.toLowerCase() === test.playerSkinValues.parcc.toLowerCase() ||
      playerSkinType.toLowerCase() === test.playerSkinValues.sbac.toLowerCase()
    ) {
      return {
        width: "100%"
      };
    }
    return {};
  };

  const navigationBtns = () => (
    <>
      {currentItem > 0 && (
        <Nav.BackArrow left="0px" borderRadius="0px" width="30" onClick={moveToPrev}>
          <FontAwesomeIcon icon={faAngleLeft} />
        </Nav.BackArrow>
      )}
      <Nav.NextArrow right="0px" borderRadius="0px" width="30" onClick={moveToNext}>
        <FontAwesomeIcon icon={faAngleRight} />
      </Nav.NextArrow>
    </>
  );

  const getTopOffset = () => {
    if (playerSkinType.toLowerCase() === test.playerSkinValues.sbac.toLowerCase()) {
      return { top: 120, left: 0 };
    }
    return { top: 63, left: 0 };
  };

  return (
    <Magnifier enable={enableMagnifier} offset={getTopOffset()}>
      {header()}
      <FlexContainer>
        {playerSkinType.toLowerCase() === test.playerSkinValues.edulastic.toLowerCase() && leftSideBar()}
        <StyledMainContainer
          mainContainerStyle={getMainContainerStyle()}
          style={getStyle()}
          playerSkin={playerSkinType}
          isSidebarVisible={isSidebarVisible}
        >
          {children}
        </StyledMainContainer>
        {playerSkinType === test.playerSkinValues.edulastic.toLowerCase() && defaultAP && navigationBtns()}
      </FlexContainer>
    </Magnifier>
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
    .jsx-parser {
      p {
        margin-bottom: 8px;
      }
    }
    ${({ mainContainerStyle }) => mainContainerStyle};
    @media (max-width: 768px) {
      padding: 58px 0 0;
    }
    .practice-player-footer {
      left: ${({ isSidebarVisible }) => (isSidebarVisible ? "220px" : "65px")};
    }
    .question-tab-container {
      height: fit-content !important;
    }
  }
  ${({ playerSkin }) =>
    playerSkin.toLowerCase() === test.playerSkinValues.parcc.toLowerCase() ||
    playerSkin.toLowerCase() === test.playerSkinValues.sbac.toLowerCase()
      ? `
    .question-tab-container {
      padding-top: 0!important;
      height: fit-content!important;
    }
    .scratchpad-tools {
      top: 130px;
    }
    .question-audio-controller {
      display: ${playerSkin.toLowerCase() === test.playerSkinValues.parcc.toLowerCase() ? "block" : "none!important"};
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
