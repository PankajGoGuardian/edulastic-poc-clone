import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { appLanguages } from '@edulastic/constants'
import Menu from 'antd/lib/menu'
import styled from 'styled-components'

import { getCurrentLanguage, setLangAction } from './duck'

const { LANGUAGES_OPTIONS } = appLanguages

const LanguageSelectorTab = ({ currentLang, setLanguage }) => {
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
  }),
  {
    setLanguage: setLangAction,
  }
)(LanguageSelectorTab)

const StyledMenu = styled(Menu)`
  position: relative;
  margin-bottom: 20px;
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
