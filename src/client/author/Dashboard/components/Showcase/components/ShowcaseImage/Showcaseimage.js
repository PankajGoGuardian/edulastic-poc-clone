import React from "react";
import { ShowcaseContainer, River, OverlayGraph, OverlayText } from "./styled";
import { TextWrapper } from "../../../styledComponents";
import graph from "../../../../assets/svgs/graph.svg";
import bg from "../../../../assets/svgs/bg.svg";
const ShowcaseImage = () => (
  <ShowcaseContainer>
    <OverlayGraph src={graph} alt="" />
    <River src={bg} alt="" />
    <OverlayText>
      <TextWrapper display="block" size="20px" fw="bold">
        Make it Child's
      </TextWrapper>
      <TextWrapper size="12px" fw="bold" color="lightgrey">
        GET STARTED IN LESS THAN 60 SECONDS{" "}
      </TextWrapper>
    </OverlayText>
  </ShowcaseContainer>
);
export default ShowcaseImage;
