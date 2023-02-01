/* eslint-disable */
import React from 'react'
import Display from './component/Display/Display'
import CalculatorButtonPanel from './component/CalculatorButtonPanel/CalculatorButtonPanel'
import calculate from './logic/calculate'
import { StyledDiv } from './styled-components'

export class BasicEdulasticCalculator extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      total: null,
      next: null,
      operation: null,
    }
  }

  handleClick = (buttonName) => {
    if (buttonName === 'Delete') {
      this.setState({ total: null, next: null, operation: null })
    } else {
      this.setState(calculate(this.state, buttonName))
    }
  }

  render() {
    return (
      <StyledDiv className="component-app">
        <Display value={this.state.next || this.state.total || '0'} />
        <CalculatorButtonPanel clickHandler={this.handleClick} />
      </StyledDiv>
    )
  }
}
