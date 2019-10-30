import styled from "styled-components";
import { Col, Row, Select } from "antd";

import { Paper, FlexContainer } from "@edulastic/common";
import {
  lightGreySecondary,
  secondaryTextColor,
  dropZoneTitleColor,
  greenDark,
  desktopWidth,
  smallDesktopWidth
} from "@edulastic/colors";

export const Container = styled(Paper)`
  padding: 16px;
  @media (min-width: ${desktopWidth}) and (max-width: ${smallDesktopWidth}) {
    display: flex;
    align-items: flex-start;
  }
`;

export const SummarySelect = styled(Select)`
  margin-bottom: 23px;
  width: 100%;

  .ant-select-selection {
    border: 1px solid #e1e1e1;
    background: ${lightGreySecondary};

    &__placeholder {
      font-size: 13px;
      margin-left: 15px;
    }
  }

  @media (min-width: ${desktopWidth}) and (max-width: ${smallDesktopWidth}) {
    margin-bottom: 8px;
    width: 70%;
  }
`;

export const SummaryInfoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 10px;
  border-radius: 2px;
  background: ${lightGreySecondary};
  min-width: ${props => (props.minWidth ? props.minWidth : "")};
  width: 100%;
  height: 40px;

  @media (min-width: ${desktopWidth}) and (max-width: ${smallDesktopWidth}) {
    flex-direction: row-reverse;
    margin-bottom: 8px;
  }
`;

export const SummaryInfoNumber = styled.span`
  display: block;
  font-size: 18px;
  font-weight: 600;
  color: ${secondaryTextColor};
`;

export const SummaryInfoTitle = styled.span`
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: ${secondaryTextColor};
  margin-left: 5px;
`;

export const TableHeaderCol = styled(Col)`
  text-align: center;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  color: ${dropZoneTitleColor};
  padding: 22px 0;

  @media (min-width: ${desktopWidth}) and (max-width: ${smallDesktopWidth}) {
    padding: 0px 0px 16px;
  }
`;

export const TableBodyRow = styled(Row)`
  background: ${lightGreySecondary};
  border-radius: 2px;

  &:not(:last-child) {
    margin-bottom: 7px;
  }
  @media (min-width: ${desktopWidth}) and (max-width: ${smallDesktopWidth}) {
    margin-bottom: 8px;
  }
`;

export const TableBodyCol = styled(Col)`
  font-size: 14px;
  font-weight: 600;
  color: ${secondaryTextColor};
  text-align: center;
  padding: 7px 0;
`;

export const Standard = styled.span`
  display: inline-block;
  background: #d1f9eb;
  color: ${greenDark};
  font-size: 10px;
  font-weight: 700;
  border-radius: 5px;
  padding: 5px 20px;
  width: 100%;
  word-break: break-word;
`;

export const ImageWrapper = styled.div`
  @media (min-width: ${desktopWidth}) and (max-width: ${smallDesktopWidth}) {
    width: 25%;
    margin-right: 16px;
  }
`;

export const SelectWrapper = styled.div`
  @media (min-width: ${desktopWidth}) and (max-width: ${smallDesktopWidth}) {
    width: 25%;
    margin-top: 30px;
    margin-right: 16px;
  }
`;

export const GradWrapper = styled.div`
  @media (min-width: ${desktopWidth}) and (max-width: ${smallDesktopWidth}) {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;

export const SubjectWrapper = styled.div`
  @media (min-width: ${desktopWidth}) and (max-width: ${smallDesktopWidth}) {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;

export const SummaryWrapper = styled.div`
  @media (min-width: ${desktopWidth}) and (max-width: ${smallDesktopWidth}) {
    width: 10%;
    margin-right: 16px;
  }
`;

export const SummaryInfo = styled(FlexContainer)`
  @media (min-width: ${desktopWidth}) and (max-width: ${smallDesktopWidth}) {
    flex-direction: column;
    margin-top: 12px;
  }
`;

export const StandardWrapper = styled.div`
  @media (min-width: ${desktopWidth}) and (max-width: ${smallDesktopWidth}) {
    width: 40%;
  }
`;
