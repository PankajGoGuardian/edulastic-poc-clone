import React from "react";

import Wrapper from "./Wrapper";
import Title from "./Title";
import Text from "./Text";
import { FlexContainer } from "@edulastic/common";

const Hints = ({ questions = [] }) => {
  // checking for empty hints;
  const validHints = questions.reduce((acc, question) => {
    // checking if the hints have an empty label, if so filtering them
    acc = question.hints.filter(hint => hint.label.length > 0).length;
    return acc;
  }, 0);
  if (!validHints) return null;
  return (
    <Wrapper>
      <Title>Hints</Title>
      {questions.map(question => (
        <FlexContainer justifyContent="flex-start" marginBottom="1rem">
          {question.hints.map(hint => (
            <Text dangerouslySetInnerHTML={{ __html: hint.label }} />
          ))}
        </FlexContainer>
      ))}
    </Wrapper>
  );
};

export default Hints;
