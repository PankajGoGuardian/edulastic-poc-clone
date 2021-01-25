import { darkGrey2, secondaryTextColor, title, white } from '@edulastic/colors'
import { Modal } from 'antd'
import styled from 'styled-components'

export const StyledPaymentServiceModal = styled(Modal)`
  width: 500px;

  .ant-modal-header,
  .ant-modal-body {
    padding: 25px 45px;
  }
  .ant-modal-header,
  .ant-modal-body,
  .ant-modal-footer,
  .ant-modal-content {
    background: #024788;
    border: none;
    box-shadow: unset;
    color: ${white};
  }

  .ant-modal-header {
    background: ${white};
    h3 {
      font-size: 22px;
      color: ${title};
      font-weight: bold;
    }
    p {
      padding-top: 10px;
      font-size: 14px;
      color: ${darkGrey2};
    }
  }

  .ant-modal-footer {
    display: none;
  }

  .ant-modal-close-x {
    margin: 10px;
  }

  svg {
    transform: scale(1.4);
    fill: ${title};
  }
`

export const IconSpan = styled.span`
  svg {
    margin-top: 4px;
    transform: scale(1.2);
    fill: ${secondaryTextColor};
  }
`
