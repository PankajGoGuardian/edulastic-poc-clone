import React from 'react'
import Menu from "antd/es/menu";
import Icon from "antd/es/icon";
import { themeColor } from '@edulastic/colors'
import { ClassSelect, ClassStatusButton, ClassStatusDropdown } from './styled'

const options = ['Active', 'Archived']

const type = {
  class: 'Classes',
  group: 'Groups',
}

const ClassSelector = ({ filterClass, setFilterClass, currentTab }) => {
  const currentType = type[currentTab]

  const handleActiveClassClick = () => {
    setFilterClass(options[0])
  }
  const handleArchiveClassClick = () => {
    setFilterClass(options[1])
  }

  const menu = (
    <Menu>
      <Menu.Item key="1" onClick={handleActiveClassClick}>
        Active {currentType}
      </Menu.Item>
      <Menu.Item key="2" onClick={handleArchiveClassClick}>
        Archived {currentType}
      </Menu.Item>
    </Menu>
  )

  return (
    <ClassSelect>
      <ClassStatusDropdown
        getPopupContainer={(trigger) => trigger.parentNode}
        overlay={menu}
      >
        <ClassStatusButton data-cy="class-status">
          {`${filterClass || options[0]} ${currentType}`}{' '}
          <Icon color={themeColor} type="down" />
        </ClassStatusButton>
      </ClassStatusDropdown>
    </ClassSelect>
  )
}

export default ClassSelector
