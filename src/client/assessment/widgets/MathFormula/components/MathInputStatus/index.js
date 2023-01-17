import React from 'react'
import PropTypes from 'prop-types'
import { EduIf } from '@edulastic/common'

import { Wrapper } from './styled/Wrapper'
import { Icon } from './styled/Icon'
import { IconCheck } from './styled/IconCheck'
import { IconClose } from './styled/IconClose'

class MathInputStatus extends React.PureComponent {
  render() {
    const { valid } = this.props
    return (
      <Wrapper>
        <Icon>
          <EduIf condition={valid}>
            <IconCheck aria-label=", Correct answer" />
          </EduIf>
          <EduIf condition={!valid}>
            <IconClose aria-label=", Incorrect answer" />
          </EduIf>
        </Icon>
      </Wrapper>
    )
  }
}

MathInputStatus.propTypes = {
  valid: PropTypes.bool,
}

MathInputStatus.defaultProps = {
  valid: false,
}

export default MathInputStatus
