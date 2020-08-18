import React, { useRef } from "react";
import PropTypes from "prop-types";
import {
  Stimulus,
  QuestionNumberLabel,
  FlexContainer,
  QuestionLabelWrapper,
  QuestionSubLabel,
  QuestionContentWrapper
} from "@edulastic/common";

import { PREVIEW } from "../../constants/constantsForQuestions";
import { PreviewContainer } from "./styled/PreviewContainer";
import DEFAULT_IMAGE from "../../assets/highlightImageBackground.svg";
import { s3ImageBucketPath } from "../../../config";
import Instructions from "../../components/Instructions";
import { Scratchpad, ScratchpadTool } from "../../../common/components/Scratchpad";
import { ImageContainer } from "./styled/ImageContainer";
import { Image } from "./styled/Image";

const HighlightImagePreview = ({
  view,
  item = {},
  smallSize,
  showQuestionNumber,
  viewComponent,
  clearClicked,
  hideInternalOverflow
}) => {
  const containerRef = useRef();
  const { image = {} } = item;

  const { width = 0, height = 0 } = image;

  const imageContainerDimensions = {
    width: Math.max(image.x + width + 10, 700),
    height: Math.max(image.y + height + 10, 600)
  };

  const altText = image ? image.altText : "";
  const file = image ? image.source : "";

  const CDN_IMAGE_PATH = `${s3ImageBucketPath}/highlight_image_background.svg`;
  // <div style={{ width: "100%", height: "100%", zoom: theme?.widgets?.highlightImage?.imageZoom }}>
  const renderImage = () => (
    <Image
      src={file || CDN_IMAGE_PATH || DEFAULT_IMAGE}
      width={width}
      height={height}
      x={image.x}
      y={image.y}
      alt={altText}
      draggable="false"
    />
  );

  const showDrawing = viewComponent === "editQuestion";

  return (
    <React.Fragment value={{ getContainer: () => containerRef.current }}>
      {showDrawing && <ScratchpadTool />}
      <PreviewContainer
        hideInternalOverflow={hideInternalOverflow || viewComponent === "authorPreviewPopup"}
        padding={smallSize}
        ref={containerRef}
        boxShadow={smallSize ? "none" : ""}
      >
        {showDrawing && <Scratchpad clearClicked={clearClicked} hideTools disableResize />}
        <FlexContainer justifyContent="flex-start" alignItems="baseline">
          <QuestionLabelWrapper>
            {showQuestionNumber && <QuestionNumberLabel>{item.qLabel}</QuestionNumberLabel>}
            {item.qSubLabel && <QuestionSubLabel>({item.qSubLabel})</QuestionSubLabel>}
          </QuestionLabelWrapper>
          <QuestionContentWrapper>
            {view === PREVIEW && !smallSize && <Stimulus dangerouslySetInnerHTML={{ __html: item.stimulus }} />}
            <ImageContainer width={imageContainerDimensions.width} height={imageContainerDimensions.height}>
              {renderImage()}
            </ImageContainer>
          </QuestionContentWrapper>
        </FlexContainer>
      </PreviewContainer>
      <Instructions item={item} />
    </React.Fragment>
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

export default HighlightImagePreview;
