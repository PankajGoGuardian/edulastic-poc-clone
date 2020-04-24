/* eslint-disable react/prop-types */
import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import {
  Stimulus,
  withWindowSizes,
  ScratchPadContext,
  QuestionNumberLabel,
  FlexContainer,
  QuestionLabelWrapper,
  QuestionSubLabel,
  QuestionContentWrapper
} from "@edulastic/common";

import { withTheme } from "styled-components";
import { withNamespaces } from "@edulastic/localization";

import { PREVIEW } from "../../constants/constantsForQuestions";
import Scratch from "../../components/Scratch";
import { PreviewContainer } from "./styled/PreviewContainer";
import DEFAULT_IMAGE from "../../assets/highlightImageBackground.svg";
import { s3ImageBucketPath } from "../../../config";

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

  const showDrawing = viewComponent === "editQuestion";

  const ResolvedWrapper = showDrawing ? ScratchPadContext.Provider : React.Fragment;

  return (
    <ResolvedWrapper value={{ getContainer: () => containerRef.current }}>
      <PreviewContainer
        hideInternalOverflow={hideInternalOverflow || viewComponent === "authorPreviewPopup"}
        padding={smallSize}
        ref={containerRef}
        boxShadow={smallSize ? "none" : ""}
      >
        {showDrawing && <Scratch viewComponent={viewComponent} clearClicked={clearClicked} />}

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
    </ResolvedWrapper>
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
