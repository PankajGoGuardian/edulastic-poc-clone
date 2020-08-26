import React from "react";
import { QuestionDetails, DetailRow, FlexWrap } from "./styled";
import Tags from "../Tags";

const QuestionPreviewDetails = ({
  id,
  createdBy,
  maxScore,
  depthOfKnowledge,
  authorDifficulty,
  bloomsTaxonomy,
  tags,
  standards
}) => (
  <QuestionDetails>
    <FlexWrap>
      <DetailRow font={11}>
        <label>ID: </label>
        <span>{id?.length > 6 ? id.substr(id.length - 6) : id || "--"}</span>
      </DetailRow>
      <DetailRow>
        <label>Owner: </label>
        <span>{createdBy.name || "--"}</span>
      </DetailRow>
      <DetailRow font={11}>
        <label>Points: </label>
        <span>{maxScore || "--"}</span>
      </DetailRow>
    </FlexWrap>

    <FlexWrap border="none" justify="flex-start">
      <DetailRow direction="column">
        <label>Depth of Knowledge</label>
        <span>{depthOfKnowledge || "--"}</span>
      </DetailRow>
      <DetailRow direction="column">
        <label>Difficulty Level</label>
        <span>{authorDifficulty || "--"}</span>
      </DetailRow>
      <DetailRow direction="column">
        <label>Bloom’s Taxonomy</label>
        <span>{bloomsTaxonomy || "--"}</span>
      </DetailRow>
    </FlexWrap>

    <FlexWrap border="none" direction="column" align="flex-start">
      <DetailRow className="standards">
        <label>Standard: </label>
        <div>
          <Tags tags={standards} show={7} />
        </div>
      </DetailRow>
      <DetailRow className="tags">
        <label>Tags: </label>
        <div>{(tags && tags.length && tags.map(tag => <span>{tag.tagName}</span>)) || "--"}</div>
      </DetailRow>
    </FlexWrap>
  </QuestionDetails>
);

export default QuestionPreviewDetails;
