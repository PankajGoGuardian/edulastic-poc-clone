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

const { calculatorTypes } = test;

const PlayerHeader = ({
  title,
  onOpenExitPopup,
  windowWidth,
  onSubmit,
  previewPlayer,
  settings,
  currentToolMode,
  onChangeTool
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
