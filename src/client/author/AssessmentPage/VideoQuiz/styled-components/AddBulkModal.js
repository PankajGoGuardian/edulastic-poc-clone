import styled from 'styled-components'
import { InputNumber } from 'antd'
import { Paper, CustomModalStyled } from '@edulastic/common'
import { themeColor, white } from '@edulastic/colors'
import { IconCheck } from '@edulastic/icons'
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

export const StyledLoaderModal = styled(CustomModalStyled)`
  .ant-modal-content {
    .ant-modal-close {
      display: none;
    }
  }
`
export const StyledaiSummaryContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`
export const StyledCheckContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${themeColor};
`
export const StyledIconCheck = styled(IconCheck)`
  fill: ${white};
  width: 20px;
  height: 20px;
  pointer-events: none;
`

export const StyledSummaryText = styled.div`
  font-family: Open Sans;
  font-size: 16px;
  font-weight: 600;
  line-height: 19px;
  letter-spacing: 0em;
  text-align: center;
  margin: 30px 0px;
`

export const StyledSummaryMessage = styled.div`
  font-family: Open Sans;
  font-size: 13px;
  font-weight: 400;
  letter-spacing: 0em;
  text-align: center;
  color: #777777;
  margin-bottom: 30px;
`
