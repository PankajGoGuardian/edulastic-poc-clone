/* eslint-disable react/prop-types */
import React, { useRef, useEffect, useState, useContext, Fragment } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";

import {
  Stimulus,
  withWindowSizes,
  ScratchPadContext,
  QuestionNumberLabel,
  ScrollContext,
  FlexContainer,
  QuestionLabelWrapper,
  QuestionSubLabel,
  QuestionContentWrapper
} from "@edulastic/common";

import get from "lodash/get";
import { withTheme } from "styled-components";
import { withNamespaces } from "@edulastic/localization";

import { PREVIEW } from "../../constants/constantsForQuestions";

import { PreviewContainer } from "./styled/PreviewContainer";
import DEFAULT_IMAGE from "../../assets/highlightImageBackground.svg";
import { s3ImageBucketPath } from "../../../config";

import getScratchComponents from "./Scratch";

const HighlightImagePreview = ({
  view,
  item = {},
  smallSize,
  showQuestionNumber,
  theme,
  viewComponent,
  clearClicked,
  hideInternalOverflow
}) => {
  const containerRef = useRef();
  const { image } = item;
  const [width] = useState(image ? `${image.width}px` : "auto");
  const [height] = useState(image ? `${image.height}px` : 470);
  const altText = image ? image.altText : "";
  const file = image ? image.source : "";

  const CDN_IMAGE_PATH = `${s3ImageBucketPath}/highlight_image_background.svg`;

  const renderImage = () => (
    <div style={{ width: "100%", height: "100%", zoom: theme?.widgets?.highlightImage?.imageZoom }}>
      <img src={file || CDN_IMAGE_PATH || DEFAULT_IMAGE} alt={altText} style={{ width, height }} draggable="false" />
    </div>
  );

  const { getScrollElement } = useContext(ScrollContext);
  const scrollContainerElement = getScrollElement();

  useEffect(() => {
    // intially, scroll container is window object at author preview
    // style wont be available for the window object
    if (scrollContainerElement?.style) {
      scrollContainerElement.style.marginLeft = "58px";
      scrollContainerElement.style.width = "calc(100% - 58px)";
    }
  }, [scrollContainerElement]);

  const [DrawingTool, DrawingPannel] = getScratchComponents({ clearClicked });
  const left = get(scrollContainerElement, "offsetLeft", 0) - 48;
  const top = get(scrollContainerElement, "offsetTop", 0);

  const showDrawing = viewComponent === "editQuestion" || viewComponent === "authorPreviewPopup";
  return (
    <Fragment>
      <ScratchPadContext.Provider value={{ getContainer: () => containerRef.current }}>
        {showDrawing && <DrawingTool left={left} top={top} />}
        <PreviewContainer
          hideInternalOverflow={hideInternalOverflow}
          padding={smallSize}
          boxShadow={smallSize ? "none" : ""}
          ref={containerRef}
        >
          {showDrawing && <DrawingPannel />}
          <FlexContainer justifyContent="flex-start" alignItems="baseline">
            <QuestionLabelWrapper>
              {showQuestionNumber && <QuestionNumberLabel>{item.qLabel}</QuestionNumberLabel>}
              {item.qSubLabel && <QuestionSubLabel>({item.qSubLabel})</QuestionSubLabel>}
            </QuestionLabelWrapper>
            <QuestionContentWrapper>
              {view === PREVIEW && !smallSize && <Stimulus dangerouslySetInnerHTML={{ __html: item.stimulus }} />}
              {renderImage()}
            </QuestionContentWrapper>
          </FlexContainer>
        </PreviewContainer>
      </ScratchPadContext.Provider>
    </Fragment>
  );
};

HighlightImagePreview.propTypes = {
  smallSize: PropTypes.bool,
  item: PropTypes.object.isRequired,
  view: PropTypes.string.isRequired,
  viewComponent: PropTypes.string.isRequired,
  showQuestionNumber: PropTypes.bool,
  clearClicked: PropTypes.bool
};

HighlightImagePreview.defaultProps = {
  showQuestionNumber: false,
  clearClicked: false,
  smallSize: false
};

const enhance = compose(
  withWindowSizes,
  withNamespaces("assessment"),
  withTheme
);

export default enhance(HighlightImagePreview);
