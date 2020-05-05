import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { test, questionType } from "@edulastic/constants";
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
import Magnifier from "../../common/components/Magnifier";

const AssessmentPlayerSkinWrapper = ({
  children,
  defaultAP,
  docUrl,
  playerSkinType = test.playerSkinTypes.edulastic,
  showMagnifier = true,
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
    if (qType === questionType.HIGHLIGHT_IMAGE) {
      const toolsStatusArray = toolsOpenStatus || tool;
      const toolToggleFunc = toggleToolsOpenStatus || changeTool;
      // 5 is Scratchpad mode
      if (toolToggleFunc && !toolsStatusArray?.includes(5)) {
        toolToggleFunc(5);
      }
    }
  }, [qType, qId]);

  const toggleSideBar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  const header = () => {
    if (playerSkinType === "parcc") {
      return (
        <ParccHeader
          {...restProps}
          options={restProps.options || restProps.dropdownOptions}
          defaultAP={defaultAP}
          isDocbased={!isUndefined(docUrl)}
          handleMagnifier={handleMagnifier}
          enableMagnifier={enableMagnifier}
        />
      );
    } else if (playerSkinType == "sbac") {
      return (
        <SbacHeader
          {...restProps}
          options={restProps.options || restProps.dropdownOptions}
          defaultAP={defaultAP}
          isDocbased={!isUndefined(docUrl)}
          handleMagnifier={handleMagnifier}
          enableMagnifier={enableMagnifier}
        />
      );
    } else if (!isUndefined(docUrl)) {
      return <DocBasedPlayerHeader {...restProps} handleMagnifier={handleMagnifier} />;
    } else if (defaultAP) {
      return (
        <DefaultAssessmentPlayerHeader
          {...restProps}
          handleMagnifier={handleMagnifier}
          enableMagnifier={enableMagnifier}
        />
      );
    } else {
      return (
        <PracticePlayerHeader {...restProps} handleMagnifier={handleMagnifier} enableMagnifier={enableMagnifier} />
      );
    }
  };

  const isDocbased = !isUndefined(docUrl);

  const leftSideBar = () => {
    if (!defaultAP && !isDocbased) {
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
        marginTop: defaultAP ? "78px" : "38px"
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

  const getTopOffset = () => {
    if (playerSkinType.toLowerCase() === test.playerSkinTypes.sbac.toLowerCase()) {
      return { top: 120, left: 0 };
    } else {
      return { top: 63, left: 0 };
    }
  };

  return (
    <Magnifier enable={enableMagnifier} offset={getTopOffset()}>
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
    playerSkin.toLowerCase() === test.playerSkinTypes.parcc.toLowerCase() ||
    playerSkin.toLowerCase() === test.playerSkinTypes.sbac.toLowerCase()
      ? `
    .question-tab-container {
      padding-top: 0!important;
      height: fit-content!important;
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
