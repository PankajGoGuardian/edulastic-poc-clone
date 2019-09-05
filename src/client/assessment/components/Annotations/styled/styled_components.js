import styled from "styled-components";
import { tabletWidth } from "@edulastic/colors";

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
  box-shadow: ${({ isRnd }) => (isRnd ? "none" : "0 2px 5px 0 rgba(0, 0, 0, 0.07)")};
  padding-left: 8px;
  background: ${({ isRnd }) => (isRnd ? "transparent" : "#fff")};
  width: ${({ isRnd }) => (isRnd ? "auto" : "400px")};
  padding-right: ${({ isRnd }) => (isRnd ? "8px" : "0")};
  margin-right: ${({ isRnd }) => (isRnd ? "0" : "10px")};
  .fr-box {
    width: 100%;
  }
  [class^="fr-"] {
    height: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
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

export const AnnotationsStyle = styled.div`
  margin-top: 30px;
`;

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 0;
  width: 50%;

  @media (max-width: ${tabletWidth}) {
    flex-direction: column;
  }
`;
