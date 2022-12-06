import {
  greyThemeLight,
  themeColorHoverBlue,
  white,
  themeColorBlue,
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

export const StyledButton = styled.div`
  width: ${({ width }) => width};
  height: ${({ height }) => height};
  position: relative;
  margin: ${({ margin }) => margin};
  border: 1px solid ${greyThemeLight};
  border-radius: 50%;
  left: ${({ left }) => left};
  top: ${({ top }) => top};
  color: ${({ isSelected }) => (isSelected ? white : '#111111')};
  background-color: ${({ isSelected }) =>
    isSelected ? themeColorBlue : white};
  border: 1px solid
    ${({ isSelected }) => (isSelected ? themeColorBlue : '#2F4151')};
  .inner {
    &:hover {
      background: ${themeColorHoverBlue};
      color: ${white};
      border-color: ${themeColorHoverBlue};
    }
  }
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
