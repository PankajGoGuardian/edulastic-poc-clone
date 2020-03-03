import React from "react";
import {
  ControlBtn,
  ToolButton,
  Header,
  HeaderWrapper,
  FlexContainer,
  TestButton,
  ToolBar,
  SaveAndExit,
  ToolTipContainer,
  MainActionWrapper,
  LogoCompact,
  CustomAffix
} from "../common";
import HeaderMainMenu from "../common/HeaderMainMenu";
import QuestionSelectDropdown from "../common/QuestionSelectDropdown";
import { Tooltip } from "../../../common/utils/helpers";

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
  finishTest
}) => {
  const rightButtons = (
    <SaveAndExit previewPlayer={previewPlayer} showZoomBtn finishTest={finishTest} />
  );

  return (
    <CustomAffix>
      <Header LCBPreviewModal={LCBPreviewModal}>
        <HeaderMainMenu skin style={{ height: headerHeight }}>
          <FlexContainer style={headerStyleWidthZoom}>
            <HeaderWrapper justifyContent="space-between">
              <MainActionWrapper>
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
                          moveToPrev();
                          e.target.blur();
                        }}
                      />
                    </Tooltip>
                    <Tooltip placement="top" title="Next" overlayStyle={overlayStyle}>
                      <ControlBtn.Next
                        next
                        skin
                        type="primary"
                        data-cy="next"
                        icon="right"
                        onClick={e => {
                          moveToNext();
                          e.target.blur();
                        }}
                      >
                        Next
                      </ControlBtn.Next>
                    </Tooltip>
                  </>
                )}
              </MainActionWrapper>
              <MainActionWrapper>
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
                    {!showSettingIcon && (
                      <ToolBar
                        settings={settings}
                        calcBrands={calcBrands}
                        tool={currentToolMode}
                        changeCaculateMode={changeCaculateMode}
                        changeTool={changeTool}
                        qType={qType}
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
