import Styled from 'styled-components'
import { Select } from 'antd'
import { EduButton } from '@edulastic/common'

export const ModalBody = Styled.div`
  .ant-select-selection {
    border: 1px solid #b9b9b9;
    border-radius: 0;
    font-size: 12px;
    margin-bottom: 10px;
  }
  .ant-select-dropdown-menu-item {
    font-size: 12px;
  }
`

export const ButtonsContainer = Styled.div`
  flex:1;
  margin-top:20px;
  display:flex;
  justify-content: flex-end;
`

export const StyledSelect = Styled(Select)`
  min-width: 100px;
  color:#6A737F;
  .ant-select-selection{
    border-radius: 2px;
    border: 1px solid #B9B9B9;
    background-color:#F8F8F8;
    margin:0;
  }
`

export const StyledButton = Styled(EduButton)`
  border: 1px solid #3F85E5;
  border-radius: 4px;
  text-transform: uppercase;
  white-space: nowrap;
  font-size:10px;
  width:100px;
`

export const RuleButton = Styled(StyledButton)`
  background-color:white;
  color: #3f85e5;
`

export const GroupButton = Styled(StyledButton)`
  background-color:#3f85e5;
  color: white;
`
