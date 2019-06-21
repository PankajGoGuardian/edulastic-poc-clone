import styled from "styled-components";
import { Typography, Icon, Col, Row, Divider } from "antd";

const { Paragraph, Text } = Typography;

// shared styled components
export const TextWrapper = styled(Text)`
  color: ${props => (props.color ? props.color : "#444444")};
  font-size: ${props => (props.size ? props.size : "14px")};
  font-family: "Open Sans";
  text-align: ${props => (props.textalign ? props.textalign : "")};
  display: ${props => (props.display ? props.display : "inline-block")};
  margin-bottom: ${props => (props.mb ? props.mb : "")};
  font-weight: ${props => (props.fw ? props.fw : "SemiBold")};
  padding: ${props => props.padding};
`;
export const LinkWrapper = styled.a`
  color: ${props => (props.color ? props.color : "")};
  font-size: ${props => props.size};
  font-family: "Open Sans";
  text-align: ${props => (props.textalign ? props.textalign : "")};
  display: ${props => (props.display ? props.display : "inline-block")};
`;

export const IconContainer = styled.span`
  width: ${props => (props.width ? props.width : "100%")};
  height: ${props => (props.height ? props.height : "100%")};
  opacity: ${props => (props.opacity ? props.opacity : "100%")};
  border-radius: 50%;
  background: ${props => (props.bgcolor ? props.bgcolor : "white")};
  padding: ${props => (props.padding ? props.padding + "rem" : "1rem")};
  text-align: center;
  margin-bottom: ${props => (props.mb ? props.mb : "")};
  margin-top: ${props => (props.mt ? props.mt : "")};
  margin-right: ${props => (props.mr ? props.mr : "")};
  margin-left: ${props => (props.ml ? props.ml : "")};
  cursor: pointer;
`;

export const SvgWrapper = styled(Icon)`
  padding: 0;
`;
