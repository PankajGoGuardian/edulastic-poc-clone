import React from 'react'

import PropTypes from 'prop-types'

export const EduIf = ({ children, condition }) => {
  if (condition) {
    return <>{children}</>
  }
  return null
}

EduIf.propTypes = {
  condition: PropTypes.any.isRequired,
  children: PropTypes.any.isRequired,
}
