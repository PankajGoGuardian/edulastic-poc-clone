import { white } from '@edulastic/colors'
import { List } from 'antd'
import styled from 'styled-components'
import { ConfirmationModal } from '../../../src/components/common/ConfirmationModal'

export const StyledList = styled(List)`
  padding: 15px 0px;
`

export const CustomModal = styled(ConfirmationModal)`
  && {
    .ant-modal-content {
      background: ${white};
      .ant-modal-header {
        padding: 0 25px 0 25px;
        background: ${white};
      }
      .ant-modal-body {
        box-shadow: none;
      }
    }
  }
`
