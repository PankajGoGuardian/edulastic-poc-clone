import styled from 'styled-components'
import { FlexContainer } from '@edulastic/common'
import { mobileWidth, mobileWidthLarge } from '@edulastic/colors'

export const PaginationInfo = styled.span`
  font-weight: 600;
  display: inline-block;
  font-size: 11px;
  word-spacing: 5px;
  a {
    color: #69727e;
  }
  @media (max-width: ${mobileWidth}) {
    display: none;
  }
`

export const StyledFlexContainer = styled(FlexContainer)`
  margin-bottom: 20px;
  width: 100%;
`

export const SwitchBox = styled.div`
  font-size: 9px;
  display: flex;
  align-items: center;
  .ant-switch {
    min-width: 32px;
    height: 16px;
    margin-left: 16px;
    margin-right: 36px;

    &:after {
      width: 12px;
      height: 12px;
    }
  }

  @media (max-width: ${mobileWidthLarge}) {
    display: none;
  }
`

export const SwitchLabel = styled.span`
  text-transform: uppercase;
`
