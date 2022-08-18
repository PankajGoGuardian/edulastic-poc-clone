import styled from 'styled-components'
import { lightGreen11, themeColor } from '@edulastic/colors'
import { Col, Row } from 'antd'

export const LearnMore = styled.span`
  height: auto;
  min-width: 90px;
  text-align: center;
  position: absolute;
  top: 110px;
  left: ${(props) => props.moveLeft || '140px'};
  padding: 5px 10px;
  font-weight: 700;
  font-size: 10px;
  line-height: 14px;
  letter-spacing: 0.08em;
  color: rgba(0, 0, 0, 0.6);
  border-radius: 4px;
  transform: translateX(40px);
  text-transform: uppercase;

  &:hover {
    cursor: pointer;
  }
`
export const SlideContainer = styled.span`
  height: 200px;
`

export const SliderContainer = styled.div`
  position: relative;
  height: 175px;
  overflow: hidden;
  margin: 0px -8px;
  .prev,
  .next {
    display: none;
  }
  &:hover {
    .prev,
    .next {
      display: block;
    }
  }
`
export const ScrollbarContainer = styled.div`
  white-space: nowrap;
  transition: 0.2s;
  &.scrollbar-container {
    width: calc(100vw - 130px);
    height: 227px;
    overflow-x: scroll;
    overflow-y: hidden;
  }
`
export const PrevButton = styled.div`
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
  cursor: pointer;
  z-index: 5;
`
export const NextButton = styled(PrevButton)`
  top: 47%;
  left: auto;
  right: 10px;
  transform: translateY(-50%) rotate(180deg);
`

export const Slides = styled.div`
  height: 150px;
  width: 290px;
  padding: 20px 30px;
  cursor: pointer;
  display: inline-block;
  background: linear-gradient(
    72.19deg,
    rgba(83, 176, 149, 0.1) -11.13%,
    rgba(83, 176, 149, 0.1) 100%
  );
  border-radius: 10px;
  margin: 5px 9px;
  position: relative;
  transform: scale(1);
  transition: 0.2s;
  &:hover {
    box-shadow: 0 0 3px 2px ${themeColor};
    transform: scale(1.015);
    border: none;
  }

  &.last,
  &:last-child {
    margin-right: 8px !important;
  }
`

export const SlideDescription = styled.span`
  height: auto;
  width: auto;
  max-width: 420px;
  transform: translateX(40px);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  border-radius: 4px;
  font-weight: 800;
  font-size: 14px;
  line-height: 19px;
  color: rgba(0, 0, 0, 0.6);
  &:hover {
    cursor: pointer;
  }
`

export const DashedLine = styled.div`
  width: 7%;
  border: 2px solid ${lightGreen11};
  margin: 0px;
  margin-bottom: 15px;
  height: 0px;
`

export const StyledRow = styled(Row)`
  margin-bottom: 10px;
`
export const StyledCol = styled(Col)``

export const SlideInfo = styled.div`
  font-size: 12px;
  line-height: 16px;
  color: rgba(0, 0, 0, 0.8);
`
export const IconWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`
