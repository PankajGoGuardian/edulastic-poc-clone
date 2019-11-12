import { Table, Button } from "antd";
import { white, boxShadowDefault, themeColor, mediumDesktopExactWidth } from "@edulastic/colors";
import styled from "styled-components";

export const Container = styled.div`
  margin: 20px;
  padding: 30px;
  background: ${white};
  border-radius: 10px;
  box-shadow: ${boxShadowDefault};
`;

export const Title = styled.h1`
  font-size: 20px;
  color: ${white};
  font-weight: bold;
`;

export const ApplyButton = styled(Button)`
  background: ${white};
  color: ${themeColor};
  padding: 0px 30px;
  margin-left: 15px;
  display: flex;
  align-items: center;
  height: 36px;
  font-weight: 600;
  &:hover,
  &:focus {
    background: ${white};
    color: ${themeColor};
  }

  @media (min-width: ${mediumDesktopExactWidth}) {
    height: 45px;
  }
`;

export const StyledTable = styled(Table)`
  margin-top: 20px;
`;

export const InputsWrapper = styled.div`
  margin-top: 20px;
`;

export const OptionTitle = styled.h3`
  font-weight: bold;
`;
