import styled from "styled-components";
import { Card } from "antd";
import { FlexContainer } from "@edulastic/common";
import { IconChevronLeft } from "@edulastic/icons";
import { lightBlueSecondary } from "@edulastic/colors";

export const StyledFlexContainer = styled(FlexContainer)`
  width: 95%;
  margin: 15px auto;
  flex-wrap: ${({ flexWrap }) => (flexWrap ? "wrap" : "nowrap")};
  overflow: auto;
  align-items: baseline;
`;

export const StyledCard = styled(Card)`
  width: calc(50% - 10px);
  border-radius: 10px;
  margin-bottom: 10px;
  box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.1);
  .ant-card-body {
    padding: 30px 24px 24px;
  }
`;

export const StudentsCard = styled(Card)`
  border-radius: 10px;
  margin-bottom: 10px;
  box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.1);
  width: 95%;
  flex: none;
  .ant-card-body {
    padding: 30px 24px 24px;
    display: flex;
    flex-direction: column;
  }
`;

export const StudentsCardRow = styled.div`
  display: flex;
  justify-content: space-around;
`;

export const TableTitle = styled.div`
  color: #434b5d;
  font-size: 21px;
  line-height: 30px;
  font-weight: bold;
`;

export const StyledDivColor = styled.span`
  color: ${props => props.color};
  padding: 3px 0px;
  text-align: center;
  font-size: 16px;
  font-weight: 800;
  margin-right: 10px;
  &:last-child {
    margin-right: 0px;
  }
`;

export const StyledDivMid = styled.div`
  font-size: 16px;
  color: #434b5d;
  font-weight: 800;
  text-align: center;
  margin-bottom: 15px;
  &:last-child {
    margin-bottom: 0px;
  }
  img {
    margin-left: 18px;
  }
`;

export const QuestionContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const QuestionRow = styled.div`
  width: 100%;
  background-color: #f8f8f8;
  padding: 10px 25px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
`;

export const QuestionLabel = styled.div`
  color: #434b5d;
  font-size: 16px;
  font-weight: bold;
`;

export const StyledText = styled.div`
  font-family: Open Sans;
  font-weight: 800;
  font-size: 16px;
  color: ${props => props.color};
`;

const TitleText = styled.div`
  color: #aaafb5;
  font-size: 14px;
  font-weight: bold;
  text-transform: uppercase;
`;

export const StudentsTitle = styled(TitleText)``;
export const ScoreTitle = styled(TitleText)``;
export const ViewDetails = styled(TitleText)`
  color: #1774f0;
  font-weight: 600;
`;

export const IconExpand = styled(IconChevronLeft)`
  height: 12px;
  transform: ${({ up }) => (up ? "rotate(-270deg)" : "rotate(-90deg)")};
  margin: 0 16px 0 12px;
  cursor: pointer;
  fill: ${lightBlueSecondary};
  &:hover {
    fill: ${lightBlueSecondary};
  }
`;
