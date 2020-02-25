import React, { useState } from "react";
import styled from "styled-components"; 
import { test } from "@edulastic/constants";
import PracticePlayerHeader from "./AssessmentPlayerSimple/PlayerHeader";
import DocBasedPlayerHeader from "./AssessmentPlayerDocBased/PlayerHeader";
import DefaultAssessmentPlayerHeader from "./AssessmentPlayerDefault/PlayerHeader"
import ParccHeader from "./skins/Parcc/PlayerHeader";
import SidebarQuestionList from "./AssessmentPlayerSimple/PlayerSideBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { IPAD_LANDSCAPE_WIDTH } from "../constants/others";
import { FlexContainer } from "@edulastic/common";
import { Nav } from "./common"
import { isUndefined } from "lodash";

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
      return <ParccHeader {...restProps} options={restProps.options || restProps.dropdownOptions} />
    } else if (!isUndefined(docUrl)){
      return <DocBasedPlayerHeader {...restProps} />;
    } else if (defaultAP) {
      return <DefaultAssessmentPlayerHeader {...restProps} />;
    } else {
      return <PracticePlayerHeader {...restProps} />;
    }
  }

  const leftSideBar = () => {
    if (!defaultAP) {
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
  }

  const getMainContainerStyle = () => {
    if (playerSkinType.toLowerCase() === test.playerSkinTypes.edulastic.toLowerCase()) {
      if (!isUndefined(docUrl) || defaultAP) {
        return {width: "100%"};
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
      }
    }
    return {};
  }

  const getStyle = () => {
    if (playerSkinType.toLowerCase() === test.playerSkinTypes.edulastic.toLowerCase()) {
      if (!isUndefined(docUrl) || defaultAP) {
        return { width: "100%" };
      } else {
        return {
          width: "calc(100% - 220px)"
        };
      }
    } else if (playerSkinType.toLowerCase() === test.playerSkinTypes.parcc.toLowerCase()) {
      return {
        width: "100%"
      }
    }
    return {};
  }

  const navigationBtns = () => {
    return <>
      {currentItem > 0 && (
        <Nav.BackArrow onClick={moveToPrev}>
          <FontAwesomeIcon icon={faAngleLeft} />
        </Nav.BackArrow>
      )}
      <Nav.NextArrow onClick={moveToNext}>
        <FontAwesomeIcon icon={faAngleRight} />
      </Nav.NextArrow>
    </>
  }
  
  return (
    <>
      {header()}
      <FlexContainer>
        {playerSkinType.toLowerCase() === test.playerSkinTypes.edulastic.toLowerCase() && leftSideBar()}
        <StyledMainContainer mainContainerStyle={getMainContainerStyle()} style={getStyle()} playerSkin={playerSkinType}>
          {children}
        </StyledMainContainer>
        {playerSkinType === test.playerSkinTypes.edulastic.toLowerCase() && defaultAP && navigationBtns()}
      </FlexContainer>
    </>
  )
}

const Sidebar = styled.div`
  width: ${({ isVisible }) => (isVisible ? 220 : 65)}px;
  background-color: ${props => props.theme.widgets.assessmentPlayers.sidebarBgColor};
  color: ${props => props.theme.widgets.assessmentPlayers.sidebarTextColor};
  padding-top: 35px;
  @media (max-width: ${IPAD_LANDSCAPE_WIDTH - 1}px) {
    display: none;
  }
`;

const StyledMainContainer = styled.div`
  main {
    ${({mainContainerStyle}) => mainContainerStyle};
  }
  ${({playerSkin}) => playerSkin.toLowerCase() === test.playerSkinTypes.parcc.toLowerCase() ? `
    .question-tab-container {
      padding-top: 0!important;
    }
    .question-audio-controller {
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
  ` : ``}
`
export default AssessmentPlayerSkinWrapper;