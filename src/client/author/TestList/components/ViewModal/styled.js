import styled from "styled-components";
import { Card } from "@edulastic/common";
import { darkGrey, secondaryTextColor, themeColor, fadedGrey, lightGrey, white, greenDark } from "@edulastic/colors";

export const ModalTitle = styled.h2`
  font-weight: bolder;
  color: ${secondaryTextColor};
  font-size: 22px;
`;

export const ModalContainer = styled(Card)`
  color: ${secondaryTextColor};
  .ant-card-body {
    display: flex;
    padding: 32px;
    min-width: 750px;
  }
`;

export const Image = styled.div`
  min-height: 150px;
  height: auto;
  width: 95%;
  position: relative;
  background: ${props =>
    props.src ? `url(${props.src})` : `url("https://ak0.picdn.net/shutterstock/videos/4001980/thumb/1.jpg")`};
  background-repeat: no-repeat;
  background-size: contain;
  border-radius: 4px;
  margin-bottom: 15px;
`;

export const ModalColumn = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const Label = styled.div`
  font-size: 13px;
  font-family: "Open Sans, SemiBold";
  margin-top: 20px;
  margin-bottom: 10px;
  font-weight: 600;
`;

export const AssessmentNameLabel = styled(Label)``;
export const AssessmentName = styled.div`
  margin-left: 10px;
  font-size: 15px;
  font-weight: 600;
`;

export const DescriptionLabel = styled(Label)``;
export const Description = styled.div`
  font-size: 13px;
  margin-left: 15px;
`;

export const TagGrade = styled.span`
  text-transform: uppercase;
  border-radius: 5px;
  padding: 4px 15px;
  font-size: 10px;
  display: inline-block;
  margin-bottom: 5px;
  color: ${themeColor};
  background-color: rgba(66, 209, 132, 0.3);
  margin-right: 7px;
  font-weight: 700;

  :last-child {
    margin-right: 0;
  }
`;
export const TagsLabel = styled(Label)``;
export const TagsConatiner = styled.div`
  width: 100%;
`;

export const GradeLabel = styled(Label)``;
export const GradeConatiner = styled.div`
  width: 100%;
`;

export const SubjectLabel = styled(Label)``;
export const Subject = styled.div`
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 20px;
`;

export const Footer = styled.div`
  display: flex;
`;

export const FooterIcon = styled.div`
  align-items: center;
  margin-left: 15px;
  &:first-child {
    margin-left: 0px;
  }

  svg {
    transform: ${props => (props.rotate ? "rotate(180deg)" : "")};
  }
`;

export const IconText = styled.span`
  font-size: 11px;
  color: ${darkGrey};
`;

export const ButtonContainer = styled.div`
  display: flex;
  margin-bottom: 10px;
  justify-content: space-around;
`;

export const ButtonComponent = styled.div`
  width: ${({ size }) => (size === "large" ? "100%" : "165px")};
  float: right;
  font-size: 12px;
  color: ${({ bgColor }) => (bgColor ? white : themeColor)};
  background: ${({ bgColor }) => bgColor || "white"};
  padding: 8px;
  box-shadow: 0px 1px 1px 1px ${fadedGrey};
  border-radius: 4px;
  font-weight: 600;
  text-align: center;
  margin-right: 10px;
  cursor: pointer;
  &:hover {
    background: ${({ bgColor }) => (bgColor ? themeColor : lightGrey)};
  }
  &:last-child {
    margin-right: 0px;
  }
`;

export const SummaryContainer = styled.div`
  margin-top: 20px;
`;

export const SummaryTitle = styled.div`
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 8px;
`;

export const SummaryCardContainer = styled.div`
  display: flex;
`;

export const SummaryCard = styled.div`
  width: 165px;
  border-radius: 2px;
  background-color: #f8f8f8;
  display: flex;
  padding: 7px 14px;
  margin-right: 10px;
  align-items: center;
  &:last-child {
    margin-right: 0px;
  }
`;

export const SummaryCardLabel = styled.div`
  font-size: 12px;
  font-weight: 700;
`;

export const SummaryCardValue = styled.div`
  font-size: 20px;
  font-weight: 600;
  margin-right: 15px;
`;

export const SummaryList = styled.div`
  margin-top: 15px;
`;
export const ListHeader = styled.div`
  display: flex;
  padding: 5px 10px;
`;
export const ListHeaderCell = styled.div`
  color: #b1b1b1;
  font-size: 10px;
  font-weight: 600;
  text-align: center;
  flex: 1;
`;
export const ListRow = styled.div`
  padding: 7px 16px;
  background-color: #f8f8f8;
  margin-bottom: 5px;
  display: flex;
  align-items: center;
`;
export const ListCell = styled.div`
  font-size: 14px;
  color: #434b5d;
  font-weight: 600;
  text-align: center;
  flex: 1;
`;
export const SammaryMark = styled.div`
  text-transform: uppercase;
  border-radius: 5px;
  padding: 4px 15px;
  font-size: 10px;
  color: ${greenDark};
  background-color: #d1f9eb;
  font-weight: 700;
`;

export const IconWrapper = styled.span`
  margin-right: 4px;
  position: relative;
  top: 3px;
`;
