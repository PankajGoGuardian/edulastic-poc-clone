export function changeDataToPreferredLanguage(questionData, languageData) {
  const languageDataKeys = Object.keys(languageData || {})
  languageDataKeys.forEach((key) => {
    if (key === 'validation') {
      questionData[key] = { ...questionData[key], ...languageData[key] }
    } else {
      questionData[key] = languageData[key]
    }
  })
}
