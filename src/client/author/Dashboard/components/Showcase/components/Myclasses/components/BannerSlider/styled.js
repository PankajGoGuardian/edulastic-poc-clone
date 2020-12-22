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
  .scrollbar-container {
    width: calc(100vw - 130px);
    transition: 0.2s;
    padding-bottom: 14px;
  }
  .ps__rail-x {
    display: none;
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
  margin-right: 20px;

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

export const BundleContainer = styled.div`
  width: 241px;
  height: 169px;
  display: flex;
  align-items: flex-end;
  margin: 0px 10px 10px 0px;
  border-radius: 10px;
  padding: 12px 20px;
  color: ${white};
  cursor: pointer;
  background-image: ${(props) => `url(${props.bgImage})`};
  background-size: 100% 100%;
  background-position: top left;
  background-repeat: no-repeat;
`

export const Bottom = styled.div`
  font-size: 13px;
  height: 40px;
  overflow: hidden;
  font-weight: 600;
`
