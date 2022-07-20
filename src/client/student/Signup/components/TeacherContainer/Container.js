import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import { compose } from 'redux'
import Main from './Main'
import AddSchoolAndGradeModal from './AddSchoolAndGradeModal'

const Container = ({ isModal, ...rest }) => {
  if (isModal) {
    return <AddSchoolAndGradeModal {...rest} hideJoinSchoolBanner />
  }

  return <Main {...rest} />
}

Container.propTypes = {
  isModal: PropTypes.bool,
}

Container.defaultProps = {
  isModal: false,
}

const enhance = compose(withRouter)

export default enhance(Container)
