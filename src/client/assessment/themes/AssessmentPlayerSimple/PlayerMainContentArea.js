/* eslint-disable react/prop-types */
import React, { useRef, useState } from "react";
import { get } from "lodash";
import PropTypes from "prop-types";
import styled from "styled-components";

import { Hints } from "@edulastic/common";
import TestItemPreview from "../../components/TestItemPreview";
import SidebarQuestionList from "./PlayerSideBar";
import PlayerFooter from "./PlayerFooter";
import DragScrollContainer from "../../components/DragScrollContainer";

import { IPAD_PORTRAIT_WIDTH, IPAD_LANDSCAPE_WIDTH, MAX_MOBILE_WIDTH } from "../../constants/others";

const PlayerContentArea = ({
  itemRows,
  previewTab,
  dropdownOptions,
  currentItem,
  gotoQuestion,
  isFirst,
  isLast,
  moveToPrev,
  moveToNext,
  questions,
  t,
  unansweredQuestionCount,
  items,
  theme,
  showHints,
  testItemState
}) => {
  const [isSidebarVisible, setSidebarVisible] = useState(true);
  const scrollElementRef = useRef(null);
  const item = items[currentItem];

  const toggleSideBar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  return (
    <Main skinB="true">
      <Sidebar isVisible={isSidebarVisible}>
        <SidebarQuestionList
          questions={dropdownOptions}
          selectedQuestion={currentItem}
          gotoQuestion={gotoQuestion}
          toggleSideBar={toggleSideBar}
          isSidebarVisible={isSidebarVisible}
          theme={theme}
        />
      </Sidebar>
      <MainWrapper isSidebarVisible={isSidebarVisible}>
        {scrollElementRef.current && <DragScrollContainer scrollWrraper={scrollElementRef.current} />}
        <MainContent ref={scrollElementRef}>
          {testItemState === "" && (
            <TestItemPreview cols={itemRows} previewTab={previewTab} questions={questions} showCollapseBtn />
          )}
          {testItemState === "check" && (
            <TestItemPreview cols={itemRows} previewTab="check" preview="show" questions={questions} showCollapseBtn />
          )}
          {showHints && <Hints questions={get(item, [`data`, `questions`], [])} />}
        </MainContent>
        <PlayerFooter
          isLast={isLast}
          isFirst={isFirst}
          moveToNext={moveToNext}
          moveToPrev={moveToPrev}
          t={t}
          unansweredQuestionCount={unansweredQuestionCount}
        />
      </MainWrapper>
    </Main>
  );
};

PlayerContentArea.propTypes = {
  itemRows: PropTypes.array,
  previewTab: PropTypes.string.isRequired,
  dropdownOptions: PropTypes.array,
  currentItem: PropTypes.number.isRequired,
  gotoQuestion: PropTypes.func.isRequired,
  isFirst: PropTypes.func.isRequired,
  isLast: PropTypes.func.isRequired,
  moveToPrev: PropTypes.func.isRequired,
  moveToNext: PropTypes.func.isRequired,
  questions: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired
};

PlayerContentArea.defaultProps = {
  itemRows: [],
  dropdownOptions: []
};

export default PlayerContentArea;

const Main = styled.main`
  background-color: ${props => props.theme.widgets.assessmentPlayers.mainBgColor};
  display: flex;
  height: 100vh;
  box-sizing: border-box;
  overflow-x: hidden;
`;

const MainContent = styled.div`
  /* background-color: ${props => props.theme.widgets.assessmentPlayers.mainContentBgColor}; */
  color: ${props => props.theme.widgets.assessmentPlayers.mainContentTextColor};
  border-radius: 10px;
  text-align: left;
  font-size: 18px;
  overflow: auto;
  height: calc(100vh - 44px);
  padding: 70px 40px 70px 40px;

  & * {
    -webkit-touch-callout: none;
    user-select: none;
  }
  
  & input {
    user-select: text;

  @media (max-width: ${IPAD_LANDSCAPE_WIDTH}px) {
    padding: 70px 35px 70px 35px;
  }

  @media (max-width: ${IPAD_PORTRAIT_WIDTH}px) {
    padding: 65px 35px 70px 35px;
  }

  @media (max-width: ${MAX_MOBILE_WIDTH}px) {
    padding: 80px 16px 70px 16px;
  }
`;

const MainWrapper = styled.div`
  position: relative;
  width: ${({ isSidebarVisible }) => (isSidebarVisible ? "calc(100% - 220px)" : "calc(100% - 65px)")};
  @media (max-width: ${IPAD_LANDSCAPE_WIDTH}px) {
    width: 100%;
  }
`;

const Sidebar = styled.div`
  width: ${({ isVisible }) => (isVisible ? 220 : 65)}px;
  background-color: ${props => props.theme.widgets.assessmentPlayers.sidebarBgColor};
  color: ${props => props.theme.widgets.assessmentPlayers.sidebarTextColor};
  padding-top: 85px;
  @media (max-width: ${IPAD_LANDSCAPE_WIDTH - 1}px) {
    display: none;
  }
`;
