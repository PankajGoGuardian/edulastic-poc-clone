import React, { useState } from "react";
import styled from "styled-components";
import { Modal } from "antd";
import { white } from "@edulastic/colors";

const UnauthorizedPopup = props => {
  const [visible, setVisible] = useState(true);
  const { className } = props;

  return (
    <Modal
      visible={visible}
      footer={null}
      className={className}
      width="500px"
      maskClosable={false}
      onCancel={() => setVisible(false)}
    >
      <p>User not yet authorized to use Edulastic. Please contact your district administrator!</p>
    </Modal>
  );
};

const StyledUnauthorizedPopup = styled(UnauthorizedPopup)`
  .ant-modal-content {
    background-color: #40444f;
    color: ${white};
    .ant-modal-close {
      border: solid 3px white;
      border-radius: 20px;
      color: white;
      margin: -17px;
      height: 35px;
      width: 35px;
      .ant-modal-close-x {
        height: 100%;
        width: 100%;
        line-height: normal;
        padding: 5px;
        path {
          stroke: white;
          stroke-width: 150;
          fill: white;
        }
      }
    }
  }
`;

export { StyledUnauthorizedPopup as UnauthorizedPopup };
