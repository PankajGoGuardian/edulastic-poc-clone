import styled from "styled-components";
import { textColor, newBlue, mobileWidth } from "@edulastic/colors";

export const AdditionalToggle = styled.span`
  cursor: pointer;
  text-transform: uppercase;
  font-size: 11px;
  color: ${textColor};
  position: relative;
  margin-top: 2px;
  display: inline-block;
  letter-spacing: 0.1px;

  &:before {
    content: "";
    position: absolute;
    top: 6px;
    right: -28px;
    border-top: 5px solid ${newBlue};
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    transition: all 0.3s ease;
    transform: ${({ active }) => (active ? "rotate(180deg)" : "rotate(0deg)")};
  }
`;

export const AdditionalContainer = styled.div`
  margin-top: 34px;
`;

export const AdditionalCompareUsing = styled.div`
  max-width: 390px;
  margin-bottom: 28px;

  > div {
    display: flex;
    align-items: center;
  }

  label {
    margin: 0 auto 0 6px;
  }

  .ant-select {
    max-width: 260px;

    &-selection-selected-value {
      font-size: 12px;
      padding-left: 15px;
    }
  }

  @media (max-width: ${mobileWidth}) {
    > div {
      flex-wrap: wrap;
    }

    label {
      width: 100%;
      margin: 0 0 15px;
    }
    .ant-select {
      width: 100%;
      max-width: 100%;
    }
  }
`;

export const AdditionalContainerRule = styled.div`
  display: block;
  width: 100%;
  text-align: right;
`;

export const AdditionalAddRule = styled.span`
  cursor: pointer;
  margin-left: auto;
  text-transform: uppercase;
  color: ${newBlue};
  display: inline-block;
  font-size: 11px;
  letter-spacing: 0.4px;
`;
