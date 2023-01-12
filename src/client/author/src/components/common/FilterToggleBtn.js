import React, { Component } from 'react'
import { EduIf } from '@edulastic/common'
import { IconCloseFilter, IconFilter } from '@edulastic/icons'
import { white, filterIconColor, themeColor } from '@edulastic/colors'
import styled from 'styled-components'
import { Button } from 'antd'

class FilterToggleBtn extends Component {
  render() {
    const { isShowFilter, toggleFilter, header } = this.props
    return (
      <MobileLeftFilterButton
        data-cy="filter"
        header={header}
        isShowFilter={!isShowFilter}
        variant="filter"
        onClick={toggleFilter}
        aria-label={isShowFilter ? 'show filters' : 'hide filters'}
        aria-expanded={!isShowFilter}
      >
        <EduIf condition={isShowFilter}>
          <IconFilter
            color={filterIconColor}
            width={20}
            height={20}
            aria-hidden
            focusable={false}
          />
        </EduIf>
        <EduIf condition={!isShowFilter}>
          <IconCloseFilter color={themeColor} aria-hidden focusable={false} />
        </EduIf>
      </MobileLeftFilterButton>
    )
  }
}

export default FilterToggleBtn

const MobileLeftFilterButton = styled(Button)`
  min-width: 35px;
  min-height: 25px;
  padding: 2px;
  padding-top: 5px;
  position: fixed;
  margin-left: -20px;
  margin-top: 24px;
  z-index: 100;
  box-shadow: none;
  background: ${white};
  border: none !important;

  &:focus,
  &:hover {
    outline: unset;
    background: ${white};
  }
`
