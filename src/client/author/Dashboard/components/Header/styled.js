import styled from "styled-components";
import { Layout, Button, Typography } from "antd";
import { IconPlusCircle } from "@edulastic/icons";
import { green, mediumDesktopWidth } from "@edulastic/colors";

const { Text } = Typography;
const { Header } = Layout;

export const HeaderWrapper = styled(Header)`
  position: fixed;
  z-index: 300;
  width: 100%;
  background: ${props => props.theme.header.headerBgColor};
  padding: 0px 30px;
  height: 96px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: ${mediumDesktopWidth}) {
    height: 60px;
  }
`;
export const TitleWrapper = styled.h1`
  font-size: ${props => props.theme.header.headerTitleFontSize};
  color: ${props => props.theme.header.headerTitleTextColor};
  font-weight: bold;
`;

export const ManageClassButton = styled(Button)`
  margin-right: 100px;
  display: flex;
  align-items: center;
  height: 45px;
  color: ${props => props.theme.header.headerBgColor};
  border-radius: 3px;
  margin-left: 25px;
  padding: 5px 20px;
  border-radius: 50px;
  &:hover {
    color: ${props => props.theme.header.headerBgColor};
  }

  @media (max-width: ${mediumDesktopWidth}) {
    height: 36px;
  }
`;

export const IconPlus = styled(IconPlusCircle)`
  margin-right: 0.5rem;
  width: 20px;
  height: 20px;
`;
export const ButtonText = styled(Text)`
  color: ${green};
`;
