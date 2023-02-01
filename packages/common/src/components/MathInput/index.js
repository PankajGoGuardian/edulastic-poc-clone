import React from 'react'
import { WithResources } from '../../HOC/withResources'

import MathInput from './MathInput'
import AppConfig from '../../../../../src/app-config'

class MathInputWithResources extends React.PureComponent {
  mathInputRef = React.createRef()

  setFocus = () => {
    if (this.mathInputRef?.current) {
      this.mathInputRef.current.focus?.()
    }
  }

  render() {
    return (
      <WithResources
        criticalResources={[AppConfig.jqueryPath]}
        resources={[
          `${AppConfig.mathquillPath}/mathquill.css`,
          `${AppConfig.mathquillPath}/mathquill.min.js`,
        ]}
        fallBack={<span />}
      >
        <MathInput ref={this.mathInputRef} {...this.props} />
      </WithResources>
    )
  }
}

export default MathInputWithResources
