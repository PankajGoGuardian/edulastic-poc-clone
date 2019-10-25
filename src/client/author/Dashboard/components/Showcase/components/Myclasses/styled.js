import { Paper } from "@edulastic/common";
import styled from "styled-components";
import { extraDesktopWidthMax, mediumDesktopExactWidth } from "@edulastic/colors";

export const Container = styled(Paper)`
  margin: 30px auto 20px auto;
  padding: 30px;
  width: calc(100% - 60px);
  min-height: ${props => `calc(100vh - ${props.theme.HeaderHeight.xs + 60}px)`};
  border: none;
  box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.1);
  border-radius: 10px;

  @media (min-width: ${mediumDesktopExactWidth}) {
    min-height: ${props => `calc(100vh - ${props.theme.HeaderHeight.md + 60}px)`};
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    min-height: ${props => `calc(100vh - ${props.theme.HeaderHeight.xl + 60}px)`};
  }
`;

export const CardBox = styled.div`
  background: #ffffff;
  margin-bottom: 16px;
  padding: 9px 14px 22px;
  border-radius: 8px;
  box-shadow: 0px 2px 5px #00000012;
`;
