import React, { useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { appLanguages } from '@edulastic/constants'
import Menu from 'antd/lib/menu'
import styled from 'styled-components'

import get from 'lodash/get'
import { LANGUAGE_EN, LANGUAGE_ES } from '@edulastic/constants/const/languages'
import { getCurrentLanguage, setLangAction } from './duck'
import {
  getItemDetailSelector,
  getPassageSelector,
} from '../../../author/ItemDetail/ducks'
import { StyledBetaTag } from '../../../author/AssessmentPage/VideoQuiz/styled-components/QuestionForm'

const { LANGUAGES_OPTIONS } = appLanguages

const LanguageSelectorTab = ({
  currentLang,
  setLanguage,
  isEditView,
  item,
  passage,
}) => {
  const isIntialLanguageSet = useRef()
  const handleChangeLanguage = ({ key }) => {
    setLanguage(key)
  }

  useEffect(() => {
    if (item._id !== 'new' && !isIntialLanguageSet.current) {
      let languageCode = LANGUAGE_EN
      if (item.isPassageWithQuestions) {
        languageCode = LANGUAGES_OPTIONS.find(
          (o) => o.label.toLowerCase() === passage.language?.toLowerCase()
        )?.value
      } else {
        const firstQuestion = get(item, ['data', 'questions', '0'])
        if (
          !firstQuestion?.stimulus?.length &&
          firstQuestion?.languageFeatures
        ) {
          languageCode = Object.keys(firstQuestion.languageFeatures).shift()
        }
      }
      setLanguage(languageCode)
      isIntialLanguageSet.current = true
    }
  }, [item, passage])

  useEffect(() => {
    return () => {
      setLanguage('')
    }
  }, [])

  return (
    <StyledMenu
      data-cy="language-selector"
      onClick={handleChangeLanguage}
      selectedKeys={[currentLang]}
      mode="horizontal"
      isPassage={item.isPassageWithQuestions || item.multipartItem}
      isEditView={isEditView}
    >
      {LANGUAGES_OPTIONS.map((language) => (
        <Menu.Item key={language.value}>
          {language.label}{' '}
          {language.value === LANGUAGE_ES && (
            <StyledBetaTag alignItems="left">BETA</StyledBetaTag>
          )}{' '}
        </Menu.Item>
      ))}
    </StyledMenu>
  )
}

export default connect(
  (state) => ({
    currentLang: getCurrentLanguage(state),
    item: getItemDetailSelector(state),
    passage: getPassageSelector(state),
  }),
  {
    setLanguage: setLangAction,
  }
)(LanguageSelectorTab)

const StyledMenu = styled(Menu)`
  position: relative;
  top: ${({ isPassage }) => (isPassage ? '0px' : '35px')};
  left: ${({ isPassage, isEditView }) =>
    isPassage ? (isEditView ? '315px' : '0px') : isEditView ? '315px' : '40px'};
  width: ${({ isPassage }) => (isPassage ? '100%' : '96%;')};
  background: transparent;
  .ant-menu-item {
    z-index: 999;
  }
  .ant-menu-item:hover {
    color: #1ab394;
    border-bottom: 2px solid #1ab394;
  }
  .ant-menu-item-selected,
  .ant-menu-item-active {
    color: #1ab394;
    border-bottom: 2px solid #1ab394;
  }
`
