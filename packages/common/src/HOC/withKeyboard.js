import React, { Component } from 'react'
import styled from 'styled-components'
import { themeColorBlue } from '@edulastic/colors'
import helpers from '../helpers'

export default function withKeyboard(WrappedComponent) {
  const StyledWrappedComponent = styled(WrappedComponent)`
    &:focus {
      outline: 0;
      box-shadow: 0 0 0 2px ${themeColorBlue};
    }
  `

  return class extends Component {
    static displayName = `withKeyboard(${helpers.getDisplayName(
      WrappedComponent
    )})`

    render() {
      const { onClick, onClickEvent, onlySpaceKey = false } = this.props
      let supportedKeys = [13, 32]
      if (onlySpaceKey) supportedKeys = [32]
      return (
        <StyledWrappedComponent
          {...this.state}
          {...this.props}
          tabIndex="0"
          onKeyDown={(e) => {
            const code = e.which
            if (supportedKeys.includes(code)) {
              if (onClick) onClick()
              else if (onClickEvent) onClickEvent()
            }
          }}
        />
      )
    }
  }
}
