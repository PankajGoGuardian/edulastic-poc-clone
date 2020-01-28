import styled from "styled-components";
import { Modal } from "antd";
import { white, secondaryTextColor, largeDesktopWidth, titleColor } from "@edulastic/colors";

export const CompareModal = styled(Modal)`
  width: calc(100% - 80px) !important;

  .ant-modal-header,
  .ant-modal-body,
  .ant-modal-footer,
  .ant-modal-content {
    background: transparent;
    border: none;
    box-shadow: unset;
    color: ${titleColor};
  }

  .ant-modal-body {
    display: flex;
    align-items: stretch;
    justify-content: center;
    margin-top: 40px;
  }
  .ant-modal-close {
    top: -30px;
  }

  svg {
    transform: scale(1.5);
    fill: ${white};
  }
`;

export const PlanCard = styled.div`
  width: 400px;
  min-height: 731px;
  background: ${white};
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  margin: 10px 15px;
  user-select: none;

  @media (max-width: ${largeDesktopWidth}) {
    width: 300px;
  }
`;

export const PlanHeader = styled.div`
  height: 60px;
  font-size: 20px;
  color: ${({ color }) => color};
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const PlanLabel = styled.div`
  width: 100%;
  height: 54px;
  color: ${white};
  background: ${({ color }) => color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
`;

export const PlanContent = styled.div`
  width: 330px;
  margin: 30px;

  @media (max-width: ${largeDesktopWidth}) {
    width: 220px;
  }
`;

export const PlanTitle = styled.div`
  font-weight: 700;
  color: ${secondaryTextColor};
`;

export const PlanDescription = styled.div`
  margin-bottom: 23px;
`;
