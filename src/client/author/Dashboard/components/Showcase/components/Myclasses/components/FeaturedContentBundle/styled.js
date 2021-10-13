import styled from 'styled-components'
import { themeColor, white } from '@edulastic/colors'
import { EduButton } from '@edulastic/common'

export const FeatureContentWrapper = styled.div`
  margin-top: 20px;
`

export const EmptyBox = styled.div`
  width: 240px;
  height: 169px;
  margin: 0px 2px 10px 0px;
`

export const BundleContainer = styled.div`
  width: 240px;
  height: 169px;
  display: flex;
  align-items: flex-end;
  margin: 0px 8px 10px 0px;
  border-radius: 10px;
  padding: 12px 20px;
  color: ${white};
  cursor: pointer;
  background-image: ${(props) => `url(${props.bgImage})`};
  background-size: 100% 100%;
  background-position: top left;
  background-repeat: no-repeat;
  transform: scale(1);
  transition: 0.2s;
  &:hover {
    box-shadow: 0 0 3px 2px ${themeColor};
    transform: scale(1.03);
    border: none;
    overflow: hidden;
  }
`

export const Bottom = styled.div`
  font-size: 13px;
  height: 40px;
  overflow: hidden;
  font-weight: 600;
`
export const UnlockButton = styled(EduButton)`
  display: inline-flex;
  align-items: flex-start;
  margin-left: 10px;
  top: -2px;
`
