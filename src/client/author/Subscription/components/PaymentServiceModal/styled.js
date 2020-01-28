import styled from "styled-components";
import { Modal } from "antd";
import { lightGreySecondary, white, secondaryTextColor, themeColor, titleColor } from "@edulastic/colors";

export const StyledPaymentServiceModal = styled(Modal)`
  width: 454px !important;
  height: 380px;

  .ant-modal-header,
  .ant-modal-body,
  .ant-modal-footer,
  .ant-modal-content {
    background: ${lightGreySecondary};
    border: none;
    box-shadow: unset;
    color: ${titleColor};
  }

  .ant-modal-header {
    padding: 25px 30px;
    background: ${themeColor};
    color: ${white};
    height: 100px;
  }

  .ant-modal-footer {
    display: none;
  }

  .ant-modal-close-x {
    margin: 12px;
  }

  svg {
    transform: scale(1.8);
    fill: ${white};
  }

  .ant-input {
    padding-left: 40px !important;
  }
`;

export const StyledSpan = styled.h5`
  color: ${secondaryTextColor};
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  text-align: center;
`;

export const StyledTitle = styled.h3`
  font-weight: 700;
  color: ${white};
  text-align: center;
  margin-top: 6px;
`;

export const IconSpan = styled.span`
  svg {
    margin-top: 4px;
    transform: scale(1.2);
    fill: ${secondaryTextColor};
  }
`;
