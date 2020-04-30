import styled from "styled-components";
import { Modal, Col } from "antd";
import { greyThemeDark1 } from "@edulastic/colors";

export const StyledModal = styled(Modal)`
  .ant-modal-content {
    width: 500px;
    .ant-modal-close {
      display: none;
    }
    .ant-modal-header {
      display: none;
    }
    .ant-modal-body {
      padding: 24px 46px 32px;
    }
  }
`;

export const StyledCol = styled(Col)`
  display: flex;
  align-items: center;
  justify-content: ${props => props.justify || "center"};
  margin-bottom: ${props => props.marginBottom};
  svg {
    cursor: pointer;
  }
`;

export const StyledDiv = styled.div`
  display: inline;
  text-align: left;
  font: ${props => props.fontStyle || "14px/19px Open Sans"};
  font-weight: ${props => props.fontWeight || 600};
  color: ${props => props.color || greyThemeDark1};
`;
