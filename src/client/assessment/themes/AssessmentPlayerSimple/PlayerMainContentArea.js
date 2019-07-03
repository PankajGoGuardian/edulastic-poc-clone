import React, { useRef } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import TestItemPreview from "../../components/TestItemPreview";
import SidebarQuestionList from "./PlayerSideBar";
import PlayerFooter from "./PlayerFooter";
import DragScrollContainer from "../../components/DragScrollContainer";

import { IPAD_PORTRAIT_WIDTH } from "../../constants/others";

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
  t
}) => {
  const scrollElementRef = useRef(null);
  return (
    <Main skinB="true">
      <MainWrapper>
        {scrollElementRef.current && <DragScrollContainer scrollWrraper={scrollElementRef.current} />}
        <MainContent innerRef={scrollElementRef}>
          <TestItemPreview cols={itemRows} previewTab={previewTab} questions={questions} />
        </MainContent>
        <PlayerFooter
          isLast={isLast}
          isFirst={isFirst}
          moveToNext={moveToNext}
          moveToPrev={moveToPrev}
          onCheckAnswer={onCheckAnswer}
          answerChecksUsedForItem={answerChecksUsedForItem}
          settings={settings}
          t={t}
        />
      </MainWrapper>
      <Sidebar>
        <SidebarQuestionList questions={dropdownOptions} selectedQuestion={currentItem} gotoQuestion={gotoQuestion} />
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
  background-color: ${props => props.theme.mainBgColor};
  padding: 110px 0 0 140px;
  display: flex;
  flex-direction: row;
  min-height: 100vh;
  box-sizing: border-box;
  @media (max-width: ${IPAD_PORTRAIT_WIDTH}px) {
    padding: 174px 26px 0;
  }
`;

const MainWrapper = styled.div`
  flex: 4;
  @media (max-width: ${IPAD_PORTRAIT_WIDTH}px) {
    width: 100%;
  }
`;

const MainContent = styled.div`
  background-color: ${props => props.theme.mainContentBgColor};
  color: ${props => props.theme.mainContentTextColor};
  border-radius: 10px;
  height: 600px;
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
const Sidebar = styled.div`
  flex: 1;
  background-color: ${props => props.theme.sidebarBgColor};
  color: ${props => props.theme.sidebarTextColor};
  @media (max-width: ${IPAD_PORTRAIT_WIDTH}px) {
    display: none;
  }
`;
