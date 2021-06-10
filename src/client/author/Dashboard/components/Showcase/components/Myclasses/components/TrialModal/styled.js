import { darkGrey2, title } from '@edulastic/colors'
import { CheckboxLabel } from '@edulastic/common'
import styled from 'styled-components'

export const ModalBody = styled.div`
  font-size: 14px;
  color: ${darkGrey2};
  p {
    font-weight: normal !important;
  }
`
export const StyledCheckbox = styled(CheckboxLabel)`
  font-size: 14px;
  color: ${title};
  font-weight: 600;
  cursor: unset;
  display: flex;
  align-items: flex-start;
  &.ant-checkbox-wrapper .ant-checkbox + span {
    color: ${title};
    text-transform: initial;
  }
`
export const TrialContainer = styled.div`
  margin-top: 25px;
`
export const FlexRow = styled.div`
  display: flex;
  justify-content: space-between;
`
export const Price = styled.span`
  color: ${title};
  font-size: 14px;
  font-weight: 600;
`
export const Description = styled.div`
  color: ${darkGrey2};
  font-size: 13px;
  font-weight: normal;
  padding-top: 10px;
  padding-left: 38px;
`
export const FooterText = styled.div`
  margin: 30px 0px 10px;
  font-size: 14px;
  font-weight: 600;
  color: ${title};
`
