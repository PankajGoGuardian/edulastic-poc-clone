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

    const { zoomLevel, headerHeight = 90, playerSkinType } = theme
    const zoomed = zoomLevel > '1' && zoomLevel !== undefined
    const questerFooterHeight = 66
    const practicePlayerFooterHeight = 20
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
        playerSkinType === playerSkinValues.edulastic ||
        playerSkinType === playerSkinValues.drc)
    let header = hasFooter ? 180 : headerHeight + paddingTopBottom + 8
    if (
      playerSkinType === playerSkinValues.quester ||
      playerSkinType === playerSkinValues.drc
    ) {
      // This adjustment was required to fix the practice player with questar skin.
      header += viewComponent === 'practicePlayer' ? -20 : questerFooterHeight
    }
    if (
      viewComponent === 'practicePlayer' &&
      playerSkinType === playerSkinValues.edulastic
    ) {
      header += practicePlayerFooterHeight
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
  background-color: ${(props) =>
    props.isStudentAttempt && (props?.themeBgColor || '#fff')};
  border-radius: ${(props) => props.isStudentAttempt && '8px'};
  padding-top: ${(props) => props.isStudentAttempt && '12px'};
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
  flex-direction: column;
  flex: 1;
  position: relative;
  min-height: max-content; // to fix height issue with safari

  ${({ zoomLevel }) => {
    const zoomed = zoomLevel > 1 && zoomLevel !== undefined
    if (!zoomed) {
      return ''
    }

    return `
      transform: ${zoomed ? `scale(${zoomLevel})` : ''};
      transform-origin: ${zoomed ? `top left` : ''};
    `
  }};
`
export const FilesViewContainer = styled.div`
  padding: 10px 35px;
`
