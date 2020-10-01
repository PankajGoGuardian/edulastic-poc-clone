import React from 'react'

const AnswerContext = React.createContext({
  isAnswerModifiable: true,
  hideAnswers: false,
})

export default AnswerContext
