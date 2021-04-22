import styled, { css } from 'styled-components'
import { mobileWidth } from '@edulastic/colors'
import { test as testConstants } from '@edulastic/constants'

const { playerSkinValues } = testConstants
// need to calculate zoomed style
// see: https://snapwiz.atlassian.net/browse/EV-21562
const zoomedStyle = css`
  ${(props) => {
    const { theme, isStudentAttempt, viewComponent } = props
    if (!isStudentAttempt) {
      return
    }

    const { shouldZoom, zoomLevel, headerHeight = 90, playerSkinType } = theme
    const zoomed = zoomLevel > '1' && zoomLevel !== undefined
    const questerFooterHeight = 66
    // need to think about padding of Main wrapper
    // see: themes/common/Main.js

    let paddingTopBottom = 20
    if (zoomed) {
      if (zoomLevel >= 1.5 && zoomLevel < 1.75) {
        paddingTopBottom = 30
      }
      if (zoomLevel >= 1.75) {
        paddingTopBottom = 35
      }
    }

    paddingTopBottom *= 2

    // 8 is margin-top of Container. Check this file
    const hasFooter =
      viewComponent === 'practicePlayer' &&
      (playerSkinType === playerSkinValues.quester ||
        playerSkinType === playerSkinValues.edulastic)
    let header = hasFooter ? 180 : headerHeight + paddingTopBottom + 8
    if (playerSkinType === 'quester') {
      header += questerFooterHeight
    }
    if (shouldZoom && zoomed) {
      header /= zoomLevel
      return `
        min-height: calc(${100 / zoomLevel}vh - ${header}px);
        max-height: calc(${100 / zoomLevel}vh - ${header}px);
      `
    }
    return `
      min-height: calc(100vh - ${header}px);
      max-height: calc(100vh - ${header}px);
    `
  }}
`

export const Container = styled.div`
  display: flex;
  width: ${({ colWidth }) => colWidth || '100%'};
  flex-direction: column;
  border-right-color: ${(props) =>
    props.theme.testItemPreview.itemColBorderColor};
  background-color: ${(props) => props.isStudentAttempt && '#fff'};
  border-radius: ${(props) => props.isStudentAttempt && '8px'};
  margin-top: ${(props) => props.isStudentAttempt && '12px'};
  overflow: ${(props) =>
    props.isStudentAttempt || props.isExpressGrader || props.isStudentReport
      ? 'auto'
      : 'hidden'};
  ${zoomedStyle}
  @media (max-width: ${mobileWidth}) {
    padding-left: 0px;
    margin-right: ${(props) => !props.value && '20px'};
    margin-left: ${(props) => props.value && '20px'};
  }
`

export const WidgetContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  position: relative;
  flex-grow: 1;
  min-height: max-content; // to fix height issue with safari
`
export const FilesViewContainer = styled.div`
  padding: 10px 35px;
`
