import React from "react";
import { IconSend } from "@edulastic/icons";
import { Tooltip } from "../../../common/utils/helpers";
import {
  ControlBtn,
  CustomAffix,
  FlexContainer,
  Header,
  HeaderWrapper,
  LogoCompact,
  MainActionWrapper,
  SaveAndExit,
  TestButton,
  ToolBar,
  ToolButton,
  ToolTipContainer
} from "../common";
import HeaderMainMenu from "../common/HeaderMainMenu";
import QuestionSelectDropdown from "../common/QuestionSelectDropdown";

const PlayerHeader = ({
  LCBPreviewModal,
  headerHeight,
  isMobile,
  currentItem,
  gotoQuestion,
  options,
  bookmarks,
  skipped,
  dropdownStyle,
  zoomLevel,
  overlayStyle,
  disabled,
  isLast,
  moveToPrev,
  moveToNext,
  showSettingIcon,
  answerChecksUsedForItem,
  settings,
  items,
  isNonAutoGradable,
  checkAnswer,
  toggleBookmark,
  isBookmarked,
  handletoggleHints,
  onClickSetting,
  calcBrands,
  tool: currentToolMode,
  changeCaculateMode,
  changeTool,
  qType,
  previewPlayer,
  headerStyleWidthZoom,
  finishTest,
  handleMagnifier,
  enableMagnifier,
  timedAssignment,
  utaId,
  groupId
}) => {
  const rightButtons = (
    <SaveAndExit
      timedAssignment={timedAssignment}
      utaId={utaId}
      groupId={groupId}
      previewPlayer={previewPlayer}
      showZoomBtn
      finishTest={finishTest}
    />
  );

  return (
    <CustomAffix>
      <Header LCBPreviewModal={LCBPreviewModal}>
        <HeaderMainMenu skin style={{ height: headerHeight }}>
          <FlexContainer style={headerStyleWidthZoom}>
            <HeaderWrapper justifyContent="space-between">
              <MainActionWrapper style={{ alignItems: "center" }}>
                <LogoCompact isMobile={isMobile} buttons={rightButtons} />
                {!LCBPreviewModal && (
                  <>
                    <QuestionSelectDropdown
                      key={currentItem}
                      currentItem={currentItem}
                      gotoQuestion={gotoQuestion}
                      options={options}
                      bookmarks={bookmarks}
                      skipped={skipped}
                      dropdownStyle={dropdownStyle}
                      zoomLevel={zoomLevel}
                      moveToNext={moveToNext}
                      utaId={utaId}
                    />
                    <Tooltip placement="top" title="Previous" overlayStyle={overlayStyle}>
                      <ControlBtn.Back
                        prev
                        skin
                        data-cy="prev"
                        type="primary"
                        icon="left"
                        disabled={disabled}
                        onClick={e => {
                          moveToPrev(null, true);
                          e.target.blur();
                        }}
                      />
                    </Tooltip>
                    <ControlBtn.Next
                      next
                      skin
                      type="primary"
                      data-cy="next"
                      icon={isLast ? null : "right"}
                      onClick={e => {
                        moveToNext();
                        e.target.blur();
                      }}
                    >
                      {isLast && <IconSend />}
                      {isLast ? "SUBMIT" : "NEXT"}
                    </ControlBtn.Next>
                  </>
                )}
                {!showSettingIcon && (
                  <TestButton
                    answerChecksUsedForItem={answerChecksUsedForItem}
                    settings={settings}
                    items={items}
                    currentItem={currentItem}
                    isNonAutoGradable={isNonAutoGradable}
                    checkAnswer={checkAnswer}
                    toggleBookmark={toggleBookmark}
                    isBookmarked={isBookmarked}
                    handletoggleHints={handletoggleHints}
                  />
                )}
                {!LCBPreviewModal && (
                  <ToolTipContainer>
                    {showSettingIcon && (
                      <Tooltip placement="top" title="Tool" overlayStyle={overlayStyle}>
                        <ToolButton
                          next
                          skin
                          size="large"
                          type="primary"
                          icon="tool"
                          data-cy="setting"
                          onClick={onClickSetting}
                        />
                      </Tooltip>
                    )}
                    {!showSettingIcon && (
                      <ToolBar
                        settings={settings}
                        calcBrands={calcBrands}
                        tool={currentToolMode}
                        changeCaculateMode={changeCaculateMode}
                        changeTool={changeTool}
                        qType={qType}
                        handleMagnifier={handleMagnifier}
                        enableMagnifier={enableMagnifier}
                        timedAssignment={timedAssignment}
                        utaId={utaId}
                        groupId={groupId}
                      />
                    )}
                  </ToolTipContainer>
                )}
              </MainActionWrapper>
              {!isMobile && rightButtons}
            </HeaderWrapper>
          </FlexContainer>
        </HeaderMainMenu>
      </Header>
    </CustomAffix>
  );
};

export default PlayerHeader;
