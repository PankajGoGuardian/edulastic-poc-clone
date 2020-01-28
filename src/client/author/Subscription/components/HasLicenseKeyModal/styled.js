import styled from "styled-components";
import { Modal } from "antd";
import { lightGreySecondary, black, white, secondaryTextColor, titleColor } from "@edulastic/colors";

export const StyledHasLicenseKeyModal = styled(Modal)`
  width: 665px !important;
  height: 670px;

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
    padding: 30px 30px 20px 32px;
  }

  .ant-modal-body {
    background: ${white};
    width: calc(100% - 60px);
    margin: auto;
    padding: 30px 32px;
    font-size: 14px;
  }

  .ant-modal-footer {
    width: fit-content;
    margin: 6px auto;
    padding: 22px 10px;
  }

  .ant-modal-close-x {
    margin-top: 10px;
    margin-right: 20px;
  }

  svg {
    transform: scale(1.5);
    fill: ${black};
    top: 10px;
    right: 10px;
  }
`;

export const Title = styled.h5`
  color: ${secondaryTextColor};
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
`;

export const Container = styled.div`
  margin: auto;
  width: ${({ width }) => width + "px !important"};
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;
