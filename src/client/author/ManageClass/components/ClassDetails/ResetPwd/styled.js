import styled from 'styled-components'
import Button from "antd/es/Button";
import Input from "antd/es/Input";
import { linkColor, themeColor } from '@edulastic/colors'
import { ConfirmationModal } from '../../../../src/components/common/ConfirmationModal'

export const StyledModal = styled(ConfirmationModal)`
  .ant-form-item {
    text-align: center;
  }
`

export const ActionButton = styled(Button)`
  font-weight: 500;
  font-size: 14px;
  border-radius: 25px;
  height: 32px;
  display: flex;
  align-items: center;
  ${(props) => props.reset && `background-color:${themeColor}`}
  &:hover {
    ${(props) => props.reset && `background-color:${themeColor}`}
  }
`

export const Title = styled.div`
  color: ${linkColor};
  label {
    margin-left: 8px;
  }
  svg {
    fill: ${linkColor};
  }
`

export const StyledInput = styled(Input)`
  width: 60%;
`
