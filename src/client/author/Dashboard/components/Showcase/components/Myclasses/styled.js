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
`

export const BannerSlider = styled.div`
  white-space: nowrap;
  margin-bottom: 20px;
  overflow: auto;
`
export const PrevButton = styled.div`
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
  cursor: pointer;
`
export const NextButton = styled.div`
  position: absolute;
  top: 47%;
  right: 10px;
  transform: translateY(-50%) rotate(180deg);
  cursor: pointer;
`

export const Slides = styled.div`
  height: 200px;
  width: 490px;
  margin-right: 15px;
  background-size: 100% 100%;
  background-position: top left;
  color: ${white};
  cursor: pointer;
  display: inline-block;
  background: ${(props) => `url(${props.bgImage})`};
  &:last-child {
    margin-right: 0px;
  }
`

export const BundleContainer = styled.div`
  width: 241px;
  height: 169px;
  display: flex;
  align-items: flex-end;
  margin: 0px 10px 10px 0px;
  border-radius: 10px;
  background-size: 100% 100%;
  background-position: top left;
  padding: 12px 20px;
  background: ${(props) => `url(${props.bgImage})`};
  color: ${white};
  cursor: pointer;
`

export const Bottom = styled.div`
  font-size: 13px;
  height: 40px;
  overflow: hidden;
  font-weight: 600;
`
