import { lightGrey4, secondaryTextColor } from "@edulastic/colors";
import { DatePicker } from "antd";
import styled from "styled-components";

export const Container = styled.div`
  padding: 0 0 20px;
`;

export const MainFilterItems = styled.div`
  margin-top: 4px;
`;

export const Item = styled.div`
  margin-top: 10px;
`;

export const ItemRelative = styled(Item)`
  position: relative;
`;

export const IconWrapper = styled.span`
  position: absolute;
  right: 10px;
  top: 35px;
  z-index: 1;
  color: ${lightGrey4};
`;

export const ItemHeader = styled.span`
  display: block;
  font-size: 12px;
  color: ${secondaryTextColor};
  font-weight: 600;
  letter-spacing: 0.2px;
  margin-bottom: 8px;
`;

export const ItemBody = styled.div`
  margin-bottom: 15px;
`;

export const StyledDatePicker = styled(DatePicker)`
  width: 100%;
  input {
    height: 40px;
    border: none;
  }
`;
