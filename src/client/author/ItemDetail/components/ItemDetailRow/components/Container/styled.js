import { FlexContainer, Paper } from "@edulastic/common";
import { darkBlueSecondary, mobileWidth } from "@edulastic/colors";
import styled from "styled-components";

export const Content = styled(Paper)`
  width: 100%;
  height: 100%;
  left: 0;
  right: 0;
  padding: ${props => (props.padding ? props.padding : "0px")};
  overflow: hidden;

  @media (max-width: ${mobileWidth}) {
    padding: 33px 30px;
  }
`;

export const TabContainer = styled.div`
  margin-bottom: 30px;
`;

export const AddButtonContainer = styled(FlexContainer)`
  margin-bottom: 0;
  margin-top: 25px;
`;

export const MobileSide = styled.div`
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 220px);
  right: ${props => (props.type === "right" ? "0" : "unset")};
  left: ${props => (props.type === "left" ? "0" : "unset")};
  background: ${darkBlueSecondary};
  width: 25px;
  bottom: 20px;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
`;

export const WidgetContainer = styled.div`
  display: ${({ flowLayout }) => (flowLayout ? "flex" : "block")};
  flex-wrap: wrap;
  align-items: center;
`;
