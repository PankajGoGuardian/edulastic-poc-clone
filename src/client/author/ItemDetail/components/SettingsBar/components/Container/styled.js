import styled from "styled-components";
import { title, white, mobileWidth } from "@edulastic/colors";

export const Content = styled.div`
  width: 25vw;
  background: ${white};
  position: fixed;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 1030;
  padding: 30px;
  box-shadow: -3px 3px 6px 0 rgba(0, 0, 0, 0.16);
  overflow-y: auto;

  @media (max-width: ${mobileWidth}) {
    width: 100%;
  }
`;

export const SettingsButtonWrapper = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
`;

export const Heading = styled.div`
  color: ${title};
  margin-bottom: 30px;
  font-size: 20px;
  font-weight: 700;
`;

export const Items = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

export const Checkboxes = styled.div`
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
`;
