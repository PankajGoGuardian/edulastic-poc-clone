import { Paper } from "@edulastic/common";
import { mobileWidth, themeColor, white } from "@edulastic/colors";
import styled from "styled-components";

export const Content = styled(Paper)`
  display: flex;
  margin: 0px 40px 50px 40px;
  flex-wrap: nowrap;
  padding: 0;
  position: relative;

  @media (max-width: ${mobileWidth}) {
    margin: 50px 25px;
  }
`;

export const PreviewContent = styled(Content)`
  @media (max-width: ${mobileWidth}) {
    & > div {
      padding: 0;
    }
  }
`;

export const ItemDetailWrapper = styled.div`
  display: flex;
  padding: 0px 40px 40px;
  flex-wrap: nowrap;
  width: 100%;

  @media (max-width: ${mobileWidth}) {
    margin-top: 0;
    padding: 0px 25px 25px;
  }
`;

export const ButtonClose = styled.div`
  width: 40px;
  height: 40px;
  padding: 10px;
  cursor: pointer;

  &:hover {
    svg {
      fill: ${white};
    }
  }

  svg {
    fill: ${white};
  }
`;

export const BackLink = styled.span`
  background: ${white};
  border-radius: 3px;
  height: 28px;
  font-size: 11px;
  font-weight: 600;
  line-height: 28px;
  padding: 0 20px;
  color: ${themeColor};
  text-transform: uppercase;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.07);
  cursor: pointer;
  display: inline-block;
  margin: 0 0 26px 25px;
  max-width: 140px;
  text-align: center;
`;
