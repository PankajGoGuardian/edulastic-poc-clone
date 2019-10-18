import React, { useRef, useState, useEffect } from "react";
import { get } from "lodash";
import PropTypes from "prop-types";
import styled from "styled-components";

import TestItemPreview from "../../components/TestItemPreview";
import SidebarQuestionList from "./PlayerSideBar";
import PlayerFooter from "./PlayerFooter";
import DragScrollContainer from "../../components/DragScrollContainer";

import { IPAD_PORTRAIT_WIDTH, IPAD_LANDSCAPE_WIDTH, headerOffsetHashMap } from "../../constants/others";
import { Hints } from "@edulastic/common";
import { ifZoomed } from "../../../common/utils/helpers";

const PlayerContentArea = ({
  itemRows,
  previewTab,
  dropdownOptions,
  currentItem,
  gotoQuestion,
  onCheckAnswer,
  isFirst,
  isLast,
  moveToPrev,
  moveToNext,
  questions,
  answerChecksUsedForItem,
  settings,
  t,
  unansweredQuestionCount,
  items,
  theme
}) => {
  const [isSidebarVisible, setSidebarVisible] = useState(true);
  const scrollElementRef = useRef(null);
  const [showHints, setShowHints] = useState(false);
  const item = items[currentItem];

  const toggleSideBar = () => {
    setSidebarVisible(isSidebarVisible => !isSidebarVisible);
  };

  useEffect(() => {
    setShowHints(false);
  }, [currentItem]);
  return (
    <Main skinB="true">
      <MainWrapper isSidebarVisible={isSidebarVisible}>
        {scrollElementRef.current && <DragScrollContainer scrollWrraper={scrollElementRef.current} />}
        <MainContent innerRef={scrollElementRef}>
          <TestItemPreview cols={itemRows} previewTab={previewTab} questions={questions} showCollapseBtn />
          {showHints && <Hints questions={get(item, [`data`, `questions`], [])} />}
        </MainContent>
        <PlayerFooter
          isLast={isLast}
          isFirst={isFirst}
          moveToNext={moveToNext}
          moveToPrev={moveToPrev}
          onCheckAnswer={onCheckAnswer}
          answerChecksUsedForItem={answerChecksUsedForItem}
          settings={settings}
          showHints={showHints}
          onShowHints={() => setShowHints(showHint => !showHint)}
          questions={item?.data?.questions || []}
          t={t}
          unansweredQuestionCount={unansweredQuestionCount}
        />
      </MainWrapper>

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
    </Main>
  );
};

PlayerContentArea.propTypes = {
  itemRows: PropTypes.array,
  previewTab: PropTypes.string.isRequired,
  dropdownOptions: PropTypes.array,
  currentItem: PropTypes.number.isRequired,
  gotoQuestion: PropTypes.func.isRequired,
  onCheckAnswer: PropTypes.func.isRequired,
  isFirst: PropTypes.func.isRequired,
  isLast: PropTypes.func.isRequired,
  moveToPrev: PropTypes.func.isRequired,
  moveToNext: PropTypes.func.isRequired,
  questions: PropTypes.object.isRequired,
  answerChecksUsedForItem: PropTypes.number.isRequired,
  settings: PropTypes.object.isRequired,
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
  min-height: 100vh;
  box-sizing: border-box;
  overflow-x: hidden;
  @media (max-width: ${IPAD_PORTRAIT_WIDTH}px) {
    padding: 174px 26px 0;
  }
  @media (max-width: ${IPAD_LANDSCAPE_WIDTH - 1}px) {
    justify-content: center;
  }
`;

const MainContent = styled.div`
  background-color: ${props => props.theme.widgets.assessmentPlayers.mainContentBgColor};
  color: ${props => props.theme.widgets.assessmentPlayers.mainContentTextColor};
  border-radius: 10px;
  height: 67vh;
  padding: 40px;
  text-align: left;
  font-size: 18px;
  overflow: auto;

  & * {
    -webkit-touch-callout: none;
    user-select: none;
  }

  @media (max-width: ${IPAD_PORTRAIT_WIDTH}px) {
    padding: 24px;
  }
`;

const MainWrapper = styled.div`
  width: ${({ theme, isSidebarVisible }) => {
    if (isSidebarVisible) {
      return ifZoomed(theme?.zoomLevel) ? "75%" : "80%";
    }
    return "95%";
  }};
  padding: ${({ theme, isSidebarVisible }) => {
    if (isSidebarVisible) {
      return ifZoomed(theme?.zoomLevel)
        ? `${120 - headerOffsetHashMap["xs"] + headerOffsetHashMap[(theme?.zoomLevel)]}px 100px`
        : "120px 100px";
    }
    return "120px 50px 100px 100px";
  }};
  @media (max-width: ${IPAD_PORTRAIT_WIDTH}px) {
    width: 100%;
  }
  @media (max-width: ${IPAD_LANDSCAPE_WIDTH - 1}px) {
    padding: 120px 0px;
  }
`;

const Sidebar = styled.div`
  width: ${({ theme, isVisible }) => {
    if (isVisible) {
      return ifZoomed(theme?.zoomLevel) ? "25%" : "20%";
    }
    return "5%";
  }};
  padding-top: ${({ theme }) => headerOffsetHashMap[(theme?.zoomLevel)]}px;
  padding-right: 20px;
  background-color: ${props => props.theme.widgets.assessmentPlayers.sidebarBgColor};
  color: ${props => props.theme.widgets.assessmentPlayers.sidebarTextColor};
  @media (max-width: ${IPAD_LANDSCAPE_WIDTH - 1}px) {
    display: none;
  }
`;
