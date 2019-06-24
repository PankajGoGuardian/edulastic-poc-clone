import styled from "styled-components";
import { Layout } from "antd";
const { Header } = Layout;

export const HeaderWrapper = styled(Header)`
  background: ${props => props.theme.header.headerBgColor};
  padding: 0px 20px;
  height: 96px;
  display: flex;
  align-items: center;
`;
export const TitleWrapper = styled.h1`
  font-size: ${props => props.theme.header.headerTitleFontSize};
  color: ${props => props.theme.header.headerTitleTextColor};
  font-weight: bold;
`;
