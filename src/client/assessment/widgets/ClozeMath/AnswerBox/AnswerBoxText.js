import PropTypes from "prop-types";
import styled from "styled-components";
import { white } from "@edulastic/colors";
import MathSpanWrapper from "../../../components/MathSpanWrapper";

const AnswerBoxText = ({ children, isMath }) => {
  return (
    <Text data-cy="correct-answer-box">{isMath ? <MathSpanWrapper latex={children} /> : <span>{children}</span>}</Text>
  );
};

AnswerBoxText.propTypes = {
  children: PropTypes.string.isRequired,
  isMath: PropTypes.bool.isRequired
};

export default AnswerBoxText;

const Text = styled.div`
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${white};
  min-width: 80px;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
`;
