import {
  themeColorHoverBlue,
  white,
  themeColorBlue,
  sectionBorder,
  themeLightGrayColor,
} from '@edulastic/colors'
import styled, { keyframes, css } from 'styled-components'
import { EDIT } from '../../../../constants/constantsForQuestions'

const rippleAnimation = keyframes`
	0% {
	  box-shadow: 0px 0px 0px 1px rgba(26, 115, 232, 0.0);
	}
	50% { 
	  box-shadow: 0px 0px 0px 15px rgba(26, 115, 232, 0.1);
	}
	100% {
	  box-shadow: 0px 0px 0px 15px rgba(26, 115, 232, 0);
	}
  `

export const StyledOuterButton = styled.div`
  width: ${({ width }) => width};
  height: ${({ height }) => height};
  position: relative;
  margin: ${({ margin }) => margin};
  border-radius: 50%;
  left: ${({ left }) => left};
  top: ${({ top }) => top};
  color: white;
  background-color: ${({ isSelected }) =>
    isSelected ? themeColorBlue : white};
  border: 1px solid
    ${({ isEditView, isSelected }) =>
      isEditView ? white : isSelected ? themeColorBlue : themeLightGrayColor};
`
export const StyledInnerButton = styled.div`
  width: ${({ width }) => width};
  height: ${({ height }) => height};
  position: relative;
  margin: ${({ margin }) => margin};
  border-radius: 50%;
  left: ${({ left }) => left};
  top: ${({ top }) => top};
  color: white;
  border: 1px solid ${({ isSelected }) => (isSelected ? themeColorBlue : white)};
  display: flex;
  align-items: center;
  font-size: ${({ fontsize }) => fontsize || '13px'};
  justify-content: center;
  background-color: ${({ bgColor }) => bgColor || '#36AE26'};
`

export const StyledSpan = styled.span`
  margin: ${({ margin }) => margin};
  display: inline-block;
  border-radius: 50%;
  position: ${({ position }) => position};
  left: 50%;
  transform: ${({ transform }) => transform};
  top: 0;
  box-sizing: border-box;
  transition: all linear 200ms;
  cursor: pointer;
  pointer-events: ${({ disableOptions }) =>
    disableOptions ? 'none' : 'unset'};
  &::after,
  &::before {
    ${({ isSelected, view, disableOptions }) =>
      isSelected &&
      view !== EDIT &&
      !disableOptions &&
      css`
        content: '';
        display: block;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        border-radius: 50%;
        border: 1px solid ${themeColorHoverBlue};
        animation-name: ${rippleAnimation};
        animation-duration: 1s;
        animation-iteration-count: 1;
      `}
  }
`

export const StyledEmojiImage = styled.img`
  border-radius: 50%;
  background-color: ${({ isSelected }) =>
    isSelected ? themeColorBlue : white};
  :hover {
    background: ${themeColorHoverBlue};
  }
`

export const ColorBox = styled.div`
  width: 100%;
  height: 20px;
  box-sizing: border-box;
  border: 1px solid ${sectionBorder};
  margin-bottom: 4px;
  cursor: pointer;
  background-color: ${({ color }) => `${color}`};
`

export const ColorBoxContainer = styled.div`
  width: 120px;
`
