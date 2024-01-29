import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { appLanguages } from '@edulastic/constants'
import Menu from 'antd/lib/menu'
import styled from 'styled-components'

import { getCurrentLanguage, setLangAction } from './duck'
import { getItemDetailSelector } from '../../../author/ItemDetail/ducks'

const { LANGUAGES_OPTIONS } = appLanguages

const LanguageSelectorTab = ({
  currentLang,
  setLanguage,
  isEditView,
  item,
}) => {
  const handleChangeLanguage = ({ key }) => {
    setLanguage(key)
  }

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
      isPassage={item.isPassageWithQuestions}
      isEditView={isEditView}
    >
      {LANGUAGES_OPTIONS.map((language) => (
        <Menu.Item key={language.value}>{language.label}</Menu.Item>
      ))}
    </StyledMenu>
  )
}

export default connect(
  (state) => ({
    currentLang: getCurrentLanguage(state),
    item: getItemDetailSelector(state),
  }),
  {
    setLanguage: setLangAction,
  }
)(LanguageSelectorTab)

const StyledMenu = styled(Menu)`
  position: relative;
  top: ${({ isPassage }) => (isPassage ? '-35px' : '35px')};
  left: ${({ isPassage, isEditView }) =>
    isPassage ? (isEditView ? '315px' : '0px') : isEditView ? '315px' : '40px'};
  width: ${({ isPassage }) => (isPassage ? '100%' : '96%;')};
  background: transparent;
  z-index: 2;
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
