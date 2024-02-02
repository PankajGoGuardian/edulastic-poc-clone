import React from 'react'
import IconPearAssessLogoCompact from '@edulastic/icons/src/IconPearAssessLogoCompact'
import styled from 'styled-components'
import { Menu } from 'antd'
import Dragger from 'antd/lib/upload/Dragger'

const AnimatedCompanion = () => {
  const items = [
    {
      key: 'hints',
      label: 'Hints',
      onClick: () => console.log('hint is clicked'),
    },
    {
      key: 'resources',
      label: 'Resoures',
      onClick: () => console.log('resources is clicked'),
    },
  ]
  return (
    <AnimatedCompanionWrapper>
      <Menu>
        <Menu.SubMenu
          title={<IconPearAssessLogoCompact width="60px" height="40px" />}
        >
          {items.map((item) => (
            <Menu.ItemGroup>
              <Menu.Item key={item.key} onClick={item.onClick}>
                {item.label}
              </Menu.Item>
            </Menu.ItemGroup>
          ))}
        </Menu.SubMenu>
      </Menu>
    </AnimatedCompanionWrapper>
  )
}

export default AnimatedCompanion

const AnimatedCompanionWrapper = styled.div`
  position: absolute;
  top: 80%;
  right: 5%;
  z-index: 99999;
`
