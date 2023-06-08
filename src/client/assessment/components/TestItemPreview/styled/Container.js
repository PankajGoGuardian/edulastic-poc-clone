import styled from 'styled-components'
import { themeColor, greyDarken, boxShadowColor } from '@edulastic/colors'
import { SMALL_DESKTOP_WIDTH } from '../../../constants/others'

export const Container = styled.div`
  display: ${(props) => (props.width > SMALL_DESKTOP_WIDTH ? 'flex' : 'block')};
  position: relative;
  justify-content: ${(props) =>
    props.isCollapsed ? 'space-between' : 'initial'};
  flex-grow: 1;
  width: 100%;
  height: 100%;
  padding: 0;
  min-width: ${({ responsiveWidth, isFeedBackVisibleInAttempt }) =>
    responsiveWidth && isFeedBackVisibleInAttempt
      ? ''
      : `${responsiveWidth}px`};
`

export const Divider = styled.div`
  width: ${(props) => (props.isCollapsed ? '8%' : '25px')};
  position: relative;
  background-color: ${(props) =>
    props.isCollapsed ? '#e5e5e5' : 'transparent'};
  border-radius: 10px;
  z-index: 1;
  > div {
    position: absolute;
    background-color: #ffffff;
    box-shadow: 0px 2px 7px ${boxShadowColor};
    border-radius: 5px;
    width: 70px;
    top: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    left: ${(props) =>
      props.collapseDirection === 'left'
        ? 'auto'
        : props.collapseDirection === 'right'
        ? '-30px'
        : '-25px'};
    right: ${(props) =>
      props.collapseDirection === 'right'
        ? 'auto'
        : props.collapseDirection === 'left'
        ? '-30px'
        : '-25px'};
  }
`

export const CollapseBtn = styled.i`
  cursor: pointer;
  font-size: 12px;
  height: 27px;
  padding: 5px 8px;
  color: ${themeColor};
  ${(props) => {
    if (props.right) {
      return `border-top-right-radius: 5px;
          border-bottom-right-radius: 5px;
          background-color:${
            props.collapseDirection === 'left' ? themeColor : '#fff'
          };
          color:${props.collapseDirection === 'left' ? '#fff' : themeColor};
          svg{
            fill:${props.collapseDirection === 'left' ? '#fff' : themeColor};
            &:hover{
              fill:${props.collapseDirection === 'left' ? '#fff' : themeColor};
            }
          }`
    }
    if (props.left) {
      return `border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
        background-color:${
          props.collapseDirection === 'right' ? themeColor : '#fff'
        };
        color:${props.collapseDirection === 'right' ? '#fff' : themeColor};
        svg{
          fill:${props.collapseDirection === 'right' ? '#fff' : themeColor};
          &:hover{
            fill:${props.collapseDirection === 'right' ? '#fff' : themeColor};
          }
        }`
    }
  }}
`

export const Dividerlines = styled.span`
  color: ${greyDarken};
  transform: scaley(1.5);
  text-align: center;
`
export const RenderFeedBack = styled.div`
  position: relative;
  min-width: ${({ isStudentAttempt, isPrintPreview }) =>
    !isPrintPreview && !isStudentAttempt && '265px'};
  overflow-y: ${({ isExpressGrader }) => isExpressGrader && 'auto'};
  overflow-x: ${({ isExpressGrader }) => isExpressGrader && 'hidden'};
  padding: ${({ isStudentAttempt }) => isStudentAttempt && '32px 16px 8px 0px'};
`
