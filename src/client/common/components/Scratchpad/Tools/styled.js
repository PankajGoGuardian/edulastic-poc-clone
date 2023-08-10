import styled, { css } from 'styled-components'
import { FlexContainer } from '@edulastic/common'
import { Select } from 'antd'
import { white, secondaryTextColor, smallDesktopWidth } from '@edulastic/colors'
import icons from './assets/images/icons.png'

export const ToolBoxContainer = styled.div`
  position: relative;
  z-index: ${({ isDropDownInUse }) => (isDropDownInUse ? 990 : 999)};
`

export const MainToolBoxContainer = styled(FlexContainer)`
  height: 45px;
  min-width: 710px;
  padding: 2px;
  padding-right: 12.5px;
  background: #6e7380;
  background-image: -webkit-linear-gradient(top, #9a9a9a, #6a6c71);
  border-bottom: 1px solid #6e7380;
`

export const SubToolBoxContainer = styled(FlexContainer)`
  height: 45px;
  padding: 0px 8px;
  min-width: 710px;
  user-select: none;
  background-color: #ededed;
  border-bottom: 1px solid #b3b3b3;
`

const selectedButtonStyle = css`
  border: 0px;
  background-color: #6e7380;
  background-image: -webkit-linear-gradient(top, #8e8f92, #616265);
  box-shadow: inset 0px 1px 0px 0px rgba(0, 0, 0, 0.2),
    inset 0px -1px 0px 0px rgba(255, 255, 255, 0.3);
`

const editingButtonStyle = css`
  background-color: #d4d4d4;
  background-image: -webkit-linear-gradient(
    top,
    rgb(212, 212, 212),
    rgb(237, 237, 237)
  );
`

export const StyledButton = styled.button`
  height: 38px;
  width: 36px;
  flex-shrink: 0;
  border: 0px;
  padding: 0px;
  margin: 0px 2px;
  border-radius: 4px;
  background-size: 38px auto;
  background-repeat: no-repeat;
  background-color: transparent;
  background-origin: border-box;

  ${({ selected }) => selected && selectedButtonStyle}

  @media (hover: hover) {
    &:active,
    &:focus,
    &:hover {
      ${({ isEditBtn }) =>
        isEditBtn ? editingButtonStyle : selectedButtonStyle}
    }
  }

  &[disabled],
  &[disabled]:hover {
    opacity: 0.2;
    background: transparent;
  }

  span {
    height: 100%;
    width: 100%;
    display: block;
    background-size: 38px auto;
    background-repeat: no-repeat;
    background-image: url(${icons});
    background-position: ${({ pos }) => `center ${pos || 0}px`};
  }
`

export const Sprite = styled.div`
  height: 19px;
  width: ${({ width }) => width || 20}px;
  background-position: ${({ pos }) => `0 ${pos}px`};
  background-image: url(${icons});
`

export const StyledSelect = styled(Select).attrs({
  showArrow: false,
  dropdownStyle: { zIndex: 1100 },
  // getPopupContainer: (triggerNode) => triggerNode.parentNode
})`
  margin-left: 6px;
  height: 24px;
  width: ${({ width }) => width || 25}px;

  &.ant-select-no-arrow {
    .ant-select-selection-selected-value {
      line-height: 24px;
    }
    .ant-select-selection__rendered {
      margin-right: 0.45rem;
      margin-left: 0.45rem;
      line-height: 24px;
    }
  }
  & .ant-select-selection {
    border: 1px solid #757575;
    border-radius: 2px;
  }
`
// ==============================
export const Label = styled.div`
  font-weight: 600;
  font-size: 11px;
  color: ${white};
  margin-bottom: 4px;
  text-align: center;
  white-space: nowrap;
`

export const Separate = styled.div`
  width: 90%;
  opacity: 0.4;
  border-bottom: 1px solid ${secondaryTextColor};
  position: absolute;
  bottom: 0px;
  left: 50%;
  transform: translateX(-50%);
`

export const customizeIcon = (icon) => styled(icon)`
  fill: ${white};
  width: 19px;
  height: 19px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  &:hover {
    fill: ${white};
  }
`

export const Block = styled.div`
  margin-bottom: 4px;
`

export const ExpandWrapper = styled.div`
  display: flex;
  ${({ style }) => style};
  button {
    margin-right: 8px;
  }
  .scratchpad-action-tools {
    flex-direction: row;
  }
`

export const DrawingToolsContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
`

export const TogglerWrapper = styled.div`
  display: ${({ isTeacher }) => (isTeacher ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: ${white};
  text-transform: uppercase;
  cursor: pointer;

  @media (max-width: ${smallDesktopWidth}) {
    display: none;
  }
`
