import styled from 'styled-components'
import { Form } from 'antd'
import { TextInputStyled } from '@edulastic/common'
import { extraDesktopWidth } from '@edulastic/colors'

export const EditableLabelDiv = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: ${({ flexGrow }) => flexGrow || ''};
  .not-editing-input {
    box-shadow: none;
    caret-color: transparent;
  }
  .not-editing-input:focus {
  }
  label {
    font-size: 10px;
    @media only screen and (min-width: ${extraDesktopWidth}) {
      font-size: 12px;
    }
  }
`

export const StyledFormItem = styled(Form.Item)`
  .ant-input {
    width: 100%;
  }
`

export const LabelContainer = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: 24px;

  .anticon {
    line-height: 40px;
  }
`

export const StyledP = styled.p`
  margin-right: 10px;
  line-height: 40px;
  padding-left: 12px;
`

export const StyledInput = styled(TextInputStyled)`
  &.ant-input {
    height: 34px;
  }
  ${(props) => {
    if (props.isItalic === 'true')
      return `::placeholder {
				color: rgba(68, 68, 68, 0.4);
				font-style: italic;
			}`
  }};
`
