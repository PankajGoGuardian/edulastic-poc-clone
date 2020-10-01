import styled from 'styled-components'
import { Row as AntdRow, Select } from 'antd'
import { ButtonsContainer, ModalFormItem } from '../../../common/styled'

export const SecondDiv = styled.div`
  margin: 15px;
`

export const ThirdDiv = styled.div`
  margin: 30px 15px;
`

export const Row = styled(AntdRow)`
  margin: 10px 0px;
`

export const LeftButtonsContainer = styled(ButtonsContainer)`
  margin: 0px;
  margin-top: 25px;
  button:first-child {
    margin-left: 0px;
  }
  justify-content: flex-start;
`

export const FormItem = styled(ModalFormItem)``

export const StyledSelect = styled(Select)`
  width: 100%;
`
