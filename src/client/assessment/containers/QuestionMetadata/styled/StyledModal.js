import styled from "styled-components";
import { Modal } from "antd";

export const StyledModal = styled(Modal)`
  width: 70% !important;

  .ant-modal-content {
    color: ${props => props.theme.questionMetadata.textColor};
    background: ${props => props.theme.questionMetadata.containerBackground};
  }

  .ant-modal-header {
    border-bottom: 0;
    background: ${props => props.theme.questionMetadata.containerBackground};

    .ant-modal-title {
      font-weight: 700;
      font-size: 22px;
      color: ${props => props.theme.questionMetadata.textColor};
    }
  }

  .ant-modal-close-x {
    font-size: 22px;
    color: ${props => props.theme.questionMetadata.textColor};
  }

  .ant-modal-footer {
    border-top: 0;
    display: flex;
    align-items: center;
    justify-content: center;

    .ant-btn {
      width: 200px;
      min-height: 40px;
      text-transform: uppercase;
      font-weight: 600;
    }
  }
`;
