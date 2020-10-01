import styled from 'styled-components'
import { Input, Col } from 'antd'
import { StyledModal } from '../../../../../common/styled'

const { TextArea } = Input

export const StyledTextArea = styled(TextArea)`
  margin-top: 20px;
  min-height: 200px !important;
  background-color: transparent;
`

export const PlaceHolderText = styled.p`
  color: #bfbfbf;
  position: absolute;
  margin-top: 22px;
  margin-left: 14px;
  font-size: 14px;
  line-height: 21px;
  pointer-events: none;
  user-select: none;
  display: ${(props) => (props.visible ? 'block' : 'none')};
`
export const AddMulitpleTeachersModal = styled(StyledModal)`
  .ant-modal-body {
    padding: 20px;
  }
`

export const TextWrapper = styled(Col)`
  font-size: 14px;
  font-weight: 600;
`
