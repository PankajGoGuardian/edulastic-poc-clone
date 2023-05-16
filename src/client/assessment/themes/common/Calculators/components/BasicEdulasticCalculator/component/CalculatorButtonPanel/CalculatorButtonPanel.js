import React from 'react'
import PropTypes from 'prop-types'
import CalculatorButton from '../CalculatorButton/CalculatorButton'

import { StyledDiv, StyledDivF } from './styled-components'

const keyBoardKeysSupported = '1234567890/*+-=%.'.split('')
keyBoardKeysSupported.push('Enter', 'Delete')

const keyCodesSupported = {
  13: 'Enter',
  46: 'Delete',
  48: '0',
  49: '1',
  50: '2',
  51: '3',
  52: '4',
  53: '5',
  54: '6',
  55: '7',
  56: '8',
  57: '9',
  96: '0',
  97: '1',
  98: '2',
  99: '3',
  100: '4',
  101: '5',
  102: '6',
  103: '7',
  104: '8',
  105: '9',
  106: '*',
  107: '+',
  109: '-',
  110: '.',
  111: '/',
  187: '=',
  189: '-',
  190: '.',
  191: '/',
  'shift+53': '%',
  'shift+187': '+',
}

class CalculatorButtonPanel extends React.Component {
  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyPress)
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyPress)
  }

  handleKeyPress = (e) => {
    const { key, shiftKey, keyCode } = e
    let keySymbol = ''
    if (shiftKey) {
      keySymbol = key || keyCodesSupported[`shift+${keyCode}`] || ''
    } else {
      keySymbol = key || keyCodesSupported[keyCode] || ''
    }

    if (keyBoardKeysSupported.includes(keySymbol)) {
      const { clickHandler } = this.props
      let value = keySymbol
      if (keySymbol === '/') {
        value = '÷'
      } else if (keySymbol === '*') {
        value = 'x'
      } else if (keySymbol === 'Enter') {
        value = '='
      }
      clickHandler(value)
    }
  }

  handleClick = (buttonName) => {
    const { clickHandler } = this.props
    clickHandler(buttonName)
  }

  render() {
    return (
      <StyledDiv>
        <StyledDivF>
          <CalculatorButton name="AC" clickHandler={this.handleClick} />
          <CalculatorButton name="+/-" clickHandler={this.handleClick} />
          <CalculatorButton name="%" clickHandler={this.handleClick} />
          <CalculatorButton name="÷" clickHandler={this.handleClick} orange />
        </StyledDivF>
        <StyledDivF>
          <CalculatorButton name="7" clickHandler={this.handleClick} />
          <CalculatorButton name="8" clickHandler={this.handleClick} />
          <CalculatorButton name="9" clickHandler={this.handleClick} />
          <CalculatorButton name="x" clickHandler={this.handleClick} orange />
        </StyledDivF>
        <StyledDivF>
          <CalculatorButton name="4" clickHandler={this.handleClick} />
          <CalculatorButton name="5" clickHandler={this.handleClick} />
          <CalculatorButton name="6" clickHandler={this.handleClick} />
          <CalculatorButton name="-" clickHandler={this.handleClick} orange />
        </StyledDivF>
        <StyledDivF>
          <CalculatorButton name="1" clickHandler={this.handleClick} />
          <CalculatorButton name="2" clickHandler={this.handleClick} />
          <CalculatorButton name="3" clickHandler={this.handleClick} />
          <CalculatorButton name="+" clickHandler={this.handleClick} orange />
        </StyledDivF>
        <StyledDivF>
          <CalculatorButton name="0" clickHandler={this.handleClick} wide />
          <CalculatorButton name="." clickHandler={this.handleClick} />
          <CalculatorButton name="=" clickHandler={this.handleClick} orange />
        </StyledDivF>
      </StyledDiv>
    )
  }
}
CalculatorButtonPanel.propTypes = {
  clickHandler: PropTypes.func.isRequired,
}
export default CalculatorButtonPanel
