import styled from "styled-components";

import { greenDark, white } from "@edulastic/colors";

export const Container = styled.div`
  position: relative;
  margin-bottom: 35px;
`;

export const AvatarContainer = styled.div`
  position: absolute;
  left: 24px;
  bottom: 20px;
`;

export const Avatar = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  background: ${greenDark};
  color: ${white};
  font-size: 24px;
  font-weight: 700;
  padding-right: 5px;
  margin-right: 24px;

  &:after {
    display: block;
    position: absolute;
    top: 18px;
    right: 9px;
    content: "";
    width: 4px;
    height: 4px;
    border-radius: 4px;
    background: ${white};
  }
`;

export const CreatedByTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${greenDark};
`;

export const CreatedByValue = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${white};
`;
