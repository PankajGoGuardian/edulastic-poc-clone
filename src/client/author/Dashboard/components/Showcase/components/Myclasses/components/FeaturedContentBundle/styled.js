import styled from 'styled-components'
import { white } from '@edulastic/colors'

export const FeatureContentWrapper = styled.div`
  margin-top: 20px;
`

export const EmptyBox = styled.div`
  width: 240px;
  height: 169px;
  margin: 0px 7px 10px 0px;
`

export const BundleContainer = styled.div`
  width: 240px;
  height: 169px;
  display: flex;
  align-items: flex-end;
  margin: 0px 7px 10px 0px;
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
