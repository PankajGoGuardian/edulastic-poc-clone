import styled from "styled-components";
import { Layout, Typography } from "antd";
const { Title } = Typography;
const { Header } = Layout;

export const HeaderWrapper = styled(Header)`
  background: #00ad50;
  height: 96px;
  display: flex;
  align-items: center;
`;
export const TitleWrapper = styled(Title)`
  font-size: 20px;
  color: white !important;
`;
