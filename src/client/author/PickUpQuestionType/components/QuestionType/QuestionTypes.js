/* eslint-disable react/prop-types */
import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Dump } from "../../components";
import Card from "../Card/Card";
import { getCards } from "./constants";

const PickUpQuestionTypes = ({ onSelectQuestionType, questionType }) => (
  <FlexContainer>
    {getCards(onSelectQuestionType).map(
      ({ cardImage, data, onSelectQuestionType: onSelect, type }) =>
        type === questionType && (
          <Card key={data.title} title={data.title} data={data} cardImage={cardImage} onSelectQuestionType={onSelect} />
        )
    )}
    {[1, 2, 3, 4, 5, 6, 7].map(() => (
      <Dump />
    ))}
  </FlexContainer>
);

const FlexContainer = styled.div`
  width: calc(100% + 18px);
  display: flex;
  flex-wrap: wrap;
  align-content: baseline;
  margin: 0 -9px;
`;

PickUpQuestionTypes.propTypes = {
  onSelectQuestionType: PropTypes.func.isRequired
};

export default PickUpQuestionTypes;
