import { Anchor, Radio, Select, Input, Button } from "antd";
import styled from "styled-components";

import {
  mobileWidth,
  secondaryTextColor,
  white,
  linkColor1,
  cardTitleColor,
  lightGreySecondary,
  lightBlueSecondary
} from "@edulastic/colors";
import { Paper } from "@edulastic/common";

export const Container = styled(Paper)`
  margin-top: 27px;

  @media screen and (max-width: 993px) {
    padding: 0;
  }
`;

export const StyledAnchor = styled(Anchor)`
  max-height: unset !important;

  .ant-anchor-ink {
    padding: 25px 0;

    &:before {
      background: #b9d5fa;
    }
  }

  .ant-anchor-link {
    position: relative;
    padding: 20px 30px;

    &:before {
      display: block;
      position: absolute;
      content: "";
      top: 22px;
      left: -5px;
      width: 8px;
      height: 8px;
      background: #b9d5fa;
      border-radius: 8px;
    }
  }

  .ant-anchor-link-title {
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.2px;
    color: ${linkColor1};
    text-transform: capitalize;
  }

  .ant-anchor-link-title-active {
    color: ${lightBlueSecondary};
    font-weight: 600;
  }

  .ant-anchor-ink-ball {
    background: ${lightBlueSecondary};
    border: none;
  }
`;

export const Block = styled.div`
  margin-bottom: 30px;
  padding: ${props => (props.smallSize ? "15px" : "29px 30px 30px 30px")};
  background: ${props => (props.smallSize ? white : "#f8f8fb")};
  border-radius: 4px;

  .ant-input {
    height: 40px;
    font-size: 13px;
    border-radius: 4px;
  }
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
export const GenerateReportSelect = styled(Select)`
  height: 40px;
`;
export const TestTypeSelect = styled(GenerateReportSelect)`
  width: 80%;
  margin-right: 30px;
`;

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

export const InputPassword = styled(Input)`
  width: 40%;
  margin-left: 30px;
`;

export const MaxAnswerChecksInput = styled(Input)`
  width: 40%;
`;

export const AdvancedSettings = styled.div``;

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
