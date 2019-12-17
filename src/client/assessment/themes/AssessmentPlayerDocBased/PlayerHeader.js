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
import { Tooltip } from "antd";
import { Container, StyledButton, CaculatorIcon } from "../common/ToolBar";
import { MAX_MOBILE_WIDTH } from "../../constants/others";

const { calculatorTypes } = test;

const PlayerHeader = ({
  title,
  onOpenExitPopup,
  zoomLevel,
  windowWidth,
  onSubmit,
  previewPlayer,
  settings,
  currentToolMode,
  onChangeTool
}) => {
  const isZoomApplied = zoomLevel > "1";
  const isMobile = windowWidth <= MAX_MOBILE_WIDTH;
  const { calcType } = settings;

  let headerZoom = 1;
  if (isZoomApplied) {
    headerZoom = zoomLevel >= "1.75" ? "1.35" : "1.25";
  }

  const zoomStyle = {
    transform: `scale(${headerZoom})`, // maxScale of 1.5 to header
    transformOrigin: "0px 0px",
    width: isZoomApplied ? `${zoomLevel >= "1.75" ? "75" : "80"}%` : "100%",
    padding: `${isZoomApplied ? (zoomLevel >= "1.75" ? "10px 10px 40px" : "10px 5px 25px 5px") : "12px 0px"}`,
    justifyContent: "space-between"
  };

  if (isMobile) {
    zoomStyle.padding = 0;
  }

  const rightButtons = (
    <SaveAndExit
      previewPlayer={previewPlayer}
      finishTest={onOpenExitPopup}
      onSubmit={!previewPlayer ? onSubmit : null}
    />
  );

  return (
    <Fragment>
      <Header>
        <HeaderMainMenu skinb="true">
          <FlexContainer>
            <HeaderWrapper style={zoomStyle}>
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
