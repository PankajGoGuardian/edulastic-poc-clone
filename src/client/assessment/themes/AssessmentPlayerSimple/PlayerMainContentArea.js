/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { get } from "lodash";
import PropTypes from "prop-types";
import styled from "styled-components";

import { Hints } from "@edulastic/common";
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
      <MainWrapper isSidebarVisible={isSidebarVisible}>
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
  overflow-x: hidden;
`;

const MainContent = styled.div`
  background-color: ${props => props.theme.widgets.assessmentPlayers.mainContentBgColor};
  color: ${props => props.theme.widgets.assessmentPlayers.mainContentTextColor};
  border-radius: 10px;
  font-size: 18px;
  box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.1);
  margin: 90px 40px 90px 40px;
  border-radius: 10px;
  & * {
    -webkit-touch-callout: none;
    user-select: none;
  }

  & input {
    user-select: text;
  }

  @media (max-width: ${IPAD_PORTRAIT_WIDTH}px) {
    margin: 90px 10px 45px 10px;
  }

  @media (max-width: ${MAX_MOBILE_WIDTH}px) {
    margin-top: 110px;
  }
`;

const MainWrapper = styled.div`
  position: relative;
  width: ${({ isSidebarVisible }) => (isSidebarVisible ? "calc(100% - 220px)" : "calc(100% - 65px)")};
  @media (max-width: ${IPAD_LANDSCAPE_WIDTH - 1}px) {
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
