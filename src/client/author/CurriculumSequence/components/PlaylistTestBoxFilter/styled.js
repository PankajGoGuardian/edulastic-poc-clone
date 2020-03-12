import styled from "styled-components";
import { Checkbox } from "antd";
import { title, themeColor } from "@edulastic/colors";

export const FilterContainer = styled.div`
  height: auto;
  margin-bottom: 20px;
`;

export const Title = styled.div`
  text-transform: uppercase;
  color: ${title};
  font-size: 12px;
  font-weight: 700;
  margin: 10px 0px;
  user-select: none;
`;

export const StyledCheckbox = styled(Checkbox)`
  margin: 8px 0 !important;
  color: ${title};
  font-size: 12px;
  font-weight: semi-bold;
  text-transform: uppercase;
  user-select: none;
`;

export const Item = styled.div`
  user-select: none;
  height: 40px;
  line-height: 40px;
  padding-left: 15px;
  margin: 20px 0px;
  font-size: 20px;
  color: ${({ active }) => (active ? themeColor : title)};
  border-left: ${({ active }) => active && "4px solid " + themeColor};
  cursor: pointer;
`;

export const Label = styled.label`
  color: ${({ active }) => (active ? themeColor : title)};
  font-weight: 600;
  text-align: left;
  font-size: 14px;
  letter-spacing: 0;
  padding-left: 25px;
  cursor: inherit;
`;
