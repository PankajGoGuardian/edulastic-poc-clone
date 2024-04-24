import { FlexContainer } from '@edulastic/common'
import { lightGrey } from '@edulastic/colors'
import { Button } from 'antd'
import styled from 'styled-components'

export const SaveButton = styled(Button)`
  color: white;
  border: 1px solid #00b0ff;
  min-width: 85px;
  background: #00b0ff;
  margin-left: auto;
  &:hover {
    background: #fff;
    border-color: #40a9ff;
  }
`
export const StyledFlexContainer = styled(FlexContainer)`
  background: ${lightGrey};
  padding: 10px;

  p {
    margin-left: 10px;
  }
`
