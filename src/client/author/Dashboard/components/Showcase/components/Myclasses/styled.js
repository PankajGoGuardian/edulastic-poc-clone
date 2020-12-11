import styled from 'styled-components'
import { white } from '@edulastic/colors'

export const CardContainer = styled.div`
  width: 241px;
  height: 212px;
  display: inline-block;
  margin: 0px 10px 10px 0px;
  border-radius: 10px;
  border: 1px solid #dadae4;
  background: ${white};
`
export const CardBox = styled.div``

export const FeatureContentWrapper = styled.div`
  margin-top: 20px;
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
    width: calc(100vw - 140px);
    transition: 0.2s;
    padding-bottom: 7px;
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
  margin-right: 15px;
  color: ${white};
  cursor: pointer;
  display: inline-block;
  background-image: ${(props) => `url(${props.bgImage})`};
  background-size: 100% 100%;
  background-position: top left;
  background-repeat: no-repeat;
  &.last,
  &:last-child {
    margin-right: 0px !important;
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
