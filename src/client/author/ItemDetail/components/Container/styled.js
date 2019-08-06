import { Paper } from "@edulastic/common";
import { mobileWidth, themeColor, white } from "@edulastic/colors";
import styled from "styled-components";

export const Content = styled(Paper)`
  display: flex;
  flex-wrap: nowrap;
  padding: ${props => (props.padding ? props.padding : "0px")};
  position: relative;
`;

export const PreviewContent = styled(Content)`
  padding: ${props => (props.padding ? props.padding : "0px")};
  @media (max-width: ${mobileWidth}) {
    & > div {
      padding: 0;
    }
  }
`;

export const ContentWrapper = styled.div`
  padding: 20px 30px;
`;

export const ItemDetailWrapper = styled.div`
  display: flex;
  padding: ${props => (props.padding ? props.padding : "0px 30px 40px")};
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
