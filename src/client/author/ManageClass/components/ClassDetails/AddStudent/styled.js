import {
  greyThemeLight,
  lightGreySecondary,
  themeColor,
  secondaryTextColor,
} from '@edulastic/colors'
import { Button, Collapse, Form } from 'antd'
import styled from 'styled-components'
import { ConfirmationModal } from '../../../../src/components/common/ConfirmationModal'

export const StyledModal = styled(ConfirmationModal)`
  background: none;
  top: 40px;
  min-width: 520px;
  padding: ${(props) => props.padding || '24px'};
  .ant-modal-content {
    padding: 20px 35px;
    .ant-modal-body {
      padding: 0px;
      background: none;
      box-shadow: none;
    }
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

export const PanelHeader = styled.div`
  color: black;
  font-weight: 500;
  font-size: 16px;
  text-transform: uppercase;
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
    margin-left: 30px;
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

export const AddForm = styled(Form)`
  background: none;
  .ant-collapse {
    border: none;
    background: white;
    border-radius: 2px;
    background-color: ${lightGreySecondary};
    border: 1px solid ${greyThemeLight};
    & > .ant-collapse-item {
      border: none;
      width: 100%;
    }
  }
  .ant-collapse-content {
    border: none;
    & > .ant-collapse-content-box {
      padding: 2rem 2rem 1.2rem 2rem;
    }
  }
`

export const StyledCollapse = styled(Collapse)`
  .ant-collapse-item-disabled {
    filter: opacity(0.5);
  }
`
