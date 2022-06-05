import styled from 'styled-components'
import { darkRed, greyThemeLight } from '@edulastic/colors'

export const ScratchpadContainer = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  /* froalar z-index is 998  or 997 or 996*/
  /* @see https://snapwiz.atlassian.net/browse/EV-19269 */
  z-index: ${({ isDropDownInUse }) => (isDropDownInUse ? '990' : '999')};
  top: 0px;
  left: 0px;
  display: ${({ hideData }) => (hideData ? 'none' : 'block')};
`

const getBorderColor = ({ readOnly, deleteMode }) => {
  if (readOnly) {
    return 'transparent'
  }
  if (deleteMode) {
    return darkRed
  }
  return greyThemeLight
}

export const ZwibblerMain = styled.div`
  width: ${({ width }) => (width ? `${width}px` : '100%')};
  height: ${({ height }) => (height ? `${height}px` : '100%')};
  border: 2px dashed;
  border-color: ${getBorderColor};
  background-size: 30px 30px;

  &:focus {
    outline: none;
  }

  & .zwibbler-canvas-holder {
    &:focus {
      outline: none;
    }
    touch-action: ${({ readOnly }) => readOnly && `unset !important`};
  }

  & .zwibbler-overlay {
    outline: none !important;
  }

  & .zwibbler-text-area {
    resize: both;
  }
`
