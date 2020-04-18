import { Table, Button } from "antd";
import { white, themeColor, mediumDesktopExactWidth } from "@edulastic/colors";
import styled from "styled-components";

export const Container = styled.div`
  margin: 20px;
  background: ${white};
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
  .ant-radio-wrapper {
    display: block;
  }
`;

export const OptionTitle = styled.h3`
  font-weight: bold;
`;

export const SecondHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px;
  .ant-btn {
    background: transparent;
    height: 24px;
    margin-left: 17px;
  }
`;
