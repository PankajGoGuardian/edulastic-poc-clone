import styled from 'styled-components'
import Form from "antd/es/Form";
import DatePicker from "antd/es/DatePicker";

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
