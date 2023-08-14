import styled from 'styled-components'

import { Paper } from '@edulastic/common'
import { secondaryTextColor, themeColor } from '@edulastic/colors'
import { Checkbox } from 'antd'

export const QuestionFormWrapper = styled(Paper)`
  border-radius: 4px;

  .ant-input-number-input {
    text-align: center;
  }
`

export const FormGroup = styled.div`
  width: ${({ width }) => width};
  margin-left: ${({ ml }) => ml};
  &:not(:last-child) {
    margin-bottom: 10px;
  }
  .ant-input {
    &:focus,
    &:hover {
      border-color: ${themeColor};
    }
  }
`

export const FormInline = styled.div`
  display: flex;
`

export const FormLabel = styled.label`
  display: block;
  margin-bottom: 12px;
  font-size: 13px;
  line-height: 1.38;
  font-weight: 600;
  color: ${secondaryTextColor};
`

export const Points = styled.span`
  display: inline-block;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  padding-left: 17px;
`

export const CheckboxGroupStyled = styled(Checkbox.Group)`
  margin-bottom: 10px;
  .ant-checkbox + span {
    width: 38px;
    height: 38px;
    display: inline-block;
    box-shadow: 0px 2px 4px rgba(201, 208, 219, 0.5);
    border-radius: 50%;
    margin-left: 10px;
    text-align: center;
    padding-top: 8px;
    margin-right: 25px;
    font-weight: bold;
  }
`
export const StyledStimulusContainer = styled.div`
  margin-top: ${({ isQuestionInputActive }) =>
    isQuestionInputActive ? '70px' : '0px'};
`
