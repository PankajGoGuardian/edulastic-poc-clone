import styled from "styled-components";
import { tabletWidth, greyThemeLight, greyThemeLighter } from "@edulastic/colors";

export const FroalaInput = styled.div`
  border-radius: 4px;
  border: 0;
  flex: 1;
  height: ${({ isRnd }) => (!isRnd ? "auto" : "100%")};
  min-height: ${({ isRnd }) => (!isRnd ? "40px" : "0")};
  display: flex;
  // align-items: center;
  justify-content: center;
  text-align: center;
  border: ${({ noBorder }) => (noBorder ? "none" : `1px solid ${greyThemeLight}`)};
  padding-left: ${props => props.pl || "8px"};
  background: ${({ isRnd }) => (isRnd ? "transparent" : greyThemeLighter)};
  width: ${({ isRnd }) => (isRnd ? "auto" : "calc(100% - 50px)")};
  padding-right: ${({ isRnd }) => (isRnd ? "8px" : "0")};
  .fr-box {
    width: 100%;
  }
  .fr-view {
    overflow: hidden;
    width: 100%;
    min-height: 40px;
    padding: 8px 15px;
    text-align: left;
  }

  .drag-ans.wrap-text {
    max-width: 100%;
  }
`;

export const Header = styled.div`
  top: 0;
  left: 0;
  min-height: 40px;
  display: inline-flex;
  align-items: center;
  margin-bottom: 15px;

  span {
    font-size: 12px;
    font-weight: 600;
  }

  @media (max-width: ${tabletWidth}) {
    width: 100%;
  }
`;

export const AnnotationsStyle = styled.div``;

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 12px 0;
  width: 50px;

  @media (max-width: ${tabletWidth}) {
    flex-direction: column;
  }
`;
