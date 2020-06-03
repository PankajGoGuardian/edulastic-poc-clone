import React from "react";

const QuestionContext = React.createContext({
  questionId: ""
});

export const QuestionContextProvider = QuestionContext.Provider;

export default QuestionContext;
