import styled from 'styled-components'

import { ConfirmationModal } from '../../../src/components/common/ConfirmationModal'

export const CloneModal = styled(ConfirmationModal)`
  .ant-modal-body {
    display: flex !important;
    min-height: unset !important;
  }
  .ant-modal-footer {
    justify-content: flex-end !important;
  }
`

export const FullHeightContainer = styled.div`
  height: 100%;
`
