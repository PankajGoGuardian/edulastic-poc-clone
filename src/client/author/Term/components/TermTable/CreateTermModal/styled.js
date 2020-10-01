import styled from 'styled-components'
import { Form, DatePicker } from 'antd'

export const ModalFormItem = styled(Form.Item)`
  .ant-form-item-control-wrapper {
    width: 100%;
  }

  .ant-input,
  .ant-select,
  .ant-calendar-picker {
    width: 100%;
  }
`

export const StyledDatePicker = styled(DatePicker)`
  width: 100%;
`
