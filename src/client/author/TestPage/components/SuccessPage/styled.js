import { Typography } from "antd";
import styled from "styled-components";
import { mobileWidth, tabletWidth, blue, white, darkGrey, lightGrey, lightGrey4 } from "@edulastic/colors";
import { FlexContainer, Card, Button } from "@edulastic/common";
const { Paragraph } = Typography;

export const Container = styled.div`
  padding: 0 44px 20px 46px;
  left: 0;
  right: 0;
  height: 100%;
  overflow: auto;
  margin-top: 20px;
  @media (max-width: ${mobileWidth}) {
    padding: 0 26px 45px 26px;
  }
`;

export const Main = styled.div`
  flex: 1;
  width: 100%;
`;

export const AssignButton = styled(Button)`
  position: relative;
  min-width: 130px;
  height: 45px;
  color: ${blue};
  border-radius: 3px;
  background: ${white};
  justify-content: space-around;
  margin-left: 20px;
`;

export const StyledCard = styled(Card)`
  border-radius: 5;
  overflow-x: auto;

  .ant-card-body {
    padding: 24px;
  }

  @media (max-width: ${tabletWidth}) {
    display: none;
  }
`;

export const FlexContainerWrapper = styled(FlexContainer)`
  @media (max-width: 770px) {
    width: 50%;
  }
  width: 900px;
  margin: 60px auto;
  justify-content: center;
  flex-direction: column;
  height: 500px;
  background-color: ${white};
`;

export const StyledFlexContainer = styled(FlexContainer)`
  @media (max-width: ${tabletWidth}) {
    width: 100%;
    background-color: ${white};
    display: flex;
    justify-content: space-around;
  }

  @media (max-width: ${mobileWidth}) {
    width: 100%;
    background-color: ${white};
    display: flex;
    justify-content: space-around;
  }

  @media (max-width: 770px) {
    background-color: ${white};
    display: flex;
    justify-content: space-between;
    flex-direction: row-reverse;
    width: 100%;
  }
`;

export const SecondHeader = styled.div`
  display: flex;
  flex-direction: ${props => (props.isMobileSize ? "row" : "column")}
  justify-content: space-between;

  & > div > .ant-btn {
    background: transparent;
    height: 24px;
    margin-left: 17px;
    & > button {
      height: 24px;
      margin-top: -1px;
    }
  }
`;

export const FlexTitle = styled.div`
  display: flex;
  font-weight: 800;
  font-size: 18px;
  margin-bottom: 10px;
`;

export const FlexTextWrapper = styled.div`
  display: flex;
  font-size: 14px;
  margin-bottom: 40px;
  color: ${darkGrey};
`;
export const FlexText = styled.div`
  display: flex;
  margin-bottom: 20px;
  color: ${darkGrey};
`;
export const linkWrapper = styled.span``;

export const FlexShareContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;
export const FlexShareTitle = styled.div`
  display: flex;
  font-weight: 800;
  margin-bottom: 10px;
`;

export const FlexShareWithBox = styled.div`
  display:flex;
  border: 1px solid ${lightGrey};
  height:40px;
  width:500px; 
  margin-bottom:10px;
  justify-content:space-between;
  padding:8px 10px
  box-shadow: 0px 5px 6px ${lightGrey4};
`;

export const FlexShareBox = styled.div`
  display: flex;
  border: 1px solid ${lightGrey};
  height: 40px;
  width: 500px;
  padding: 8px 10px;
  background-color: ${lightGrey};
  color: ${blue};
  justify-content: space-between;
  margin-bottom: 10px;
`;

export const IconWrapper = styled.span`
  cursor: pointer;
  position: relative;
  top: 3px;
`;

export const TitleCopy = styled(Paragraph)`
  &.ant-typography {
    color: ${blue};
    display: flex;
    justify-content: space-between;
    width: 100%;
  }
  button {
    margin-right: 10px;
  }
  svg {
    width: 20px;
    height: 20px;
    color: ${blue};
  }
`;
