import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import loadable from '@loadable/component'
import Progress from '@edulastic/common/src/components/Progress'

const FroalaEditor = loadable(() =>
  import('@edulastic/common/src/components/FroalaEditor')
)

const Instruction = ({ instruction = '', updateTestData }) => {
  const onChange = (value) => {
    updateTestData('instruction')(value)
  }

  return (
    <StyledEditor
      fallback={<Progress />}
      toolbarId="test-instruction"
      value={instruction}
      onChange={onChange}
      placeholder="Instruction for the test"
      border="border"
      toolbarSize="SM"
    />
  )
}

Instruction.propTypes = {
  instruction: PropTypes.string,
  updateTestData: PropTypes.func.isRequired,
}

Instruction.defaultProps = {
  instruction: '',
}

export default Instruction

const StyledEditor = styled(FroalaEditor)`
  .fr-box {
    border-radius: 2px;
    min-height: 40px;
  }
`
