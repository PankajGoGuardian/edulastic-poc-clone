import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { SelectInputStyled } from '@edulastic/common'
import { appLanguages } from '@edulastic/constants'

import { getCurrentLanguage, setLangAction } from './duck'

const { Option } = SelectInputStyled
const { LANGUAGES_OPTIONS } = appLanguages

const LanguageSelector = ({ currentLang, setLanguage }) => {
  const handleChangeLanguage = (lang) => {
    setLanguage(lang)
  }

  useEffect(() => {
    return () => {
      setLanguage('')
    }
  }, [])

  return (
    <SelectInputStyled
      data-cy="language-selector"
      width="120px"
      height="30px"
      onSelect={handleChangeLanguage}
      value={currentLang}
      getPopupContainer={(triggerNode) => triggerNode.parentNode}
    >
      {LANGUAGES_OPTIONS.map((language) => (
        <Option value={language.value} key={language.value}>
          {language.label}
        </Option>
      ))}
    </SelectInputStyled>
  )
}

export default connect(
  (state) => ({
    currentLang: getCurrentLanguage(state),
  }),
  {
    setLanguage: setLangAction,
  }
)(LanguageSelector)
