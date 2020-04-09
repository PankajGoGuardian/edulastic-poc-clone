/* eslint-disable react/prop-types */
import React, { Fragment } from "react";
import { test } from "@edulastic/constants";
import {
  Header,
  FlexContainer,
  LogoCompact,
  HeaderMainMenu,
  HeaderWrapper,
  SaveAndExit,
  MainActionWrapper
} from "../common";
import { Tooltip } from "../../../common/utils/helpers";
import { Container, StyledButton, CaculatorIcon } from "../common/ToolBar";
import { MAX_MOBILE_WIDTH } from "../../constants/others";
import { IconSearch } from "@edulastic/icons";
import TimedTestTimer from "../common/TimedTestTimer";

const { calculatorTypes } = test;

const PlayerHeader = ({
  title,
  onOpenExitPopup,
  windowWidth,
  onSubmit,
  previewPlayer,
  settings,
  currentToolMode,
  onChangeTool,
  handleMagnifier,
  enableMagnifier,
  showMagnifier,
  timedAssignment,
  utaId,
  groupId
}) => {
  const isMobile = windowWidth <= MAX_MOBILE_WIDTH;
  const { calcType } = settings;

  const rightButtons = (
    <SaveAndExit
      previewPlayer={previewPlayer}
      finishTest={onOpenExitPopup}
      onSubmit={!previewPlayer ? onSubmit : null}
    />
  );

  const headerStyle = {
    height: "70px",
    justifyContent: "space-between",
    alignItems: "center"
  };

  return (
    <Fragment>
      <Header>
        <HeaderMainMenu skinb="true">
          <FlexContainer>
            <HeaderWrapper headerStyle={headerStyle}>
              <LogoCompact isMobile={isMobile} buttons={rightButtons} title={title} />
              <MainActionWrapper>
                <Container>
                  {calcType !== calculatorTypes.NONE && (
                    <Tooltip placement="top" title="Calculator">
                      <StyledButton active={currentToolMode.calculator} onClick={() => onChangeTool("calculator")}>
                        <CaculatorIcon />
                      </StyledButton>
                    </Tooltip>
                  )}
                  {showMagnifier && (
                    <Tooltip placement="top" title="Magnify">
                      <StyledButton active={enableMagnifier} onClick={handleMagnifier}>
                        <IconSearch />
                      </StyledButton>
                    </Tooltip>
                  )}
                  {timedAssignment && <TimedTestTimer utaId={utaId} groupId={groupId} />}
                </Container>
              </MainActionWrapper>
              {!isMobile && rightButtons}
            </HeaderWrapper>
          </FlexContainer>
        </HeaderMainMenu>
      </Header>
    </Fragment>
  );
};

PlayerHeader.defaultProps = {
  onSaveProgress: () => {}
};

export default PlayerHeader;
