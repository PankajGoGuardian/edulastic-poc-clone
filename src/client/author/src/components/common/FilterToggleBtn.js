import React, { Component } from 'react'
import { IconCloseFilter, IconFilter } from '@edulastic/icons'
import { white, filterIconColor, themeColor } from '@edulastic/colors'
import styled from 'styled-components'
import { Button } from 'antd'

class FilterToggleBtn extends Component {
  render() {
    const { isShowFilter, toggleFilter, header } = this.props
    return (
      <>
        <MobileLeftFilterButton
          data-cy="filter"
          aria-label="Toggle filter"
          title="Toggle filter"
          header={header}
          isShowFilter={!isShowFilter}
          variant="filter"
          onClick={toggleFilter}
        >
          {!isShowFilter ? (
            <IconCloseFilter color={themeColor} />
          ) : (
            <IconFilter
              color={!isShowFilter ? white : filterIconColor}
              width={20}
              height={20}
            />
          )}
        </MobileLeftFilterButton>
      </>
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
