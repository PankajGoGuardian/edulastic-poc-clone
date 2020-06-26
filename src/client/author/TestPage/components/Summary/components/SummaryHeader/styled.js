import styled from "styled-components";

import { themeColor, white, linkColor1 } from "@edulastic/colors";

export const Container = styled.div`
  position: relative;
  margin-bottom: 35px;
  display: flex;
`;

export const ContainerLeft = styled.div`
  width: 50%;
`;
export const ContainerRight = styled.div`
  width: 50%;
`;

export const AvatarContainer = styled.div`
  padding: 20px 10px 20px 50px;
`;

export const Avatar = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 24px;
`;

export const CreatedByTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${themeColor};
`;

export const CreatedByValue = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${linkColor1};
`;
