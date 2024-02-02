import styled from 'styled-components'
import { Card, Input, Row } from 'antd'

export const StyledCard = styled(Card)`
  border-radius: 10px;
  .ant-card-body {
    margin: 10px;
  }
  .ant-card-head {
    font-weight: bold;
    margin: 0px;
    padding-left: 10px;
  }
`
export const StyledTextArea = styled(Input.TextArea)`
  overflow-y: scroll;
  resize: none;
`

export const ChatBubble = styled(Row)`
  width: 100%;
  background: ${({ $bgColor }) => $bgColor};
  border-radius: 10px;
  margin: 5px;
  padding: 5px;
`
