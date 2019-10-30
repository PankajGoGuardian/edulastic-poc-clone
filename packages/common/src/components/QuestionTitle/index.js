import React, { Fragment } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Stimulus } from "@edulastic/common";

const QuestionTitle = ({ label, stimulus, show, question, smallSize }) => (
  <Fragment>
    <QuestionTitleWrapper>
      {show && <QuestionNumberLabel>{label}:</QuestionNumberLabel>}
      {stimulus && (
        <Stimulus style={{ maxWidth: "100%" }} smallSize={smallSize} dangerouslySetInnerHTML={{ __html: stimulus }} />
      )}
      {question && question}
    </QuestionTitleWrapper>
  </Fragment>
);

QuestionTitle.propTypes = {
  question: PropTypes.any,
  stimulus: PropTypes.string,
  label: PropTypes.string,
  smallSize: PropTypes.bool.isRequired,
  show: PropTypes.string.isRequired
};

QuestionTitle.defaultProps = {
  question: null,
  stimulus: null,
  label: null
};

export default QuestionTitle;

const QuestionTitleWrapper = styled.div`
  display: flex;
  p {
    word-wrap: break-word;
    white-space: pre-wrap;
  }
`;

const QuestionNumberLabel = styled.section`
  font-size: ${props => props.fontSize || `${props.theme.fontSize}px`};
  font-weight: 700;
  margin-right: 6px;
  width: auto;
  word-break: normal;
`;
