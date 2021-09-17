import { Button, Checkbox, Row } from 'antd'
import styled from 'styled-components'

export const StyledSubjectContent = styled(Row)`
  margin-top: 20px;
`

export const StyledSaveButton = styled(Button)`
  float: right;
`

export const StyledSubjectTitle = styled.p`
  padding: 0 5px;
  font-weight: bold;
`

export const StyledSubjectLine = styled.div`
  display: flex;
  padding: 5px 0px 5px 20px;
`

export const StyledSubjectCloseButton = styled.a`
  margin-right: 20px;
  color: rgba(0, 0, 0, 0.25);
`
export const StyledCheckbox = styled(Checkbox)`
  margin: 0px 0px 10px 0px !important;
`

export const DropdownWrapper = styled.div`
  .ant-select {
    width: 200px;
  }
  .ant-select-selection {
    border: 1px solid #40b394;
    color: #40b394;
  }
`
