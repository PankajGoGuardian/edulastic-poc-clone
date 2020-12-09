import styled from 'styled-components'
import Button from "antd/es/button";
import { linkColor } from '@edulastic/colors'
import { ConfirmationModal } from '../../../../src/components/common/ConfirmationModal'

export const StyledModal = styled(ConfirmationModal)`
.ant-modal-content
  .ant-modal-body {
    min-height: 150px;
    .ant-select {
      margin-top: 10px;
      min-width: 100%;
    }
  }
}
`

export const ActionButton = styled(Button)`
  font-weight: 500;
  font-size: 14px;
  border-radius: 25px;
  height: 32px;
  display: flex;
  align-items: center;
`

export const Title = styled.div`
  color: ${linkColor};
  label {
    margin-left: 8px;
  }
  svg {
    fill: ${linkColor};
  }
`

export const Description = styled.div`
  line-height: 2;
`
