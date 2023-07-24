import styled from 'styled-components'
import { InputNumber } from 'antd'
import { Paper } from '@edulastic/common'
import { ModalTitle } from '../../common/Modal'
import { FormGroup } from './QuestionForm'

export const BulkTitle = styled(ModalTitle)`
  margin-left: 0;
`

export const NumberInput = styled(InputNumber)`
  .ant-input-number-input {
    text-align: left;
  }
`

export const TypeOfQuestion = styled(FormGroup)`
  margin-left: 17px;
`

export const StartingIndexInput = styled(InputNumber)`
  width: 100%;

  .ant-input-number-input {
    text-align: left;
  }
`

export const StandardSelectWrapper = styled(Paper)`
  border-radius: 4px;
  padding: 15px 0px;
  margin-top: 15px;
`
