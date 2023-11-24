import styled from 'styled-components'
import { CustomModalStyled } from '@edulastic/common'

export const StyledAlertModal = styled(CustomModalStyled)`
  .ant-modal-content {
    .ant-modal-body {
      text-align: center;
    }
    .ant-modal-close {
			${(props) =>
        !props.isClosable && {
          display: 'none',
        }}
    }
`
