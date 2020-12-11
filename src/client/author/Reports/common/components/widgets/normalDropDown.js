import React, { useState, useMemo, useCallback } from 'react'
import Button from "antd/es/Button";
import Dropdown from "antd/es/Dropdown";
import Menu from "antd/es/Menu";
import Icon from "antd/es/Icon";
import styled from 'styled-components'
import { partial } from 'lodash'

const CustomMenu = (className, data, handleMenuClick) => {
  return (
    <Menu className={`${className}`} onClick={handleMenuClick}>
      {data.map((item, index) => {
        return (
          <Menu.Item key={item.key} title={item.title}>
            {item.title}
          </Menu.Item>
        )
      })}
    </Menu>
  )
}

const NormalDropDown = ({
  className,
  containerClassName = '',
  by,
  updateCB,
  data,
  comData,
}) => {
  const [selected, setSelected] = useState(by)

  const handleMenuClick = useCallback(
    (event) => {
      const _selected = { key: event.key, title: event.item.props.title }
      setSelected(_selected)
      if (updateCB) {
        updateCB(event, _selected, comData)
      }
    },
    [updateCB]
  )

  return (
    <StyledDiv className={`${className} ${containerClassName} normal-dropdown`}>
      <Dropdown overlay={partial(CustomMenu, className, data, handleMenuClick)}>
        <Button>
          {selected.title}
          <Icon type="caret-down" />
        </Button>
      </Dropdown>
    </StyledDiv>
  )
}

const StyledDiv = styled.div`
  margin: 0px 5px;
  overflow: hidden;
  button {
    white-space: pre-wrap;
  }
`

const StyledNormalDropDown = styled(NormalDropDown)`
  max-height: 250px;
  overflow-y: scroll;
`

export { StyledNormalDropDown as NormalDropDown }
