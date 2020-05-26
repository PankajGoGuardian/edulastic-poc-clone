import styled from "styled-components";
import { textColor, themeColor, mobileWidth, extraDesktopWidthMax } from "@edulastic/colors";

export const AdditionalToggle = styled.span`
  cursor: pointer;
  text-transform: uppercase;
  font-size: ${props => props.theme.smallFontSize};
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
    border-top: 5px solid ${themeColor};
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    transition: all 0.3s ease;
    transform: ${({ active }) => (active ? "rotate(180deg)" : "rotate(0deg)")};
  }

  @media (min-width: ${extraDesktopWidthMax}) {
    font-size: ${props => props.theme.widgetOptions.labelFontSize};
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
  flex: 3;
  label {
    margin: 0 auto 0 6px;
  }

  .ant-select {
    max-width: 260px;

    &-selection-selected-value {
      font-size: ${props => props.theme.smallFontSize};
      padding-left: 15px;

      @media (min-width: ${extraDesktopWidthMax}) {
        font-size: ${props => props.theme.widgetOptions.labelFontSize};
      }
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
  color: ${themeColor};
  display: inline-block;
  font-size: ${props => props.theme.smallFontSize};
  letter-spacing: 0.4px;

  @media (min-width: ${extraDesktopWidthMax}) {
    font-size: ${props => props.theme.widgetOptions.labelFontSize};
  }
`;
