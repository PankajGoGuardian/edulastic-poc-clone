import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import {
  Stimulus,
  QuestionNumberLabel,
  FlexContainer,
  QuestionLabelWrapper,
  QuestionSubLabel,
  QuestionContentWrapper,
} from '@edulastic/common'
import { max } from 'lodash'
import { PREVIEW } from '../../constants/constantsForQuestions'
import { PreviewContainer } from './styled/PreviewContainer'
import DEFAULT_IMAGE from '../../assets/highlightImageBackground.svg'
import { s3ImageBucketPath } from '../../../config'
import Instructions from '../../components/Instructions'
import {
  Scratchpad,
  ScratchpadTool,
} from '../../../common/components/Scratchpad'
import { ImageContainer } from './styled/ImageContainer'
import { Image } from './styled/Image'

const HighlightImagePreview = ({
  view,
  item = {},
  smallSize,
  showQuestionNumber,
  viewComponent,
  clearClicked,
  isStudentReport,
  isLCBView,
  isExpressGrader,
  saveUserWork,
  LCBPreviewModal,
  userWork,
  disableResponse,
  scratchpadDimensions,
  colWidth,
  scratchPadMode,
  isStudentAttempt,
}) => {
  const containerRef = useRef()
  const { image = {} } = item
  const { width = 0, height = 0 } = image

  const imageContainerDimensions = {
    width: max([image.x + width + 10, 700]),
    height: max([image.y + height + 10, 600]),
  }

  const altText = image ? image.altText : ''
  const file = image ? image.source : ''

  const CDN_IMAGE_PATH = `${s3ImageBucketPath}/highlight_image_background.svg`
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
  )

  const readyOnlyScratchpad = isStudentReport || isLCBView || LCBPreviewModal
  let showDrawing =
    isLCBView ||
    isStudentReport ||
    isExpressGrader ||
    viewComponent === 'editQuestion' ||
    scratchPadMode

  if (showDrawing && !isStudentAttempt) {
    if (isExpressGrader && !disableResponse) {
      showDrawing = true
    } else {
      // show scratchpad only if there is data
      //  in teacher view (LCB, ExpressGrader, etc)
      showDrawing = !!userWork
    }
  }

  const showToolBar =
    (showDrawing && !readyOnlyScratchpad && !disableResponse) ||
    (!disableResponse && isExpressGrader)

  const scratchpadWidth = max([
    containerRef.current?.clientWidth,
    imageContainerDimensions.width + 51, // 51 is current question label width,
    scratchpadDimensions?.width,
  ])

  return (
    <>
      {showToolBar && <ScratchpadTool />}
      <PreviewContainer
        padding={smallSize}
        ref={containerRef}
        data-cy="drawing-response-preview"
        boxShadow={smallSize ? 'none' : ''}
      >
        {showDrawing && (
          <Scratchpad
            hideTools
            clearClicked={clearClicked}
            readOnly={readyOnlyScratchpad}
            dimensions={{
              width: scratchpadWidth,
              height: scratchpadDimensions?.height,
            }}
            saveData={saveUserWork}
            conatinerWidth={colWidth}
            data={userWork}
          />
        )}
        <FlexContainer justifyContent="flex-start" alignItems="baseline">
          <QuestionLabelWrapper>
            {showQuestionNumber && (
              <QuestionNumberLabel>{item.qLabel}</QuestionNumberLabel>
            )}
            {item.qSubLabel && (
              <QuestionSubLabel>({item.qSubLabel})</QuestionSubLabel>
            )}
          </QuestionLabelWrapper>
          <QuestionContentWrapper>
            {view === PREVIEW && !smallSize && (
              <Stimulus dangerouslySetInnerHTML={{ __html: item.stimulus }} />
            )}
            <ImageContainer
              width={imageContainerDimensions.width}
              height={imageContainerDimensions.height}
            >
              {renderImage()}
            </ImageContainer>
          </QuestionContentWrapper>
        </FlexContainer>
      </PreviewContainer>
      <Instructions item={item} />
    </>
  )
}

HighlightImagePreview.propTypes = {
  smallSize: PropTypes.bool,
  item: PropTypes.object.isRequired,
  view: PropTypes.string.isRequired,
  viewComponent: PropTypes.string.isRequired,
  showQuestionNumber: PropTypes.bool,
  clearClicked: PropTypes.bool,
}

HighlightImagePreview.defaultProps = {
  showQuestionNumber: false,
  clearClicked: false,
  smallSize: false,
}

export default HighlightImagePreview
