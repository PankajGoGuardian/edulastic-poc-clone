import React from "react";
import { FlexContainer } from "@edulastic/common";
import LeftButtons from "./LeftButtons";
import MidButtons from "./MidButtons";
import RightButtons from "./RightButtons";
import { MainToolBoxContainer } from "../styled";

const MainToolBox = props => (
  <MainToolBoxContainer id="main-tool" justifyContent="space-between">
    <FlexContainer>
      <LeftButtons {...props} />
      <MidButtons {...props} />
    </FlexContainer>
    <RightButtons {...props} />
  </MainToolBoxContainer>
);

export default MainToolBox;
