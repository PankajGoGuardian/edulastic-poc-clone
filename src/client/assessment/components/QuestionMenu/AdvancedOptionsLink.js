import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { themeColorHoverBlue } from '@edulastic/colors'
import { FieldLabel } from '@edulastic/common'

const AdvancedOptionsLink = ({ bottom, isPremiumUser }) => (
  <AdvancedOptionsHeader bottom={bottom}>
    {isPremiumUser && (
      <FieldLabel>
        Enable
        <Link to="/author/profile" replace>
          <span className="power-use">&nbsp;power use&nbsp;</span>
        </Link>
        mode for advanced authoring options
      </FieldLabel>
    )}
    {!isPremiumUser && (
      <FieldLabel>
        <Link to="/author/subscription" replace>
          <span className="power-use">&nbsp;Upgrade&nbsp;</span>
        </Link>
        to access advanced authoring options like scoring settings, display
        options, dynamic parameters and more...
      </FieldLabel>
    )}
  </AdvancedOptionsHeader>
)

AdvancedOptionsLink.propTypes = {
  bottom: PropTypes.bool,
}

AdvancedOptionsLink.defaultProps = {
  bottom: false,
}

export default AdvancedOptionsLink

const AdvancedOptionsHeader = styled.div`
  margin: ${({ bottom }) => {
    if (bottom) {
      return '20px 0px 8px'
    }
    return '50px 0px'
  }};
  position: relative;

  .power-use {
    color: ${themeColorHoverBlue};
  }
`
