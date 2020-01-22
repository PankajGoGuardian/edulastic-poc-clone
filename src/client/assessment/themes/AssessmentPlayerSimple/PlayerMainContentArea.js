/* eslint-disable react/prop-types */
import React, { useState, useRef } from "react";
import { get } from "lodash";
import PropTypes from "prop-types";
import styled from "styled-components";

import { Hints, ScrollContext } from "@edulastic/common";
import TestItemPreview from "../../components/TestItemPreview";
import SidebarQuestionList from "./PlayerSideBar";
import PlayerFooter from "./PlayerFooter";

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
  testItemState,
  setHighlights,
  setCrossAction,
  crossAction,
  previousQuestionActivities
}) => {
  const [isSidebarVisible, setSidebarVisible] = useState(true);
  const scrollContainerRef = useRef();
  const item = items[currentItem];

  const toggleSideBar = () => {
    setSidebarVisible(!isSidebarVisible);
  };
  const previousQuestionActivity = previousQuestionActivities[item._id];
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
      <MainWrapper isSidebarVisible={isSidebarVisible} ref={scrollContainerRef}>
        {/* react-sortable-hoc is required getContainer for auto-scroll, so need to use ScrollContext here
            Also, will use ScrollContext for auto-scroll on mobile */}
        <ScrollContext.Provider value={{ getScrollElement: () => scrollContainerRef.current }}>
          <MainContent>
            {testItemState === "" && (
              <TestItemPreview
                crossAction={crossAction}
                setCrossAction={setCrossAction}
                setHighlights={setHighlights}
                cols={itemRows}
                previewTab={previewTab}
                questions={questions}
                previousQuestionActivity={previousQuestionActivity}
                showCollapseBtn
              />
            )}
            {testItemState === "check" && (
              <TestItemPreview
                cols={itemRows}
                previewTab="check"
                preview="show"
                questions={questions}
                previousQuestionActivity={previousQuestionActivity}
                showCollapseBtn
              />
            )}
            {showHints && <Hints questions={get(item, [`data`, `questions`], [])} />}
          </MainContent>
        </ScrollContext.Provider>
        <PlayerFooter
          isLast={isLast}
          isFirst={isFirst}
          moveToNext={moveToNext}
          moveToPrev={moveToPrev}
          isSidebarVisible={isSidebarVisible}
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
  overflow: hidden;
`;

const MainContent = styled.div`
  background-color: ${props => props.theme.widgets.assessmentPlayers.mainContentBgColor};
  color: ${props => props.theme.widgets.assessmentPlayers.mainContentTextColor};
  border-radius: 10px;
  font-size: 18px;
  box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.1);
  margin: 40px 40px 0 40px;
  border-radius: 10px;
  display: flex;
  overflow: hidden;
  width: 100%;
  flex-direction: column;
  & * {
    -webkit-touch-callout: none;
    user-select: none;
  }

  & input {
    user-select: text;
  }

  @media (max-width: ${IPAD_PORTRAIT_WIDTH}px) {
    margin: 30px 10px;
  }
`;

const MainWrapper = styled.div`
  position: relative;
  width: ${({ isSidebarVisible }) => (isSidebarVisible ? "calc(100% - 220px)" : "calc(100% - 65px)")};
  margin-top: 60px;
  height: calc(100vh - 150px);
  display: flex;
  overflow: hidden;
  @media (max-width: ${IPAD_LANDSCAPE_WIDTH - 1}px) {
    width: 100%;
    margin-top: 65px;
  }

  @media (max-width: ${MAX_MOBILE_WIDTH}px) {
    margin-top: 75px;
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
