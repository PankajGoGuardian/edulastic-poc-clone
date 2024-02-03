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
  width: 90%;
  border-radius: 20px;
`

export const ChatBubble = styled(Row)`
  background: ${({ $bgColor }) => $bgColor};
  color: ${({ $color }) => $color};
  border-radius: 10px;
  margin: 5px;
  padding: 5px 10px;
  font-weight: bold;
`
