import styled from "styled-components";
import { white } from "@edulastic/colors";
import { Tag } from "antd";

const StandardTags = styled(Tag)`
  color: ${white};
  margin: 0px 3px;
  font-size: 12px;
  cursor: pointer;
`;

export default StandardTags;
