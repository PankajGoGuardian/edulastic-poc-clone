/* eslint-disable react/prop-types */
import React, { useRef } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { connect } from "react-redux";

import { ScrollContext } from "@edulastic/common";
import { test } from "@edulastic/constants";
import TestItemPreview from "../../components/TestItemPreview";
import PlayerFooter from "./PlayerFooter";

import { IPAD_PORTRAIT_WIDTH, IPAD_LANDSCAPE_WIDTH, MAX_MOBILE_WIDTH } from "../../constants/others";
import { getEvaluationSelector } from "../../selectors/answers";
import getZoomedResponsiveWidth from "../../utils/zoomedResponsiveWidth";

const PlayerContentArea = ({
  itemRows,
  previewTab,
  currentItem,
  isFirst,
  isLast,
  moveToPrev,
  moveToNext,
  questions,
  t,
  unansweredQuestionCount,
  items,
  testItemState,
  setHighlights,
  setCrossAction,
  crossAction,
  previousQuestionActivities,
  playerSkinType = test.playerSkinValues.edulastic,
  isSidebarVisible = true,
  zoomLevel,
  windowWidth,
  activeMode,
  scratchPadMode,
  lineColor,
  deleteMode,
  lineWidth,
  fillColor,
  saveHistory,
  history,
  evaluation,
  enableMagnifier,
  changePreview
}) => {
  const scrollContainerRef = useRef();
  const item = items[currentItem];
  const isZoomApplied = zoomLevel > 1;
  const previousQuestionActivity = previousQuestionActivities[item._id];
  const responsiveWidth = getZoomedResponsiveWidth({ windowWidth, diff: 290, zoomLevel });

  return (
    <Main>
      <MainWrapper isSidebarVisible={isSidebarVisible} ref={scrollContainerRef}>
        {/* react-sortable-hoc is required getContainer for auto-scroll, so need to use ScrollContext here
            Also, will use ScrollContext for auto-scroll on mobile */}
        <ScrollContext.Provider value={{ getScrollElement: () => scrollContainerRef.current }}>
          <MainContent skin zoomed={isZoomApplied} zoomLevel={zoomLevel} responsiveWidth={responsiveWidth}>
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
                activeMode={activeMode}
                scratchPadMode={scratchPadMode}
                lineColor={lineColor}
                deleteMode={deleteMode}
                lineWidth={lineWidth}
                fillColor={fillColor}
                saveHistory={saveHistory}
                history={history}
                viewComponent="practicePlayer"
                enableMagnifier={enableMagnifier}
                updateScratchpadtoStore
              />
            )}
            {testItemState === "check" && (
              <TestItemPreview
                cols={itemRows}
                previewTab="check"
                preview="check"
                questions={questions}
                previousQuestionActivity={previousQuestionActivity}
                showCollapseBtn
                activeMode={activeMode}
                scratchPadMode={scratchPadMode}
                lineColor={lineColor}
                deleteMode={deleteMode}
                lineWidth={lineWidth}
                fillColor={fillColor}
                saveHistory={saveHistory}
                history={history}
                evaluation={evaluation}
                enableMagnifier={enableMagnifier}
                changePreviewTab={changePreview}
              />
            )}
          </MainContent>
        </ScrollContext.Provider>
        {playerSkinType.toLowerCase() === test.playerSkinValues.edulastic.toLowerCase() && (
          <PlayerFooter
            isLast={isLast}
            isFirst={isFirst}
            moveToNext={moveToNext}
            moveToPrev={moveToPrev}
            isSidebarVisible={isSidebarVisible}
            t={t}
            unansweredQuestionCount={unansweredQuestionCount}
          />
        )}
      </MainWrapper>
    </Main>
  );
};

PlayerContentArea.propTypes = {
  itemRows: PropTypes.array,
  previewTab: PropTypes.string.isRequired,
  currentItem: PropTypes.number.isRequired,
  isFirst: PropTypes.func.isRequired,
  isLast: PropTypes.func.isRequired,
  moveToPrev: PropTypes.func.isRequired,
  moveToNext: PropTypes.func.isRequired,
  questions: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired
};

PlayerContentArea.defaultProps = {
  itemRows: []
};

const mapStateToProps = (state, props) => ({
  evaluation: getEvaluationSelector(state, props)
});

export default connect(mapStateToProps)(PlayerContentArea);

const Main = styled.main`
  background-color: ${props => props.theme.widgets.assessmentPlayers.mainBgColor};
  display: flex;
  height: 100vh;
  box-sizing: border-box;
  overflow: hidden;
`;

const MainContent = styled.div`
  z-index: 1;
  background-color: ${props => props.theme.widgets.assessmentPlayers.mainContentBgColor};
  color: ${props => props.theme.widgets.assessmentPlayers.mainContentTextColor};
  border-radius: 10px;
  font-size: 18px;
  box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  display: flex;
  overflow: auto; /* need auto to show scroll for lengthy content https://snapwiz.atlassian.net/browse/EV-13508 */
  width: 100%;
  flex-direction: column;
  padding: ${({ zoomed, zoomLevel }) => {
    if (zoomed) {
      if (zoomLevel >= 1.5 && zoomLevel < 1.75) {
        return "20px";
      }
      if (zoomLevel >= 1.75 && zoomLevel < 2.5) {
        return "15px";
      }
      if (zoomLevel >= 2.5) {
        return "10px";
      }
      return "0";
    }
  }};
  ${({ zoomLevel, responsiveWidth }) => {
    const zoomed = zoomLevel > 1 && zoomLevel !== undefined;
    return `
      width: ${responsiveWidth}px;
      height: ${zoomed ? `${100 / zoomLevel}%` : "100%"};
      transform: ${zoomed ? `scale(${zoomLevel})` : ""};
      transform-origin: ${zoomed ? `top left` : ""};
    `;
  }};
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
  width: 100%;
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
