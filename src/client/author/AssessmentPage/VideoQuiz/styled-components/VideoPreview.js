import {
  extraDesktopWidthMax,
  mediumDesktopExactWidth,
  themeColor,
  white,
} from '@edulastic/colors'
import { DragDrop } from '@edulastic/common'
import ReactPlayer from 'react-player'
import styled from 'styled-components'
// import { Player } from 'video-react'
import { Row, Typography } from 'antd'
import MessageIcon from '../../components/PDFAnnotationTools/static/cursor-comment.svg'
import ImageIcon from '../../components/PDFAnnotationTools/static/cursor-image.svg'
import EditIcon from '../../components/PDFAnnotationTools/static/cursor-pencil.svg'
import VideoIcon from '../../components/PDFAnnotationTools/static/cursor-video.svg'

const { DropContainer } = DragDrop

export const PDFPreviewWrapper = styled.div`
  position: relative;
  padding-right: 0px;
  padding-left: 0px;
  padding-bottom: ${(props) =>
    props.testMode ? '36px' : props.review ? '60px' : '36px'};
  overflow-y: hidden;
  width: 100%;
  transition: padding 0.2s ease-in;

  .scrollbar-container {
    border-radius: 5px;
  }

  height: ${(props) =>
    `calc(100vh - ${
      props.testMode
        ? '70'
        : props.reportMode
        ? props.theme.HeaderHeight.xs + 41
        : props.theme.HeaderHeight.xs
    }px) - 43px`};
  .scrollbar-container {
    border-radius: 5px;
  }

  @media (min-width: ${mediumDesktopExactWidth}) {
    height: ${(props) =>
      `calc(100vh - ${
        props.testMode
          ? '70'
          : props.reportMode
          ? props.theme.HeaderHeight.md + 41
          : props.theme.HeaderHeight.md
      }px) - 43px`};
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    height: ${(props) =>
      `calc(100vh - ${
        props.testMode
          ? '70'
          : props.reportMode
          ? props.theme.HeaderHeight.xl + 41
          : props.theme.HeaderHeight.xl
      }px) - 43px`};
  }

  .drag-tool-selected * {
    cursor: move !important;
  }
  .draw-tool-selected * {
    cursor: url(${EditIcon}) 0 15, auto !important;
  }
  .video-tool-selected * {
    cursor: url(${VideoIcon}) 12 10, auto !important;
  }
  .image-tool-selected * {
    cursor: url(${ImageIcon}) 12 10, auto !important;
  }
  .point-tool-selected * {
    cursor: url(${MessageIcon}) 12 10, auto !important;
  }

  .area-tool-selected *,
  .mask-tool-selected * {
    cursor: crosshair !important;
  }
  .highlight-tool-selected *,
  .strikeout-tool-selected *,
  .text-tool-selected * {
    cursor: text !important;
  }
`

export const Preview = styled.div`
  min-height: 90vh;
  width: 100%;
  background: ${white};
  position: relative;
  box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.15);
  @media (min-width: ${mediumDesktopExactWidth}) {
    width: 99%;
  }
`

export const ZoomControlCotainer = styled.div`
  position: fixed;
  bottom: 70px;
  margin-left: -12px;
  display: flex;
  flex-direction: column;
  z-index: 1;

  svg {
    fill: ${white};
    &:hover {
      fill: ${white};
    }
  }
`

export const PDFZoomControl = styled.div`
  background: ${themeColor};
  width: 30px;
  height: 30px;
  font-size: 28px;
  font-weight: bolder;
  border-radius: 50%;
  color: ${white};
  display: flex;
  line-height: 0px;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  user-select: none;
  margin-bottom: 5px;
`

export const AnnotationsContainer = styled.div`
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  position: absolute;
`

export const Droppable = styled(DropContainer)`
  top: 0;
  height: calc(100% - 60px);
  width: 100%;
  display: block;
  margin: auto;
  position: relative;
`

export const StyledReactPlayer = styled(ReactPlayer)`
  pointer-events: none !important;
`
export const StyledYouTubePlayer = styled.div`
  pointer-events: none !important;
  height: 100%;
  width: 100%;
`

export const StyledPlayerContainer = styled(Row)`
  position: ${({ viewMode }) =>
    viewMode === 'edit' ? 'absolute' : 'relative'};
  bottom: 0px;
  width: 100%;
  padding: 14px 16px 10px 16px;
  margin: 0px !important;
  z-index: 5;
  background: #000000a3;
`

export const StyledTypographyText = styled(Typography.Text)`
  line-height: 40px;
  color: white;
`

export const RelativeContainer = styled.div`
  height: 100%;
  position: relative;
`

export const BigPlayButton = styled.span`
  svg {
    position: absolute !important;
    top: 50% !important;
    height: 100px !important;
    width: 100% !important;
    left: 50% !important;
    transform: translate(-50%, -50%) !important;
    z-index: 6;
  }
`
export const StyledCircleButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 36px;
  height: 36px;
  background: ${({ reverseContrast }) =>
    reverseContrast ? white : themeColor};
  border-radius: 50%;
  opacity: ${({ disabled }) => (disabled ? '0.5' : '1')};
  cursor: ${({ disabled }) => (!disabled ? 'pointer' : 'not-allowed')};
`
