/* eslint-disable react/prop-types */
import React from "react";
import { get } from "lodash";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import styled from "styled-components";
import { Dump } from "../../components";
import Card from "../Card/Card";
import { getCards } from "./constants";

const PickUpQuestionTypes = ({ onSelectQuestionType, questionType, isPassageItem }) => (
  <FlexContainer>
    {getCards(onSelectQuestionType, isPassageItem).map(
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
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  align-content: baseline;
  margin: 0px;
`;

PickUpQuestionTypes.propTypes = {
  onSelectQuestionType: PropTypes.func.isRequired
};

export default connect(
  state => ({ isPassageItem: get(state, ["itemDetail", "item", "isPassageWithQuestions"], false) }),
  null
)(PickUpQuestionTypes);
