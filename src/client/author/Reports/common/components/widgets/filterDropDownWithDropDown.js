import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Button, Dropdown, Menu, Icon } from 'antd'
import { themeColor, white } from '@edulastic/colors'
import { IconFilter } from '@edulastic/icons'
import { NormalDropDown } from './normalDropDown'
import { ControlDropDown } from './controlDropDown'

export const FilterDropDownWithDropDown = ({
  className,
  updateCB,
  data,
  values,
}) => {
  const [visible, setVisible] = useState(false)

  const handleMenuClick = (event) => {}

  const handleVisibleChange = (flag) => {
    setVisible(flag)
  }

  const updateNormalDropDownCB = (event, selected, comData) => {
    updateCB(event, selected, comData)
  }

  const menu = (
    <StyledMenu className={`${className}`} onClick={handleMenuClick}>
      {data.map((item, index) => {
        return (
          <StyledControlDropDownContainer>
            <p className="menu-title">{item.title}</p>
            <ControlDropDown
              key={item.key}
              by={values && values[item.key] ? values[item.key] : item.data[0]}
              selectCB={updateNormalDropDownCB}
              data={item.data}
              comData={item.key}
            />
          </StyledControlDropDownContainer>
        )
      })}
    </StyledMenu>
  )

  return (
    <StyledContainer className={`${className || ''}`}>
      <Dropdown
        overlay={menu}
        visible={visible}
        onVisibleChange={handleVisibleChange}
        trigger={['click']}
      >
        <StyledButton>
          <IconFilter
            color={visible ? white : themeColor}
            width={20}
            height={29}
          />
        </StyledButton>
      </Dropdown>
    </StyledContainer>
  )
}

const StyledButton = styled(Button)`
  margin: 5px;
  width: 44px;
  padding: 0px;
`

const StyledMenu = styled(Menu)`
  min-width: 230px;
  padding: 5px 0 10px;
`

const StyledIcon = styled(Icon)`
  color: ${themeColor};
`

const StyledContainer = styled.div`
  .ant-dropdown-open {
    background: ${themeColor};
  }
`

const StyledControlDropDownContainer = styled.div`
  padding: 5px 17px;

  p.menu-title {
    margin-bottom: 4px;
    font-weight: 600;
    font-size: 12px;
  }

  .control-dropdown {
    margin: 0px;
    padding: 0px;
    padding-top: 4px;

    .ant-btn {
      width: 100%;
      height: 40px;
      span {
        font-size: 12px;
      }
    }
  }
`
