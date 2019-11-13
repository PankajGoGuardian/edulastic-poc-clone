/* eslint-disable react/prop-types */
import React, { Fragment } from "react";
import { Header, FlexContainer, LogoCompact, HeaderMainMenu, HeaderWrapper, SaveAndExit } from "../common";
import { MAX_MOBILE_WIDTH } from "../../constants/others";

const PlayerHeader = ({ title, onOpenExitPopup, zoomLevel, windowWidth, onSubmit }) => {
  const isZoomApplied = zoomLevel > "1";
  const isMobile = windowWidth <= MAX_MOBILE_WIDTH;

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

  const rightButtons = <SaveAndExit previewPlayer showZoomBtn finishTest={onOpenExitPopup} onSubmit={onSubmit} />;

  return (
    <Fragment>
      <Header>
        <HeaderMainMenu skinb="true">
          <FlexContainer>
            <HeaderWrapper style={zoomStyle}>
              <LogoCompact isMobile={isMobile} buttons={rightButtons} title={title} />
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
