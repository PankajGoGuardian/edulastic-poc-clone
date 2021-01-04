export const changeDataToPreferredLanguage = (questionData, languageData) => {
  const languageDataKeys = Object.keys(languageData || {})
  languageDataKeys.forEach((key) => {
    questionData[key] = languageData[key]
  })
}
