import { Anchor, Radio, Select, Input, Button, Col } from "antd";
import styled from "styled-components";
import { titleColor } from "@edulastic/colors";

import {
  mobileWidth,
  mediumDesktopWidth,
  secondaryTextColor,
  white,
  linkColor1,
  cardTitleColor,
  lightGreySecondary,
  themeColor,
  red,
  blueBorder,
  smallDesktopWidth
} from "@edulastic/colors";
import { Paper } from "@edulastic/common";

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

    @media (max-width: ${mediumDesktopWidth}) {
      white-space: normal;
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
  margin-bottom: 30px;
  padding: ${props => (props.smallSize ? "15px" : "29px 30px 30px 30px")};
  background: ${props => (props.smallSize ? white : "#f8f8fb")};
  border-radius: 4px;
`;

export const Title = styled.div`
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 0.3px;
  color: ${secondaryTextColor};
`;

export const Body = styled.div`
  margin-top: 29px;
  background: ${white};
  padding: ${props => (props.smallSize ? "0" : "31px 22px")};
  border-radius: 4px;
  .sebPassword {
    width: 40%;
    margin-left: 30px;
    margin-right: 10px;
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
  font-size: 14px;
  line-height: 22px;
  color: #444444;
  margin-top: 34px;
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

  .ant-radio {
    margin-right: 25px;
  }

  .ant-radio-wrapper {
    margin-bottom: 18px;
    white-space: normal;
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
  color: ${linkColor1};
  font-weight: 700;
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
