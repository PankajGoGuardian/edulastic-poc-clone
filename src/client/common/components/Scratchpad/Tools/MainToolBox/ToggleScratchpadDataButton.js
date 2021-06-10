import React, { useContext } from 'react'
import { AssessmentPlayerContext } from '@edulastic/common'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { getUserRole } from '../../../../../author/src/selectors/user'
import { toggleScratchpadVisbilityAction } from '../../duck'
import { TogglerWrapper } from '../styled'

function Toggler({ userRole, hideData, toggleVisibility }) {
  const isTeacher = userRole === 'teacher'
  const state = hideData ? 'show' : 'hide'
  const { isStudentAttempt } = useContext(AssessmentPlayerContext)

  return (
    <TogglerWrapper
      onClick={toggleVisibility}
      isTeacher={isTeacher && !isStudentAttempt}
    >
      {state} student work
    </TogglerWrapper>
  )
}

Toggler.propTypes = {
  userRole: PropTypes.string.isRequired,
  hideData: PropTypes.bool.isRequired,
  toggleVisibility: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  userRole: getUserRole(state),
  hideData: state.scratchpad.hideData,
})

const mapDispatchToProps = {
  toggleVisibility: toggleScratchpadVisbilityAction,
}

export default connect(mapStateToProps, mapDispatchToProps)(Toggler)
