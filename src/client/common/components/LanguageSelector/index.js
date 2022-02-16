import React, { useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import { SelectInputStyled } from '@edulastic/common'
import { appLanguages } from '@edulastic/constants'

import { getCurrentLanguage, setLangAction } from './duck'
import {
  getItemLangSelector,
  setTTSLanguageAction,
} from '../../../author/ItemDetail/ducks'

const { Option } = SelectInputStyled
const { LANGUAGES_OPTIONS, TTS_LANGUAGES, LANGUAGE_EN } = appLanguages

const LanguageSelector = ({
  qLang,
  ttsLang,
  setLanguage,
  setTTSLanguage,
  isTTSLanguage,
}) => {
  const handleChangeLanguage = (lang) => {
    if (!isTTSLanguage) {
      setLanguage(lang)
    } else {
      setTTSLanguage(lang)
    }
  }

  useEffect(() => {
    if (!isTTSLanguage) {
      return () => {
        setLanguage('')
      }
    }
  }, [isTTSLanguage])

  const [opts, value] = useMemo(() => {
    if (isTTSLanguage) {
      return [TTS_LANGUAGES, ttsLang || LANGUAGE_EN]
    }
    return [LANGUAGES_OPTIONS, qLang]
  }, [isTTSLanguage, qLang, ttsLang])

  return (
    <SelectInputStyled
      data-cy="language-selector"
      width="120px"
      height="30px"
      onSelect={handleChangeLanguage}
      value={value}
      getPopupContainer={(triggerNode) => triggerNode.parentNode}
    >
      {opts.map((language) => (
        <Option value={language.value} key={language.value}>
          {language.label}
        </Option>
      ))}
    </SelectInputStyled>
  )
}

export default connect(
  (state) => ({
    qLang: getCurrentLanguage(state),
    ttsLang: getItemLangSelector(state),
  }),
  {
    setLanguage: setLangAction,
    setTTSLanguage: setTTSLanguageAction,
  }
)(LanguageSelector)
