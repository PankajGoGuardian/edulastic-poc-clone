import { Form } from 'antd'
import styled from 'styled-components'
import { CustomModalStyled } from '@edulastic/common'

/** @type {typeof import('antd').Form.Item} */
export const StyledFormItem = styled(Form.Item)`
  display: flex;
  .ant-form-item-label {
    min-width: 120px;
    font-size: 11px;
    text-align: right;
    margin-right: 38px;
  }
  .ant-form-item-control-wrapper {
    width: 100%;
  }

  .ant-input,
  .ant-select {
    width: 100%;
    max-width: 100%;
  }
`

/**
 * @param {import('antd/lib/modal').ModalProps} param0
 */
export const StyledRoundedModal = styled(CustomModalStyled)`
  .ant-modal-content {
    border-radius: 16px;
    .ant-modal-close {
    }
    .ant-modal-header {
      border-bottom: 1px solid #d6d6d6;
      padding-bottom: 26px;
      .ant-modal-title {
        padding: 0;
      }
    }
    .ant-modal-body {
    }
    .ant-modal-footer {
      justify-content: end;
    }
  }
`
