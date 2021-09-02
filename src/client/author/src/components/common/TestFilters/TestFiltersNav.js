import React from 'react'
import PropTypes from 'prop-types'
import { Menu, Icon } from 'antd'
import styled from 'styled-components'
import { IconFolders } from '@edulastic/icons'
import {
  white,
  mainTextColor,
  smallDesktopWidth,
  themeColor,
  themeColorBlue,
} from '@edulastic/colors'

const TestFiltersNav = ({ items, onSelect, search = {} }) => {
  let selected = items[0].path
  if (search.filter) {
    const getCurrent = items.find((item) => item.filter === search.filter) || {}
    selected = getCurrent?.path
  }
  return (
    <Container onSelect={onSelect} selectedKeys={[selected]}>
      {items.map((item) => (
        <Item data-cy={item.text} key={item.path}>
          {item.icon === 'folders' ? (
            <IconFolders className="anticon" />
          ) : (
            <Icon type={item.icon} />
          )}
          <span className={item.text === 'FOLDERS' ? 'folders' : ''}>
            {item.text}
          </span>
        </Item>
      ))}
    </Container>
  )
}

TestFiltersNav.propTypes = {
  items: PropTypes.array.isRequired,
  onSelect: PropTypes.func,
}

TestFiltersNav.defaultProps = {
  onSelect: () => {},
}

export default TestFiltersNav

const Container = styled(Menu)`
  border-right: none;
  background: transparent;
  margin-bottom: 5px;
`

const Item = styled(Menu.Item)`
  color: ${mainTextColor};
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.2px;

  .anticon {
    font-size: 18px;
    margin-right: 22px;
  }

  :hover {
    color: ${themeColor};

    svg {
      fill: ${themeColor};
    }
  }

  &.ant-menu-item {
    font-size: 11px;
    display: flex;
    align-items: center;
    text-transform: uppercase;
    .folders:hover {
      color: ${themeColorBlue};
    }

    @media (max-width: ${smallDesktopWidth}) {
      height: 30px;
      line-height: 30px;
      svg {
        width: 17px;
        height: 17px;
      }
    }
  }

  &.ant-menu-item-selected {
    border-left: 3px solid ${themeColor} !important;
    background-color: ${white} !important;
    color: ${themeColor};
    box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.1);
    border-radius: 0px 10px 10px 0px;
    &:hover {
      color: ${themeColorBlue};
    }
    svg {
      fill: ${themeColor};
    }
  }
`
