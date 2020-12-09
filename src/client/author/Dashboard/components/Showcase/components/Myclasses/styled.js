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
export const BundleContainer = styled.div`
  width: 241px;
  height: 169px;
  display: inline-block;
  margin: 0px 10px 10px 0px;
  border-radius: 10px;
  background: ${(props) => props.bgImage || `url(${props.bgImage})`};
  background-size: 100% 100%;
  background-position: top left;
  padding: 12px 20px;
  color: ${white};
  cursor: pointer;
`
export const Top = styled.div`
  display: flex;
  justify-content: flex-end;
  .custom-badge {
    background: #e8eef2;
    color: #5c809e;
    font-size: 8px;
    text-transform: uppercase;
    padding: 5px 12px;
    border-radius: 5px;
    margin-left: 5px;
    text-align: center;
    font-weight: bold;
    display: flex;
    align-items: center;
    white-space: nowrap;

    svg {
      fill: #5c809e;
      margin-right: 8px;
      width: 10px;
      height: 10px;
    }

    &.premium-badge {
      background: #feb63a;
      color: #ffffff;
    }
  }
`

export const Mid = styled.div`
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const Bottom = styled.div`
  font-size: 13px;
  height: 40px;
  overflow: hidden;
  font-weight: 600;
`
