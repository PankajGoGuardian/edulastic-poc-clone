import styled from "styled-components";
import { Modal } from "antd";

export const StyledModal = styled(Modal)`
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
