import styled from 'styled-components'
import { FlexContainer } from '@edulastic/common'

export const RadioWrapper = styled(FlexContainer).attrs({
  flexDirection: 'column',
})`
  label {
    margin-bottom: ${({ isAssignPage }) => (isAssignPage ? '5px' : '18px')};
    span:nth-child(2) {
      font-weight: 600;
    }
  }
  ${({ isAssignPage }) =>
    isAssignPage &&
    `
	 .ant-radio + span {
	  font-size: 11px !important;
	 }
	`}
`
