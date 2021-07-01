import styled from 'styled-components'
import { white } from '@edulastic/colors'

export const LearnMore = styled.span`
  height: auto;
  width: auto;
  position: absolute;
  top: 140px;
  font-size: 9px;
  font-weight: 600;
  background: ${white};
  padding: 5px 10px;
  color: #3f85e5;
  border-radius: 4px;
  transform: translateX(50px);

  &:hover {
    cursor: pointer;
  }
`
export const SlideContainer = styled.span`
  height: 200px;
`

export const SliderContainer = styled.div`
  position: relative;
  height: 210px;
  overflow: hidden;
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
  margin-bottom: 20px;
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
  height: 200px;
  width: 490px;
  color: ${white};
  cursor: pointer;
  display: inline-block;
  background-image: ${(props) => `url(${props.bgImage})`};
  background-size: 100% 100%;
  background-position: top left;
  background-repeat: no-repeat;
  border-radius: 4px;
  margin-right: 5px;
  position: relative;

  &.last,
  &:last-child {
    margin-right: 0px !important;
  }
`

export const SlideDescription = styled.span`
  height: auto;
  width: auto;
  max-width: 420px;
  position: absolute;
  top: 30px;
  font-size: 18px;
  background: #0006;
  color: ${white};
  padding: 5px 10px;
  transform: translateX(40px);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  border-radius: 4px;

  &:hover {
    cursor: pointer;
  }
`
