import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import { camelCase } from 'lodash'

import { HeaderTabs } from '@edulastic/common'
import { StyledTabs } from '@edulastic/common/src/components/HeaderTabs'

const HeaderNavigation = ({ navigationItems, activeItemKey }) => (
  <StyledNavigationTabs>
    {navigationItems.map((item) => {
      const isActive = activeItemKey === item.key
      return (
        <HeaderTabs
          dataCy={camelCase(item.key)}
          isActive={isActive}
          to={item.location}
          linkLabel={item.title}
        />
      )
    })}
  </StyledNavigationTabs>
)

HeaderNavigation.propTypes = {
  navigationItems: PropTypes.array,
  activeItemKey: PropTypes.string,
}

HeaderNavigation.defaultProps = {
  navigationItems: [],
  activeItemKey: '',
}

export default HeaderNavigation

const StyledNavigationTabs = styled(StyledTabs)`
  padding-right: 30px;
`
