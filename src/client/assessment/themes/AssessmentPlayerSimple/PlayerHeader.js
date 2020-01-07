/* eslint-disable react/prop-types */
import React, { Fragment, useState } from "react";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import { connect } from "react-redux";
import { get } from "lodash";
import { Tooltip } from "../../../common/utils/helpers";
import styled from "styled-components";

import { nonAutoGradableTypes } from "@edulastic/constants";
import { withWindowSizes } from "@edulastic/common";

import {
  Header,
  FlexContainer,
  HeaderWrapper,
  HeaderMainMenu,
  TestButton,
  ToolButton,
  SaveAndExit,
  LogoCompact,
  ToolBar,
  ToolTipContainer,
  MainActionWrapper
} from "../common";

import { MAX_MOBILE_WIDTH, IPAD_LANDSCAPE_WIDTH } from "../../constants/others";

import SettingsModal from "../../../student/sharedComponents/SettingsModal";
import QuestionSelectDropdown from "../common/QuestionSelectDropdown";
import { isZoomGreator } from "../../../common/utils/helpers";
import ToolbarModal from "../common/ToolbarModal";
import { smallDesktopWidth, extraDesktopWidthMax, mediumDesktopExactWidth } from "@edulastic/colors";

const PlayerHeader = ({
  title,
  dropdownOptions,
  currentItem,
  onOpenExitPopup,
  theme,
  gotoQuestion,
  settings,
  windowWidth,
  items,
  answerChecksUsedForItem,
  checkAnswer,
  toggleBookmark,
  isBookmarked,
  onshowHideHints,
  toggleToolsOpenStatus,
  toolsOpenStatus,
  headerRef,
  previewPlayer
}) => {
  const [isToolbarModalVisible, setToolbarModalVisible] = useState(false);

  const calcBrands = ["DESMOS", "GEOGEBRASCIENTIFIC"];
  const showSettingIcon = windowWidth < IPAD_LANDSCAPE_WIDTH || isZoomGreator("md", theme.zoomLevel);
  let isNonAutoGradable = false;
  const item = items[currentItem];
  if (item.data && item.data.questions) {
    item.data.questions.forEach(question => {
      if (nonAutoGradableTypes.includes(question.type)) {
        isNonAutoGradable = true;
      }
    });
  }

  const isMobile = windowWidth <= MAX_MOBILE_WIDTH;
  const rightButtons = <SaveAndExit previewPlayer={previewPlayer} finishTest={onOpenExitPopup} />;

  return (
    <Fragment>
      <ToolbarModal
        isVisible={isToolbarModalVisible}
        onClose={() => setToolbarModalVisible(false)}
        checkAnswer={checkAnswer}
        windowWidth={windowWidth}
        answerChecksUsedForItem={answerChecksUsedForItem}
        settings={settings}
        items={items}
        currentItem={currentItem}
        isNonAutoGradable={isNonAutoGradable}
        checkAnswer={checkAnswer}
        toggleBookmark={() => toggleBookmark(item._id)}
        isBookmarked={isBookmarked}
        handletoggleHints={onshowHideHints}
        changeTool={toggleToolsOpenStatus}
      />
      <SettingsModal />
      <Header ref={headerRef}>
        <HeaderMainMenu skinb="true">
          <HeaderPracticePlayer>
            <HeaderWrapper justifyContent="space-between">
              <LogoCompact isMobile={isMobile} buttons={rightButtons} title={title} />
              <MainActionWrapper>
                {isMobile && (
                  <QuestionSelectDropdown
                    key={currentItem}
                    currentItem={currentItem}
                    gotoQuestion={gotoQuestion}
                    options={dropdownOptions}
                    skinb="true"
                  />
                )}
                {showSettingIcon && (
                  <ToolTipContainer>
                    <Tooltip placement="top" title="Tool">
                      <ToolButton
                        next
                        skin
                        size="large"
                        type="primary"
                        icon="tool"
                        data-cy="setting"
                        onClick={() => setToolbarModalVisible(true)}
                      />
                    </Tooltip>
                  </ToolTipContainer>
                )}
                {!showSettingIcon && (
                  <TestButton
                    answerChecksUsedForItem={answerChecksUsedForItem}
                    settings={settings}
                    items={items}
                    currentItem={currentItem}
                    isNonAutoGradable={isNonAutoGradable}
                    checkAnswer={checkAnswer}
                    toggleBookmark={() => toggleBookmark(item._id)}
                    isBookmarked={isBookmarked}
                    handletoggleHints={onshowHideHints}
                  />
                )}
                {!showSettingIcon && (
                  <ToolBar
                    settings={settings}
                    calcBrands={calcBrands}
                    tool={toolsOpenStatus}
                    changeCaculateMode={() => {}}
                    changeTool={toggleToolsOpenStatus}
                    qType={get(items, `[${currentItem}].data.questions[0].type`, null)}
                  />
                )}
              </MainActionWrapper>
              {!isMobile && rightButtons}
            </HeaderWrapper>
          </HeaderPracticePlayer>
        </HeaderMainMenu>
      </Header>
    </Fragment>
  );
};

PlayerHeader.defaultProps = {
  onSaveProgress: () => {}
};

const enhance = compose(
  withRouter,
  withWindowSizes,
  connect(
    state => ({
      settings: state.test.settings
    }),
    null
  )
);

export default enhance(PlayerHeader);

const HeaderPracticePlayer = styled(FlexContainer)`
  padding: 12px 0px;
  justify-content: space-between;

  @media (min-width: ${mediumDesktopExactWidth}) {
    padding: 11px 0px;
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    padding: 8.5px 0px;
  }
  @media (max-width: ${MAX_MOBILE_WIDTH}px) {
    padding: 0px;
  }
`;
