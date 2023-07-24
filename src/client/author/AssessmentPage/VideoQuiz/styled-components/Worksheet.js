import styled from 'styled-components'
import {
  mediumDesktopExactWidth,
  extraDesktopWidthMax,
} from '@edulastic/colors'

export const WorksheetWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  overflow: auto;
  padding-top: ${({ showTools }) => showTools && '40px'};
  background: #f3f3f4;
  height: ${(props) =>
    `calc(100vh - 65px - ${
      (props.testMode
        ? `${30 + props.extraPaddingTop}`
        : props.reportMode
        ? props.theme.HeaderHeight.xs + 41 + props.extraPaddingTop
        : props.theme.HeaderHeight.xs + props.extraPaddingTop) || 0
    }px)`};

  @media (min-width: ${mediumDesktopExactWidth}) {
    height: ${(props) =>
      `calc(100vh - 65px  - ${
        (props.testMode
          ? `${30 + props.extraPaddingTop}`
          : props.reportMode
          ? props.theme.HeaderHeight.md + 41 + props.extraPaddingTop
          : props.theme.HeaderHeight.md + props.extraPaddingTop) || 0
      }px)`};
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    height: ${(props) =>
      `calc(100vh - 65px - ${
        (props.testMode
          ? `${30 + props.extraPaddingTop}`
          : props.reportMode
          ? props.theme.HeaderHeight.xl + 41 + props.extraPaddingTop
          : props.theme.HeaderHeight.xl + props.extraPaddingTop) || 0
      }px)`};
  }
`

export const VideoViewerContainer = styled.div`
  display: flex;
  width: ${({ width }) => width}px;
  overflow-x: auto;
  padding: 0px 15px;
`
