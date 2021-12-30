import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactOutsideEvent from 'react-outside-event'
import { EduButton, FlexContainer } from '@edulastic/common'
import { Input } from 'antd'
import { Container } from './styled'

class Prompt extends Component {
  constructor(props) {
    super(props)
    const { minValue } = this.props
    this.state = {
      position: minValue,
    }
  }

  handleChange = (e) => {
    this.setState({ position: e.target.value })
  }

  handleSuccess = () => {
    const { position } = this.state
    const { onSuccess } = this.props
    onSuccess(position)
  }

  onOutsideEvent = (event) => {
    const { setShowPrompt } = this.props
    if (event.type === 'mousedown') {
      setShowPrompt(false)
    }
  }

  render() {
    const { position } = this.state
    const { style, minValue, maxValue } = this.props
    return (
      <Container style={style}>
        <FlexContainer style={{ marginBottom: 10 }}>
          <Input
            placeholder="Position"
            type="number"
            value={position}
            min={minValue}
            max={maxValue}
            onChange={this.handleChange}
          />
        </FlexContainer>
        <FlexContainer justifyContent="center">
          <EduButton size="small" onClick={this.handleSuccess}>
            Reorder
          </EduButton>
        </FlexContainer>
      </Container>
    )
  }
}

Prompt.propTypes = {
  style: PropTypes.object,
  minValue: PropTypes.number,
  maxValue: PropTypes.number,
  onSuccess: PropTypes.func.isRequired,
}

Prompt.defaultProps = {
  minValue: 1,
  maxValue: 1,
  style: {},
}

export default ReactOutsideEvent(Prompt, ['mousedown'])
