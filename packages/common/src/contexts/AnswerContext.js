import React from "react";

const AnswerContext = React.createContext({
  isAnswerModifiable: true,
  showAnswers: true
});

export default AnswerContext;
