import React from "react";

import { FlexContainer } from "@edulastic/common";
import { ThemeProvider } from "styled-components";
import Wrapper from "./Wrapper";
import Title from "./Title";
import Text from "./Text";

const Hints = ({ questions = [] }) => {
  /**
   * input
   * questions: [
   * {
   *  ...restProps,
   *  hints: [{label: "", value: ""}]
   * },
   * {
   *  ...restProps,
   *  hints: [{label: "", value: ""}]
   * }
   * ]
   *
   * output: a number >= 0
   *
   * logic:
   * for all questions, check if there are hints
   * for all hints check if the label is not empty
   * empty label is possible when a user entered something in the hint and then cleared it (obj is not removed)
   *
   * a number > 0 would indicate the current item has hints which have non empty label
   */

  //  TODO :  need to remove the object if the hint is cleared
  const validHints = questions.reduce((acc, question) => {
    if (question.hints) {
      // handling cases when hints are undefined
      acc += question.hints.filter(hint => hint.label.length > 0).length;
    }
    return acc;
  }, 0);
  if (!validHints) return <Wrapper>No Hints</Wrapper>;
  return (
    <ThemeProvider theme={{ isV1Migrated: questions[0]?.isV1Migrated }}>
      <Wrapper margin="10px" className="fr-view">
        <Title>Hints</Title>
        {questions.map(question => {
          return question.hints ? (
            <FlexContainer justifyContent="flex-start" marginBottom="1rem">
              {question.hints.map(hint => (
                <Text dangerouslySetInnerHTML={{ __html: hint.label }} />
              ))}
            </FlexContainer>
          ) : (
            ""
          );
        })}
      </Wrapper>
    </ThemeProvider>
  );
};

export default Hints;
