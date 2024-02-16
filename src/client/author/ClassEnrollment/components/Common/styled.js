import styled from 'styled-components'
import { Modal, Button, Form as AntdForm } from 'antd'
import {
  lightGrey3,
  themeColor,
  white,
  red,
  secondaryTextColor,
} from '@edulastic/colors'

export const StyledModal = styled(Modal)`
  .ant-modal-content,
  .ant-modal-header {
    background-color: ${lightGrey3};
  }
  .ant-modal-footer {
    display: flex;
    justify-content: flex-end;
  }
`

export const Title = styled.div`
  color: ${themeColor};
  label {
    margin-left: 8px;
  }
  svg {
    fill: ${themeColor};
  }
`

export const InputMessage = styled.span`
  color: ${red};
`

export const ActionButton = styled(Button)`
  font-weight: 500;
  font-size: 14px;
  border-radius: 25px;
  height: 32px;
  display: flex;
  align-items: center;
  background: ${themeColor};
  border-color: ${themeColor};
  &:hover,
  &:focus {
    background: ${themeColor};
    border-color: ${themeColor};
  }
`

export const Field = styled.fieldset`
  width: 100%;
  padding: 0px;

  label {
    font-size: 11px;
  }
  .ant-calendar-picker {
    width: 100%;
  }
`
export const Form = styled(AntdForm)`
  background: ${white};
  .ant-input-affix-wrapper {
    .ant-input-prefix {
      width: 15px;
    }
  }
`

export const PanelHeader = styled.div`
  color: ${themeColor};
  font-weight: 500;
  font-size: 16px;

  label {
    margin-left: 8px;
    color: ${themeColor};
  }
  .flex {
    display: flex;
    align-items: center;
  }
  small {
    font-size: 12px;
    color: ${secondaryTextColor};
  }
`

export const FooterDiv = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`
