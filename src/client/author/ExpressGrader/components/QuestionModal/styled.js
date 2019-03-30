import { Modal } from "antd";
import styled from "styled-components";

export const ModalWrapper = styled(Modal)`
  top: 0;
  padding: 0;
  height: 100%;
  .ant-modal-content {
    height: 100%;
    .ant-modal-body {
      padding: 12px;
      display: flex;
      flex-shrink: 1;
      flex-direction: column;
    }
  }
`;

export const QuestionWrapper = styled.div``;

export const BottomNavigationWrapper = styled.div`
  padding: 20px 0px;
  position: absolute;
  background: #f0f1f5;
  bottom: 0px;
  left: 0px;
  right: 0px;
`;
