import React, { Component } from 'react'
import styled from 'styled-components'
import { themeColorBlue } from '@edulastic/colors'
import helpers from '../helpers'

export default function withKeyboard(WrappedComponent) {
  const StyledWrappedComponent = styled(WrappedComponent)`
    &:focus {
      outline: 0;
      box-shadow: ${({ enableShadowOutline }) =>
        enableShadowOutline ? `0 0 0 2px ${themeColorBlue}` : 'none'};
    }
  `

  return class extends Component {
    static displayName = `withKeyboard(${helpers.getDisplayName(
      WrappedComponent
    )})`

    state = {
      enableShadowOutline: false,
    }

    disableShadow = () => {
      const { enableShadowOutline } = this.state
      if (enableShadowOutline) this.setState({ enableShadowOutline: false })
    }

    enableShadow = (event) => {
      const { enableShadowOutline } = this.state
      if (event.keyCode === 9 && !enableShadowOutline) {
        this.setState({ enableShadowOutline: true })
      }
    }

    componentDidMount() {
      // Disable focus styling when mouse button is pressed
      document.body.addEventListener('mousedown', this.disableShadow)

      // Re-enable focus styling when Tab is pressed
      document.body.addEventListener('keydown', this.enableShadow)
    }

    componentWillUnmount() {
      document.body.removeEventListener('mousedown', this.disableShadow)

      document.body.removeEventListener('keydown', this.enableShadow)
    }

    render() {
      const {
        onClick,
        onClickEvent,
        onlySpaceKey = false,
        tool = [],
      } = this.props
      // #5 is for ScratchPad
      const isSratchPadEnabled = tool.includes(5)
      let supportedKeys = [13, 32]
      if (onlySpaceKey) supportedKeys = [32]
      return (
        <StyledWrappedComponent
          {...this.state}
          {...this.props}
          // If sratchpad is enabled than disabling tab key navigation to prevent user from attempting question
          tabIndex={isSratchPadEnabled ? '-1' : '0'}
          onKeyDown={(e) => {
            if (isSratchPadEnabled) return
            const code = e.which || e.keyCode
            // preventing default behavior if any key is pressed other than tab key
            if (code !== 9) {
              e.preventDefault()
            }
            if (supportedKeys.includes(code)) {
              if (onClickEvent) onClickEvent()
              else if (onClick) onClick()
            }
          }}
        />
      )
    }
  }
}
