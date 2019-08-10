import styled from "styled-components";
import { Layout, Button } from "antd";

import {
  themeColor,
  mainTextColor,
  borders,
  backgrounds,
  title,
  reportHeaderText,
  reportValue,
  extraDesktopWidth,
  largeDesktopWidth,
  desktopWidth
} from "@edulastic/colors";

import { Wrapper } from "../../styled";

export const LayoutContent = styled(Layout.Content)`
  width: 100%;
`;

export const WrapperReport = styled(Wrapper)`
  padding-left: 46px;
  padding-right: 46px;

  @media (max-width: ${extraDesktopWidth}) {
    padding-left: 40px;
    padding-right: 40px;
  }

  @media (max-width: ${largeDesktopWidth}) {
    padding-left: 32px;
    padding-right: 32px;
  }

  @media (max-width: ${desktopWidth}) {
    padding-left: 40px;
    padding-right: 40px;
  }
`;

export const ReportHeader = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding: 24px 0 9px;

  @media (max-width: ${extraDesktopWidth}) {
    padding: 22px 0 9px;
  }

  @media (max-width: ${largeDesktopWidth}) {
    padding: 18px 0 9px;
  }

  @media (max-width: ${desktopWidth}) {
    display: none;
  }
`;

export const ReportHeaderText = styled.p`
  margin: 0;
  font-size: 11px;
  font-weight: 700;
  color: ${reportHeaderText};
  text-transform: uppercase;
  text-align: center;
  letter-spacing: 0.6px;

  @media (max-width: ${largeDesktopWidth}) {
    font-size: 10px;
  }
`;

export const ReportHeaderName = styled(ReportHeaderText)`
  width: 28%;
  text-align: left;

  @media (max-width: ${extraDesktopWidth}) {
    width: 23.2%;
  }
`;

export const ReportHeaderDate = styled(ReportHeaderText)`
  width: 15%;
`;

export const ReportHeaderAttempt = styled(ReportHeaderText)`
  width: 10%;
  margin: 0 auto;

  @media (max-width: ${extraDesktopWidth}) {
    width: 10%;
    margin-left: 5%;
  }
`;

export const ReportHeaderCorrectAnswer = styled(ReportHeaderText)`
  width: 10%;
  margin: 0 auto;

  @media (max-width: ${extraDesktopWidth}) {
    width: 15%;
  }
`;

export const ReportHeaderAverageScore = styled(ReportHeaderText)`
  width: 10%;
  margin: 0 auto;

  @media (max-width: ${extraDesktopWidth}) {
    width: 15%;
  }
`;

export const ReportHeaderReview = styled(ReportHeaderText)`
  width: 15.5%;
`;

export const ReportList = styled.div``;

export const ReportWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding: 32px 0 38px;

  &:not(:first-child) {
    border-top: 1px solid ${borders.default};
  }

  @media (max-width: ${extraDesktopWidth}) {
    padding: 29px 0 19px;
  }

  @media (max-width: ${largeDesktopWidth}) {
    padding: 11px 0 35px;
  }

  @media (max-width: ${desktopWidth}) {
    padding: 18px 0 35px;
    width: 100%;
  }
`;

export const ReportName = styled.p`
  width: 28%;
  font-size: 16px;
  font-weight: 700;
  color: ${themeColor};

  @media (max-width: ${extraDesktopWidth}) {
    font-size: 14px;
    width: 23.2%;
  }

  @media (max-width: ${largeDesktopWidth}) {
    font-size: 12px;
  }

  @media (max-width: ${desktopWidth}) {
    width: 100%;
    text-align: center;
    font-size: 16px;
    line-height: 22px;
    margin-bottom: 13.7px;
  }
`;

export const ReportDate = styled.p`
  width: 15%;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  color: ${mainTextColor};

  @media (max-width: ${extraDesktopWidth}) {
    font-size: 12px;
  }

  @media (max-width: ${largeDesktopWidth}) {
    font-size: 11px;
  }

  @media (max-width: ${desktopWidth}) {
    width: 100%;
    font-size: 14px;
    line-height: 19px;
    margin-bottom: 15px;
  }
`;

export const ReportAttempt = styled.div`
  width: 10%;
  margin: 0 auto;
  text-align: center;

  @media (max-width: ${extraDesktopWidth}) {
    width: 10%;
    margin-left: 5%;
    margin-top: -13px;
    line-height: 1.2;
  }

  @media (max-width: ${desktopWidth}) {
    margin-left: 0;
    margin-top: 0;
    width: 33.3333%;
  }
`;

export const ReportAttemptValue = styled.p`
  margin: 0;
  font-size: 31px;
  font-weight: 700;
  color: ${title};

  @media (max-width: ${extraDesktopWidth}) {
    font-size: 26px;
  }

  @media (max-width: ${largeDesktopWidth}) {
    font-size: 20px;
  }

  @media (max-width: ${desktopWidth}) {
    font-size: 31px;
  }
`;

export const ReportAttemptsToggle = styled.span`
  display: block;
  font-size: 12px;
  font-weight: 600;
  text-align: center;
  cursor: pointer;
  position: relative;
  color: ${themeColor};
  width: 100%;
  max-width: 95px;
  margin: 0 auto -18px;

  &:before {
    content: "↓";
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%) ${({ active }) => active && "rotate(-180deg)"};
    transition: all 0.3s ease;
  }

  @media (max-width: ${largeDesktopWidth}) {
    font-size: 10px;
  }
`;

export const ReportAttempts = styled.div`
  display: ${({ active }) => (active ? "flex" : "none")};
  flex-wrap: wrap;
  width: 100%;
  max-width: 54%;
  margin-left: auto;
  margin-top: 28px;

  @media (max-width: ${extraDesktopWidth}) {
    max-width: 56%;
    margin-top: 18px;
  }

  @media (max-width: ${desktopWidth}) {
    max-width: 100%;
  }
`;

export const ReportAttemptItem = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 21px;
  background: ${backgrounds.primary};
  border-radius: 4px;
  margin-top: 7px;

  @media (max-width: ${desktopWidth}) {
    padding: 6px 9px;
  }
`;

export const ReportAttemptItemDate = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${reportValue};

  @media (max-width: ${largeDesktopWidth}) {
    font-size: 11px;
  }

  @media (max-width: ${desktopWidth}) {
    font-size: 12px;
  }
`;

export const ReportAttemptItemValue = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: ${reportValue};
  text-align: center;
  line-height: 1;

  @media (max-width: ${extraDesktopWidth}) {
    font-size: 14px;
  }

  @media (max-width: ${largeDesktopWidth}) {
    font-size: 12px;
  }
`;

export const ReportAttemptItemLink = styled.span`
  width: 20%;
  font-size: 11px;
  font-weight: 600;
  color: ${themeColor};
  text-align: center;
  text-transform: uppercase;

  @media (max-width: ${largeDesktopWidth}) {
    font-size: 10px;
  }

  @media (max-width: ${desktopWidth}) {
    width: auto;
    font-size: 11px;
  }
`;

export const ReportCorrectAnswer = styled.div`
  width: 10%;
  margin: 0 auto;
  text-align: center;
  font-size: 31px;
  font-weight: 700;
  color: ${title};

  @media (max-width: ${extraDesktopWidth}) {
    font-size: 26px;
    width: 15%;
    margin-top: -13px;
    line-height: 1.2;
  }

  @media (max-width: ${largeDesktopWidth}) {
    font-size: 20px;
    width: 15%;
    margin-top: -13px;
    line-height: 1.2;
  }

  @media (max-width: ${desktopWidth}) {
    width: 33.3333%;
    font-size: 31px;
    margin-top: 0;
  }
`;

export const ReportAverageScore = styled.div`
  width: 10%;
  margin: 0 auto;
  text-align: center;
  font-size: 31px;
  font-weight: 700;
  color: ${title};

  @media (max-width: ${extraDesktopWidth}) {
    font-size: 26px;
    width: 15%;
    margin-top: -13px;
    line-height: 1.2;
  }

  @media (max-width: ${largeDesktopWidth}) {
    font-size: 20px;
    width: 15%;
    margin-top: -13px;
    line-height: 1.2;
  }

  @media (max-width: ${desktopWidth}) {
    width: 33.3333%;
    font-size: 31px;
    margin-top: 0;
  }
`;

export const ReportReview = styled.div`
  width: 15.5%;
  text-align: right;

  @media (max-width: ${desktopWidth}) {
    width: 100%;
    text-align: center;
    margin-top: 42px;
  }
`;

export const ReportReviewButton = styled(Button)`
  font-size: 11px;
  color: ${themeColor};
  text-transform: uppercase;
  height: 40px;
  padding: 0 20px;
  min-width: 200px;
  border: 1px solid ${themeColor};
  border-radius: 4px;

  &.ant-btn {
    line-height: 40px;

    @media (max-width: ${largeDesktopWidth}) {
      line-height: 36px;
    }
  }

  @media (max-width: ${extraDesktopWidth}) {
    min-width: 150px;
  }

  @media (max-width: ${largeDesktopWidth}) {
    min-width: 130px;
    height: 36px;
    font-size: 10px;
  }

  @media (max-width: ${desktopWidth}) {
    min-width: 200px;
    font-size: 11px;
  }
`;

export const ReportMobileLabel = styled.span`
  display: none;
  font-size: 12px;
  font-weight: 600;
  color: ${title};
  margin-bottom: -18px;

  @media (max-width: ${desktopWidth}) {
    display: block;
  }
`;
