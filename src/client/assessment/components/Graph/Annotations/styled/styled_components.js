import styled from "styled-components";
import { lightGrey, tabletWidth } from "@edulastic/colors";

import { TextField } from "@edulastic/common";

export const FroalaInput = styled.div`
  border-radius: 4px;
  border: 0;
  flex: 1;
  height: ${({ isRnd }) => (!isRnd ? "auto" : "100%")};
  min-height: ${({ isRnd }) => (!isRnd ? "40px" : "0")};
  display: flex;
  align-items: center;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.07);
  padding-left: 8px;
  background: ${({ isRnd }) => (isRnd ? "#efefef" : "#fff")};
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

export const PointField = styled(TextField)`
  width: 170px;
  max-height: 40px;
  min-height: 40px;
  line-height: 40px;
  padding: 0 15px;
  margin-right: 25px;
  border: 1px solid #e1e1e1;
`;

export const FormulaWrapper = styled.div`
  display: inline-block;
`;
FormulaWrapper.displayName = "FormulaWrapper";

export const DragHolder = styled.div`
  display: flex;
  align-items: center;
  min-height: 65px;
  background-color: #efefef;
  overflow: hidden;
  flex-wrap: wrap;
`;

export const AnnotationsStyle = styled.div`
  margin-top: 30px;
`;
