import {
  cardTitleColor,
  lightGreySecondary,
  linkColor1,
  mobileWidth,
  red,
  secondaryTextColor,
  smallDesktopWidth,
  themeColor,
  titleColor,
  white,
  mediumDesktopExactWidth,
  greyThemeLighter
} from "@edulastic/colors";
import { Paper } from "@edulastic/common";
import { Anchor, Button, Col, Input, Radio, Select, Table } from "antd";
import styled from "styled-components";

export const Container = styled(Paper)`
  margin-top: ${props => (props.marginTop ? props.marginTop : "27px")};

  @media screen and (max-width: 993px) {
    padding: 0;
  }
`;

export const StyledAnchor = styled(Anchor)`
  max-height: unset !important;

  .ant-anchor-ink {
    padding: 14px 0;
    left: 8px;

    &:before {
      background: #b9d5fa;
    }
  }

  .ant-anchor-link {
    position: relative;
    padding: 14px;
    @media (max-width: ${smallDesktopWidth}) {
      max-width: 200px;
    }

    &.ant-anchor-link-active:after {
      opacity: 1;
    }

    &:before {
      display: block;
      position: absolute;
      content: "";
      top: 14px;
      left: -5px;
      width: 8px;
      height: 8px;
      background: #b9d5fa;
      border-radius: 8px;
    }

    &:after {
      content: "";
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: ${themeColor};
      content: "";
      position: absolute;
      left: -7px;
      top: 14px;
      z-index: 5;
      opacity: 0;
      transition: all 0.3s ease;
    }
  }

  .ant-anchor-link-title {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.2px;
    color: ${linkColor1};
    text-transform: uppercase;
    white-space: normal;

    @media (min-width: ${mediumDesktopExactWidth}) {
      white-space: nowrap;
    }
  }

  .ant-anchor-link-title-active {
    color: ${themeColor};
    font-weight: 600;
  }

  .ant-anchor-ink-ball {
    background: ${themeColor};
    border: none;
  }
`;

export const Block = styled.div`
  margin-bottom: 20px;
  padding: ${props => (props.smallSize ? "15px" : "0")};
  background: ${white};
  border-radius: 4px;
`;

export const Title = styled.div`
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 0.3px;
  color: ${secondaryTextColor};
  display: flex;
  align-items: center;
  .ant-switch {
    margin-left: 25px;
  }
`;

export const Body = styled.div`
  background: ${white};
  padding: ${props => (props.smallSize ? "0" : "20px 0px")};
  border-radius: 4px;
  .sebPassword {
    margin-bottom: 10px;
    .ant-input {
      width: 40%;
      padding-left: 50px;
    }
  }
  .dirty .ant-input:focus {
    border-color: ${red};
  }
`;

export const FlexBody = styled.div`
  display: flex;
  margin-top: 30px;
  margin-bottom: 22px;
`;

export const Description = styled.div`
  font-size: 12px;
  line-height: 22px;
  color: #6a737f;
`;

export const StyledRadioGroup = styled(Radio.Group)`
  display: flex;
  flex-direction: column;

  span {
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.2px;
    color: #434b5d;
  }

  &.ant-radio-group {
    .ant-radio-wrapper {
      .ant-radio {
        margin-right: 0px;
        position: absolute;
        top: 0;
        left: 0;
        & + span {
          display: inline-block;
          padding-left: 35px;
        }
      }
    }
  }

  .ant-radio-wrapper {
    margin-bottom: 18px;
    white-space: normal;
    &:last-child {
      margin-bottom: 0px;
    }
  }
`;

export const StyledTable = styled(Table)`
  margin-left: ${({ isAdvanced }) => (isAdvanced ? "20px" : "0px")};
  .ant-table {
    color: #434b5d;
    font-size: 12px;
    font-weight: 600;

    .ant-table-thead > tr > th {
      border-bottom: 0px;
      color: #aaafb5;
      font-weight: bold;
      text-transform: uppercase;
      text-align: center;
      font-size: 10px;
      padding: 8px 8px 20px;
      background: white;
    }
    .ant-table-tbody > tr {
      & > td {
        border: none;
        background: none;
        text-align: center;
        padding: 8px;
        border-bottom: 1px solid #dddddd;
      }
      &.ant-table-row-hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td,
      &:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td {
        background: ${greyThemeLighter};
      }
    }
  }
`;

export const CompletionTypeRadio = styled(Radio)`
  text-transform: capitalize;
`;
export const RadioGroup = styled(Radio.Group)`
  span {
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.2px;
    color: #434b5d;
  }

  .ant-radio {
    margin-right: 25px;
  }

  .ant-radio-wrapper {
    margin-right: 40px;
  }
`;

export const StyledSelect = styled(Select)``;

export const MaxAttempts = styled(Input)``;

export const BlueText = styled.span`
  color: ${secondaryTextColor};
  font-weight: bold;
`;

export const BandsText = styled.span`
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.3px;
  color: #4aac8b;
`;

export const NormalText = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: ${cardTitleColor};
`;

export const InputTitle = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #434b5d;
  margin-bottom: 12px;
`;

export const ActivityInput = styled(Input)`
  font-weight: 600;
  background: ${lightGreySecondary};
  border: none;
  border-radius: 2px;
`;

export const InputPassword = styled(Input)``;
export const MessageSpan = styled.span`
  color: ${red};
`;

export const MaxAnswerChecksInput = styled(Input)``;

export const AdvancedSettings = styled.div``;

export const NavigationMenu = styled.div`
  position: absolute;
  max-height: calc(100vh - 100px);
  padding: 0 0 0 10px;
  margin-left: -20px;

  .ant-anchor {
    padding-left: 10px;
  }

  ${({ fixed }) => {
    if (fixed) {
      return `
        position: fixed;
        top: 110px;
        max-height: calc(100vh - 170px);
      `;
    }
  }}
`;

export const AdvancedButton = styled(Button)`
  padding: 0;
  border: none;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 600;
  color: ${linkColor1};
  box-shadow: none;
  margin-top: 20px;
  width: 190px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  svg {
    transform: ${props => (props.show ? "rotate(180deg)" : "none")};
  }
`;

export const Line = styled.div`
  border-top: 1px solid #00b0ff;
  width: calc((100% - 285px) / 2);
  position: relative;
  top: 20px;
`;

export const RadioWrapper = styled(Block)`
  padding: 0;

  &:not(:last-child) {
    margin-bottom: 15px;
  }

  .ant-row {
    padding: 14px 22px;
    background: ${white};
    border-radius: 4px;

    &:not(:last-child) {
      margin-bottom: 15px;
    }
  }

  @media (max-width: ${mobileWidth}) {
    .ant-row {
      display: flex;
      flex-direction: column;
      align-items: center;
      border: 1px solid #e8e8e8;
      padding-top: 20px;

      &:first-child {
        margin-top: 20px;
      }

      .ant-col-8 {
        text-align: center;
        margin-bottom: 20px;
      }
    }
  }
`;

export const StyledCol = styled(Col)`
  display: flex;
  align-items: center;
`;

export const Label = styled.label`
  font-weight: 600;
  color: ${titleColor};
`;
